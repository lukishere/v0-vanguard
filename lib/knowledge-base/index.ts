import { pipeline } from '@xenova/transformers';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export interface ContentMetadata {
  source: string;
  type: 'services' | 'faq' | 'about' | 'terms' | 'privacy';
  language: 'en' | 'es';
  title?: string;
}

export class KnowledgeBase {
  private model: any;
  private documents: Document[] = [];
  private splitter: RecursiveCharacterTextSplitter;
  private initialized = false;

  constructor() {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      this.model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize knowledge base:', error);
      throw error;
    }
  }

  async addContent(content: any, type: ContentMetadata['type'], language: ContentMetadata['language']) {
    if (!this.initialized) {
      throw new Error('Knowledge base not initialized');
    }

    const text = this.formatContent(content, type);
    const chunks = await this.splitter.createDocuments([text], [{
      source: `/${type}`,
      type,
      language,
      title: content.title || type
    }]);
    
    this.documents.push(...chunks);
  }

  private formatContent(content: any, type: ContentMetadata['type']): string {
    switch(type) {
      case 'services':
        return content.services.map((s: any) => 
          `${s.title}. ${s.description}. Features: ${s.features.join(', ')}`
        ).join('\n\n');
      case 'faq':
        return content.faqs.map((f: any) => 
          `Q: ${f.question} A: ${f.answer}`
        ).join('\n\n');
      case 'about':
        return `${content.mission.title}: ${content.mission.content}\n\n${content.vision.title}: ${content.vision.content}`;
      default:
        return JSON.stringify(content);
    }
  }

  async search(query: string, language: ContentMetadata['language'] = 'en'): Promise<Document[]> {
    if (!this.initialized) {
      throw new Error('Knowledge base not initialized');
    }

    try {
      const queryEmbedding = await this.getEmbedding(query);
      const results = await this.similaritySearch(queryEmbedding);
      return results.filter(doc => doc.metadata.language === language);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  private async getEmbedding(text: string): Promise<number[]> {
    const output = await this.model(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }

  private async similaritySearch(queryEmbedding: number[], k: number = 3): Promise<Document[]> {
    const scores = await Promise.all(this.documents.map(async doc => ({
      doc,
      score: await this.cosineSimilarity(queryEmbedding, doc.pageContent)
    })));
    
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(item => item.doc);
  }

  private async cosineSimilarity(a: number[], b: string): Promise<number> {
    const bEmbedding = await this.getEmbedding(b);
    const dotProduct = a.reduce((sum, val, i) => sum + val * bEmbedding[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(bEmbedding.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
} 