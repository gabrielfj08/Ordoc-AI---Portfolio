export interface DocumentVersion {
    version: number;
    date: string;
    author: string;
    authorId: string;
    size: string;
    comment?: string;
    hash?: string; // SHA-256 hash for integrity
}

export interface ICPCertificateInfo {
    type: 'A1' | 'A3';
    issuer: string;
    subject: string;
    validFrom: string;
    validUntil: string;
    serialNumber: string;
    isValid: boolean;
}
