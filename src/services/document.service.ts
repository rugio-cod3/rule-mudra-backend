import { documentModel } from "@/common/common-module/src/database/mysql/document";
import { IDocument } from "@/common/common-module/src/interfaces/document.interface";
import { getKnexInstance } from "@/common/common-module/src/utils/mysql";
import { s3Service } from "@/services/thirdParty/s3.service"; 
// Extended interface to include presigned URL
interface IDocumentWithUrl extends IDocument {
  presignedUrl?: string | null;
}

class DocumentService {
  private documentModel = documentModel;

  // Helper method to add presigned URLs to documents
  private async addPresignedUrls(documents: IDocument[]): Promise<IDocumentWithUrl[]> {
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        try {
          const presignedUrl = await s3Service.getPresignedUrl(doc.documentFile);
          return {
            ...doc,
            presignedUrl
          };
        } catch (error) {
          console.error(`Error generating presigned URL for document ${doc.documentID}:`, error);
          return {
            ...doc,
            presignedUrl: null
          };
        }
      })
    );
    return documentsWithUrls;
  }

  async getDocumentsByCustomerAndTypes(
    customerID: number,
    types: string[]
  ): Promise<IDocumentWithUrl[]> {
    const db = getKnexInstance();
    const documents = await db
      .table('document')
      .where('customerID', customerID)
      .whereIn('type', types)
      .select('*')
      .orderBy('uploadedDate', 'desc');
    
    return await this.addPresignedUrls(documents);
  }

  async getDocumentsByLeadAndTypes(
    leadID: number,
    types: string[]
  ): Promise<IDocumentWithUrl[]> {
    const db = getKnexInstance();
    const documents = await db
      .table('document')
      .where('leadID', leadID)
      .whereIn('type', types)
      .select('*')
      .orderBy('uploadedDate', 'desc');
    
    return await this.addPresignedUrls(documents);
  }

  // Enhanced method: Get documents for specific loan with presigned URLs
  async getDocumentsByLoanAndTypes(
    leadID: number,
    customerID: number,
    types: string[]
  ): Promise<IDocumentWithUrl[]> {
    const db = getKnexInstance();
    
    // First try to get documents by leadID
    let documents = await db
      .table('document')
      .where('leadID', leadID)
      .whereIn('type', types)
      .select('*')
      .orderBy('uploadedDate', 'desc');
    
    // If no documents found by leadID, fallback to customerID
    if (documents.length === 0) {
      documents = await db
        .table('document')
        .where('customerID', customerID)
        .whereIn('type', types)
        .select('*')
        .orderBy('uploadedDate', 'desc');
    }
    
    return await this.addPresignedUrls(documents);
  }

  // Alternative method: Get documents with preference for leadID but include customerID docs
  async getDocumentsByLoanWithFallback(
    leadID: number,
    customerID: number,
    types: string[]
  ): Promise<IDocumentWithUrl[]> {
    const db = getKnexInstance();
    
    const documents = await db
      .table('document')
      .where(function() {
        this.where('leadID', leadID)
            .orWhere('customerID', customerID);
      })
      .whereIn('type', types)
      .select('*')
      .orderBy([
        { column: 'leadID', order: 'desc', nulls: 'last' }, // Prioritize leadID documents
        { column: 'uploadedDate', order: 'desc' }
      ]);
    
    return await this.addPresignedUrls(documents);
  }

  async getDocumentsByCustomer(customerID: number): Promise<IDocumentWithUrl[]> {
    const documents = await this.documentModel.findAll(
      { customerID },
      ["*"],
      [{ column: "uploadedDate", order: "desc" }]
    );
    
    return await this.addPresignedUrls(documents);
  }

  async getDocumentByType(
    customerID: number,
    type: string
  ): Promise<IDocumentWithUrl | null> {
    const document = await this.documentModel.findOne(
      { customerID, type },
      ["*"],
      [{ column: "uploadedDate", order: "desc" }]
    );
    
    if (!document) return null;
    
    const documentsWithUrls = await this.addPresignedUrls([document]);
    return documentsWithUrls[0];
  }

  // Method to get single document with presigned URL
  async getDocumentById(documentID: number): Promise<IDocumentWithUrl | null> {
    const document = await this.documentModel.findOne({ documentID });
    
    if (!document) return null;
    
    const documentsWithUrls = await this.addPresignedUrls([document]);
    return documentsWithUrls[0];
  }

  // Batch method to generate presigned URLs for multiple document paths
  async generatePresignedUrls(documentPaths: string[]): Promise<{ [key: string]: string | null }> {
    const urlMap: { [key: string]: string | null } = {};
    
    await Promise.all(
      documentPaths.map(async (path) => {
        try {
          urlMap[path] = await s3Service.getPresignedUrl(path);
        } catch (error) {
          console.error(`Error generating presigned URL for path ${path}:`, error);
          urlMap[path] = null;
        }
      })
    );
    
    return urlMap;
  }
}

export default DocumentService;