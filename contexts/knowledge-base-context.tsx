"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { KnowledgeBase } from '@/lib/knowledge-base';
import { Document } from 'langchain/document';

// Feature flag to disable KnowledgeBase functionality - temporarily disabled due to transformers import issues
const ENABLE_KNOWLEDGE_BASE = false; // process.env.NEXT_PUBLIC_ENABLE_KNOWLEDGE_BASE !== 'false';

interface KnowledgeBaseContextType {
  knowledgeBase: KnowledgeBase | null;
  isLoading: boolean;
  error: Error | null;
  isEnabled: boolean;
  search: (query: string, language?: 'en' | 'es') => Promise<Document[]>;
}

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | null>(null);

export function KnowledgeBaseProvider({ children }: { children: React.ReactNode }) {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [isLoading, setIsLoading] = useState(ENABLE_KNOWLEDGE_BASE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ENABLE_KNOWLEDGE_BASE) {
      console.log("Knowledge Base disabled via feature flag");
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        console.log("Initializing Knowledge Base...")
        const kb = new KnowledgeBase();
        await kb.ensureDefaultContentLoaded();
        setKnowledgeBase(kb);
        console.log("Knowledge Base initialized successfully")
      } catch (err) {
        console.error("Failed to initialize knowledge base:", err);
        // Set error but don't create a fallback instance to avoid further issues
        setError(err instanceof Error ? err : new Error('Knowledge base initialization failed'));
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const search = async (query: string, language: 'en' | 'es' = 'en') => {
    if (!ENABLE_KNOWLEDGE_BASE) {
      console.warn('Knowledge base search called but feature is disabled');
      return []; // Return empty results instead of throwing
    }
    if (!knowledgeBase) {
      throw new Error('Knowledge base not initialized');
    }
    await knowledgeBase.ensureDefaultContentLoaded();
    return knowledgeBase.search(query, language);
  };

  return (
    <KnowledgeBaseContext.Provider value={{ knowledgeBase, isLoading, error, isEnabled: ENABLE_KNOWLEDGE_BASE, search }}>
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
