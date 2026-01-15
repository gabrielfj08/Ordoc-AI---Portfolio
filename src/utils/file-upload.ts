import { documentService } from '@/services/documents';

// Interfaces for File System Access API (non-standard in some environments)
interface FileSystemEntry {
    isFile: boolean;
    isDirectory: boolean;
    name: string;
}

interface FileSystemFileEntry extends FileSystemEntry {
    file: (callback: (file: File) => void, errorCallback?: (error: any) => void) => void;
}

interface FileSystemDirectoryEntry extends FileSystemEntry {
    createReader: () => FileSystemDirectoryReader;
}

interface FileSystemDirectoryReader {
    readEntries: (
        successCallback: (entries: FileSystemEntry[]) => void,
        errorCallback?: (error: any) => void
    ) => void;
}

/**
 * Process dropped items recursively, creating folders and uploading files.
 * 
 * @param items The DataTransferItemList from the drop event
 * @param parentId The ID of the current directory (or null for root)
 * @param onUpload Callback to trigger the actual file upload
 */
export async function processDropItems(
    items: DataTransferItemList,
    parentId: string | null | undefined,
    onUpload: (file: File, parentId?: string) => Promise<void>
): Promise<void> {
    const entries: FileSystemEntry[] = [];

    // 1. Get all entries from DataTransferItemList
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
            const entry = item.webkitGetAsEntry?.() as FileSystemEntry | null;
            if (entry) {
                entries.push(entry);
            }
        }
    }

    // 2. Process them recursively
    for (const entry of entries) {
        await traverseFileTree(entry, parentId, onUpload);
    }
}

/**
 * Recursively traverse a FileSystemEntry.
 */
async function traverseFileTree(
    entry: FileSystemEntry,
    parentId: string | null | undefined,
    onUpload: (file: File, parentId?: string) => Promise<void>
): Promise<void> {
    if (entry.isFile) {
        const fileEntry = entry as FileSystemFileEntry;
        return new Promise<void>((resolve) => {
            fileEntry.file(async (file) => {
                // Logic to prevent uploading hidden system files if necessary
                if (
                    file.name !== '.DS_Store' &&
                    !file.name.startsWith('._') &&
                    !file.name.endsWith('.html') && // Ignore HTML artifacts in test folder
                    !file.name.endsWith('.tmp')
                ) {
                    await onUpload(file, parentId || undefined);
                }
                resolve();
            }, (err) => {
                console.error("Error reading file", err);
                resolve(); // Resolve anyway to not break chain
            });
        });
    } else if (entry.isDirectory) {
        const dirEntry = entry as FileSystemDirectoryEntry;

        // 1. Create directory in backend or find existing
        let newParentId: string | undefined = undefined;

        try {
            // Check if folder exists to avoid duplicates (optional but good UX)
            // Note: This might be slow for massive trees. Optimistically creating might be better depending on API.
            // Here we assume we want to merge or create.

            // Attempt to find existing folder in the current parent
            const listParams: any = {
                page_size: 100
            };

            if (parentId) {
                listParams.parent = parentId;
            } else {
                listParams.is_root = true;
            }

            const existingDirs = await documentService.listDirectories(listParams);

            const existing = existingDirs.results.find(d => d.name === entry.name);

            if (existing) {
                newParentId = existing.id;
                console.log(`Using existing directory: ${entry.name} (${newParentId})`);
            } else {
                // Create new
                // console.log(`Creating new directory: ${entry.name} in parent: ${parentId}`);
                const newDir = await documentService.createDirectory({
                    name: entry.name,
                    parent_directory: parentId || undefined
                });
                newParentId = newDir.id;
                console.log(`Created new directory: ${entry.name} (${newParentId})`);
            }

        } catch (err) {
            console.error(`Failed to handle directory ${entry.name}`, err);
            // If we fail to create/find folder, we might skip its contents or try to upload to root?
            // Skipping is safer to avoid mess.
            return;
        }

        // 2. Read entries of this directory
        const reader = dirEntry.createReader();
        const readEntries = async (): Promise<FileSystemEntry[]> => {
            return new Promise((resolve, reject) => {
                reader.readEntries((entries) => resolve(entries), (err) => reject(err));
            });
        };

        try {
            // readEntries might need to be called multiple times if there are many files (browser implementation detail)
            // But usually simple recursion works.
            let childEntries = await readEntries();

            // Recursive call for children
            for (const child of childEntries) {
                await traverseFileTree(child, newParentId, onUpload);
            }
        } catch (err) {
            console.error(`Error reading directory ${entry.name}`, err);
        }
    }
}

