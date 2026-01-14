// Mock data for tests

export const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin',
}

export const mockDocument = {
    id: '1',
    name: 'Test Document.pdf',
    type: 'application/pdf',
    size: 1024000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    owner: mockUser,
    isFavorited: false,
    isArchived: false,
    folderId: null,
}

export const mockDocuments = [
    mockDocument,
    {
        ...mockDocument,
        id: '2',
        name: 'Another Document.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    {
        ...mockDocument,
        id: '3',
        name: 'Spreadsheet.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
]

export const mockFolder = {
    id: 'f1',
    name: 'Test Folder',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    owner: mockUser,
    parentId: null,
}

export const mockProcess = {
    id: 'p1',
    title: 'Test Process',
    description: 'Test process description',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    assignedTo: mockUser,
    dueDate: '2024-12-31T23:59:59Z',
}

export const mockTask = {
    id: 't1',
    title: 'Test Task',
    description: 'Test task description',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    assignedTo: mockUser,
    processId: 'p1',
}

export const mockSigner = {
    id: 's1',
    name: 'John Doe',
    email: 'john@example.com',
    color: '#3b82f6',
}

export const mockSignatureField = {
    id: 'sf1',
    type: 'signature' as const,
    x: 100,
    y: 100,
    width: 200,
    height: 60,
    page: 1,
    signerId: 's1',
}

export const mockKPIData = {
    title: 'Total Documents',
    value: 1234,
    change: 12.5,
    icon: 'FileText',
    color: 'text-blue-600',
    trend: [65, 59, 80, 81, 56, 55, 70],
}

export const mockChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
]

export const mockAPIResponse = {
    success: true,
    data: mockDocument,
    message: 'Success',
}

export const mockAPIError = {
    success: false,
    error: 'Something went wrong',
    message: 'An error occurred',
}
