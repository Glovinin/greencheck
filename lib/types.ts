// GreenCheck Types - Automated ESG Certification Platform

export interface ESGDocument {
  id?: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  uploadDate: Date;
  status: 'processing' | 'validated' | 'certified' | 'rejected';
  extractedData?: ESGData;
  nftCertificate?: NFTCertificate;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ESGData {
  co2Emissions: number;
  offsetMethod?: string;
  validationStatus: 'pending' | 'approved' | 'rejected';
  scientificValidation?: {
    institution: string;
    validatedAt: Date;
    confidence: number;
  };
}

export interface NFTCertificate {
  tokenId: string;
  contractAddress: string;
  blockchain: 'polygon' | 'ethereum';
  txHash: string;
  mintedAt: Date;
  metadataUri: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  company?: string;
  documents?: string[];
  createdAt: Date;
} 