/**
 * Process files from an input element (webkitdirectory), reconstructing structure.
 * 
 * @param files The FileList from the input
 * @param parentId The ID of the current directory (or null for root)
 * @param onUpload Callback to trigger the actual file upload
 */
/**
 * Process files from an input element (webkitdirectory), reconstructing structure.
 * Optimized to use bulk folder creation.
 * 
 * @param files The FileList from the input
 * @param parentId The ID of the current directory (or null for root)
 * @param onUpload Callback to trigger the actual file upload
 */
export async function processInputFiles(
    files: FileList,
    parentId: string | null | undefined,
    onUpload: (file: File, parentId?: string) => Promise<void>
): Promise<void> {

    // 1. Collect all unique directory paths
    const directoryPaths = new Set<string>();
    const fileArray = Array.from(files);

    console.log(`[BulkUpload] Processing ${fileArray.length} files...`);

    for (const file of fileArray) {
        // Filter invalid
        if (
            file.name === '.DS_Store' ||
            file.name.startsWith('._') ||
            file.name.endsWith('.html') ||
            file.name.endsWith('.tmp')
        ) {
            continue;
        }

        const relativePath = file.webkitRelativePath; // e.g. "Folder/Sub/File.txt"
        if (relativePath) {
            const parts = relativePath.split('/');
            // If has folder structure (length > 1)
            // Extract all intermediate paths
            // "A/B/C/file" -> "A", "A/B", "A/B/C"
            let currentPath = "";
            for (let i = 0; i < parts.length - 1; i++) {
                const dirName = parts[i];
                currentPath = currentPath ? `${currentPath}/${dirName}` : dirName;
                directoryPaths.add(currentPath);
            }
        }
    }

    // 2. Bulk Create Folders (One atomic request)
    let folderMap: Record<string, string> = {};
    if (directoryPaths.size > 0) {
        const paths = Array.from(directoryPaths);
        console.log(`[BulkUpload] Creating ${paths.length} folders...`, paths);

        try {
            const response = await documentService.bulkCreateFolders(paths, parentId || undefined);
            folderMap = response.folder_map || {};
            console.log(`[BulkUpload] Folders created. Map:`, folderMap);
        } catch (err) {
            console.error("[BulkUpload] Failed to create folders", err);
            // Fallback? Or abort? 
            // Aborting ensures we don't dump files in root messily.
            // But we could dump in root if strictly needed. 
            // Let's abort for safety and show error (console).
            return;
        }
    }

    // 3. Upload Files
    // Parallel limit could be implemented here, but browsers handle ~6 concurrent well.
    // For simplicity, we loop.
    let uploadedCount = 0;

    // Sort files by size? Or just iterate.
    for (const file of fileArray) {
        // Filter invalid again (or pre-filter list)
        if (
            file.name === '.DS_Store' ||
            file.name.startsWith('._') ||
            file.name.endsWith('.html') ||
            file.name.endsWith('.tmp')
        ) {
            continue;
        }

        const relativePath = file.webkitRelativePath;
        let targetParentId = parentId;

        if (relativePath) {
            const parts = relativePath.split('/');
            if (parts.length > 1) {
                // Parent path is everything excluding filename
                // "A/B/file.txt" -> "A/B"
                const parentPathKey = parts.slice(0, -1).join('/');

                // Lookup UUID
                if (folderMap[parentPathKey]) {
                    targetParentId = folderMap[parentPathKey];
                }
            }
        }

        await onUpload(file, targetParentId || undefined);
        uploadedCount++;
    }

    console.log(`[BulkUpload] Completed. ${uploadedCount} files uploaded.`);
}
