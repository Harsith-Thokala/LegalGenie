"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface Document {
  id: string
  title: string
  type: string
  content: string
  prompt: string
  createdAt: Date
  lastModified: Date
  status: "completed" | "draft" | "archived"
  preview: string
  wordCount: number
  isFavorite: boolean
  tags: string[]
  folderId?: string
}

export interface Folder {
  id: string
  name: string
  createdAt: Date
  color: string
  documentCount: number
}

interface DocumentContextType {
  documents: Document[]
  folders: Folder[]
  currentFolderId: string | null
  addDocument: (document: Omit<Document, "id" | "createdAt" | "lastModified" | "wordCount" | "preview">) => string
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  getDocument: (id: string) => Document | undefined
  toggleFavorite: (id: string) => void
  archiveDocument: (id: string) => void
  createFolder: (name: string, color?: string) => string
  deleteFolder: (id: string) => void
  moveDocumentToFolder: (documentId: string, folderId: string | null) => void
  setCurrentFolder: (folderId: string | null) => void
  getDocumentsInFolder: (folderId: string | null) => Document[]
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider")
  }
  return context
}

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedDocuments = localStorage.getItem("legalgenie-documents")
    const savedFolders = localStorage.getItem("legalgenie-folders")

    if (savedDocuments) {
      try {
        const parsed = JSON.parse(savedDocuments)
        const documentsWithDates = parsed.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          lastModified: new Date(doc.lastModified),
        }))
        setDocuments(documentsWithDates)
      } catch (error) {
        console.error("Error loading documents:", error)
      }
    } else {
      const sampleDocuments: Document[] = [
        {
          id: "sample-1",
          title: "Non-Disclosure Agreement - TechCorp Partnership",
          type: "Contract",
          content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on ${new Date().toLocaleDateString()} by and between:

DISCLOSING PARTY: TechCorp Inc.
Address: [Company Address]

RECEIVING PARTY: Strategic Partners LLC
Address: [Recipient Address]

WHEREAS, the Disclosing Party possesses certain confidential and proprietary information related to its business operations, technology, and trade secrets;

WHEREAS, the Receiving Party desires to receive access to such confidential information for the purpose of evaluating potential business opportunities;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION
Confidential Information shall include all non-public, proprietary information disclosed by the Disclosing Party, including but not limited to technical data, trade secrets, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances, or other business information.

2. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to:
a) Hold and maintain the Confidential Information in strict confidence
b) Not disclose the Confidential Information to any third parties
c) Use the Confidential Information solely for the purpose of evaluating potential business opportunities
d) Take reasonable precautions to protect the confidentiality of the information

3. TERM
This Agreement shall remain in effect for a period of three (3) years from the date of execution, unless terminated earlier by mutual written consent.

4. RETURN OF MATERIALS
Upon termination of this Agreement, the Receiving Party shall promptly return or destroy all materials containing Confidential Information.

5. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [State/Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

DISCLOSING PARTY:                    RECEIVING PARTY:

_________________________           _________________________
[Name]                              [Name]
[Title]                             [Title]
Date: _______________               Date: _______________`,
          prompt: "Draft a non-disclosure agreement for a technology startup partnership",
          createdAt: new Date("2024-01-15"),
          lastModified: new Date("2024-01-16"),
          status: "completed",
          preview:
            "This Non-Disclosure Agreement is entered into between TechCorp Inc. and Strategic Partners LLC for the purpose of evaluating potential business opportunities...",
          wordCount: 1247,
          isFavorite: true,
          tags: ["Partnership", "Confidentiality", "Technology"],
        },
      ]
      setDocuments(sampleDocuments)
    }

    if (savedFolders) {
      try {
        const parsed = JSON.parse(savedFolders)
        const foldersWithDates = parsed.map((folder: any) => ({
          ...folder,
          createdAt: new Date(folder.createdAt),
        }))
        setFolders(foldersWithDates)
      } catch (error) {
        console.error("Error loading folders:", error)
      }
    }

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("legalgenie-documents", JSON.stringify(documents))
    }
  }, [documents, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("legalgenie-folders", JSON.stringify(folders))
    }
  }, [folders, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      setFolders((prev) =>
        prev.map((folder) => ({
          ...folder,
          documentCount: documents.filter((doc) => doc.folderId === folder.id).length,
        })),
      )
    }
  }, [documents, isLoaded])

  const generatePreview = (content: string): string => {
    return content.substring(0, 200) + (content.length > 200 ? "..." : "")
  }

  const countWords = (content: string): number => {
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const extractDocumentType = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase()
    if (lowerPrompt.includes("nda") || lowerPrompt.includes("non-disclosure")) return "Contract"
    if (lowerPrompt.includes("employment") || lowerPrompt.includes("job")) return "Employment"
    if (lowerPrompt.includes("terms") || lowerPrompt.includes("service")) return "Policy"
    if (lowerPrompt.includes("privacy")) return "Policy"
    if (lowerPrompt.includes("contract") || lowerPrompt.includes("agreement")) return "Contract"
    if (lowerPrompt.includes("lease") || lowerPrompt.includes("rental")) return "Real Estate"
    return "Legal Document"
  }

  const generateTitle = (prompt: string, type: string): string => {
    const words = prompt.split(" ").slice(0, 6)
    return words.join(" ").replace(/^./, (str) => str.toUpperCase())
  }

  const addDocument = (
    documentData: Omit<Document, "id" | "createdAt" | "lastModified" | "wordCount" | "preview">,
  ): string => {
    const now = new Date()
    const id = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newDocument: Document = {
      ...documentData,
      id,
      createdAt: now,
      lastModified: now,
      wordCount: countWords(documentData.content),
      preview: generatePreview(documentData.content),
      type: documentData.type || extractDocumentType(documentData.prompt),
      title: documentData.title || generateTitle(documentData.prompt, documentData.type || "Legal Document"),
      folderId: currentFolderId,
    }

    setDocuments((prev) => [newDocument, ...prev])
    return id
  }

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              ...updates,
              lastModified: new Date(),
              ...(updates.content && {
                wordCount: countWords(updates.content),
                preview: generatePreview(updates.content),
              }),
            }
          : doc,
      ),
    )
  }

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const getDocument = (id: string): Document | undefined => {
    return documents.find((doc) => doc.id === id)
  }

  const toggleFavorite = (id: string) => {
    updateDocument(id, { isFavorite: !documents.find((doc) => doc.id === id)?.isFavorite })
  }

  const archiveDocument = (id: string) => {
    updateDocument(id, { status: "archived" })
  }

  const createFolder = (name: string, color = "#8B5CF6"): string => {
    const id = `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newFolder: Folder = {
      id,
      name,
      createdAt: new Date(),
      color,
      documentCount: 0,
    }
    setFolders((prev) => [...prev, newFolder])
    return id
  }

  const deleteFolder = (id: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.folderId === id ? { ...doc, folderId: undefined } : doc)))
    setFolders((prev) => prev.filter((folder) => folder.id !== id))
    if (currentFolderId === id) {
      setCurrentFolderId(null)
    }
  }

  const moveDocumentToFolder = (documentId: string, folderId: string | null) => {
    updateDocument(documentId, { folderId })
  }

  const setCurrentFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId)
  }

  const getDocumentsInFolder = (folderId: string | null): Document[] => {
    return documents.filter((doc) => doc.folderId === folderId)
  }

  const value: DocumentContextType = {
    documents,
    folders,
    currentFolderId,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    toggleFavorite,
    archiveDocument,
    createFolder,
    deleteFolder,
    moveDocumentToFolder,
    setCurrentFolder,
    getDocumentsInFolder,
  }

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>
}
