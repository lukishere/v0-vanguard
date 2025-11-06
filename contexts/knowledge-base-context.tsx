"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { KnowledgeBase } from '@/lib/knowledge-base';
import { Document } from 'langchain/document';

interface KnowledgeBaseContextType {
  knowledgeBase: KnowledgeBase | null;
  isLoading: boolean;
  error: Error | null;
  search: (query: string, language?: 'en' | 'es') => Promise<Document[]>;
}

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | null>(null);

export function KnowledgeBaseProvider({ children }: { children: React.ReactNode }) {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const kb = new KnowledgeBase();
        await kb.initialize();
        setKnowledgeBase(kb);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize knowledge base'));
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const search = async (query: string, language: 'en' | 'es' = 'en') => {
    if (!knowledgeBase) {
      throw new Error('Knowledge base not initialized');
    }
    return knowledgeBase.search(query, language);
  };

  return (
    <KnowledgeBaseContext.Provider value={{ knowledgeBase, isLoading, error, search }}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
}

export function useKnowledgeBase() {
  const context = useContext(KnowledgeBaseContext);
  if (!context) {
    throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
  }
  return context;
} 