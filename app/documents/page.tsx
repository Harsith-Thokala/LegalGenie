"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  FileText,
  Download,
  Eye,
  Search,
  Calendar,
  Plus,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  ArrowLeft,
  FolderPlus,
  Copy,
  File,
  Edit,
  FolderOpen,
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useDocuments } from "@/lib/document-context"
import { useRouter } from "next/navigation"
import { FolderCard } from "@/components/folder-card"
import { useAuth } from "@/lib/auth-context"
import { DocumentEditModal } from "@/components/document-edit-modal"

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#8B5CF6")
  const [isMoveToFolderOpen, setIsMoveToFolderOpen] = useState(false)
  const [documentToMove, setDocumentToMove] = useState<string | null>(null)
  const [realDocuments, setRealDocuments] = useState<any[]>([])
  const [realFolders, setRealFolders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDocument, setEditingDocument] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const {
    documents,
    folders,
    currentFolderId,
    toggleFavorite,
    archiveDocument,
    deleteDocument,
    createFolder,
    deleteFolder,
    setCurrentFolder,
    getDocumentsInFolder,
  } = useDocuments()
  const router = useRouter()
  const { user } = useAuth()

  // Fetch real documents and folders from backend
  useEffect(() => {
    if (user) {
      fetchDocuments()
      fetchFolders()
    }
  }, [user, currentFolderId])

  const fetchDocuments = async () => {
    if (!user) return
    
    try {
      const params = new URLSearchParams({ userId: user.id })
      if (currentFolderId) {
        params.append('folderId', currentFolderId)
      }
      
      const response = await fetch(`/api/documents?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setRealDocuments(data.documents)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFolders = async () => {
    if (!user) return
    
    try {
      console.log('Fetching folders for user:', user.id)
      const response = await fetch(`/api/folders?userId=${user.id}`)
      const data = await response.json()
      
      console.log('Folders response:', data)
      
      if (data.success) {
        setRealFolders(data.folders)
        console.log('Folders updated:', data.folders)
      } else {
        console.error('Failed to fetch folders:', data.error)
      }
    } catch (error) {
      console.error('Error fetching folders:', error)
    }
  }

  // Filter documents based on current folder
  const currentDocuments = currentFolderId 
    ? realDocuments.filter((doc) => doc.folder_id === currentFolderId)
    : realDocuments.filter((doc) => !doc.folder_id) // Only show documents with no folder when not in a specific folder
  const currentFolder = realFolders.find((f) => f.id === currentFolderId)

  const filteredDocuments = currentDocuments
    .filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = filterType === "all" || doc.type === filterType
      const matchesStatus = filterStatus === "all" || doc.status === filterStatus
      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "modified":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case "alphabetical":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const documentTypes = [...new Set(realDocuments.map((doc) => doc.type))]
  const totalDocuments = realDocuments.length
  const completedDocuments = realDocuments.filter((doc) => doc.status === "completed").length
  const draftDocuments = realDocuments.filter((doc) => doc.status === "draft").length

  const folderColors = ["#8B5CF6", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5A2B", "#EC4899", "#6B7280"]

  const handleViewDocument = (documentId: string) => {
    const document = realDocuments.find(doc => doc.id === documentId)
    if (document) {
      setViewingDocument(document)
      setIsViewModalOpen(true)
    }
  }

  const handleEditDocument = (document: any) => {
    setEditingDocument(document)
    setIsEditModalOpen(true)
  }

  const handleSaveDocument = (updatedDocument: any) => {
    setRealDocuments(prev => 
      prev.map(doc => doc.id === updatedDocument.id ? updatedDocument : doc)
    )
    setIsEditModalOpen(false)
    setEditingDocument(null)
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!user || !confirm('Are you sure you want to delete this document?')) return

    try {
      const response = await fetch(`/api/documents/${documentId}?userId=${user.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        setRealDocuments(prev => prev.filter(doc => doc.id !== documentId))
      } else {
        alert('Failed to delete document: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Failed to delete document')
    }
  }

  const handleToggleFavorite = async (documentId: string) => {
    if (!user) return

    const document = realDocuments.find(doc => doc.id === documentId)
    if (!document) return

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_favorite: !document.is_favorite,
          userId: user.id
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setRealDocuments(prev => 
          prev.map(doc => doc.id === documentId ? { ...doc, is_favorite: !doc.is_favorite } : doc)
        )
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleOpenMoveToFolder = (documentId: string) => {
    setDocumentToMove(documentId)
    setIsMoveToFolderOpen(true)
  }

  const handleMoveToFolder = async (folderId: string | null) => {
    if (!user || !documentToMove) {
      console.error('No user logged in or no document selected')
      alert('Please log in to move documents')
      return
    }

    console.log('Moving document:', documentToMove, 'to folder:', folderId)

    try {
      const response = await fetch(`/api/documents/${documentToMove}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folder_id: folderId,
          userId: user.id
        })
      })

      console.log('Move document response status:', response.status)
      const data = await response.json()
      console.log('Move document response data:', data)
      
      if (response.ok && data.success) {
        // Update local state immediately
        setRealDocuments(prev => 
          prev.map(doc => doc.id === documentToMove ? { ...doc, folder_id: folderId } : doc)
        )
        // Refresh both documents and folders to update everything
        await Promise.all([fetchDocuments(), fetchFolders()])
        console.log('Document moved successfully')
        
        // Close modal and reset state
        setIsMoveToFolderOpen(false)
        setDocumentToMove(null)
      } else {
        console.error('Failed to move document:', data.error || 'Unknown error')
        alert('Failed to move document: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error moving document:', error)
      alert('Failed to move document: ' + (error instanceof Error ? error.message : 'Network error'))
    }
  }

  const handleDownloadPDF = async (document: any) => {
    try {
      const jsPDF = (await import("jspdf")).default

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const maxWidth = pageWidth - 2 * margin

      doc.setFontSize(16)
      doc.setFont(undefined, "bold")
      doc.text(document.title, margin, margin + 10)

      doc.setFontSize(10)
      doc.setFont(undefined, "normal")
      doc.text(`Type: ${document.type}`, margin, margin + 25)
      doc.text(`Created: ${document.createdAt.toLocaleDateString()}`, margin, margin + 35)
      doc.text(`Modified: ${document.lastModified.toLocaleDateString()}`, margin, margin + 45)

      doc.setFontSize(11)
      const lines = doc.splitTextToSize(document.content, maxWidth)
      let yPosition = margin + 60

      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
        }
        doc.text(line, margin, yPosition)
        yPosition += 6
      })

      const totalPages = doc.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(`Generated by LegalGenie AI - Page ${i} of ${totalPages}`, margin, pageHeight - 10)
      }

      doc.save(`${document.title}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      handleDownloadDocument(document)
    }
  }

  const handleDownloadDocument = (document: any) => {
    try {
      const blob = new Blob([document.content], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
      window.document.body.appendChild(a)
      a.click()
      window.document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading document:', error)
      alert('Failed to download document')
    }
  }

  const handleCopyDocument = async (document: any) => {
    try {
      await navigator.clipboard.writeText(document.content)
      console.log("Document copied to clipboard")
    } catch (err) {
      console.error("Failed to copy document: ", err)
    }
  }

  const handleNewDocument = () => {
    router.push("/")
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !user) return

    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFolderName.trim(),
          color: selectedColor,
          userId: user.id
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setRealFolders(prev => [data.folder, ...prev])
        setNewFolderName("")
        setIsCreateFolderOpen(false)
      } else {
        alert('Failed to create folder: ' + data.error)
      }
    } catch (error) {
      console.error('Error creating folder:', error)
      alert('Failed to create folder')
    }
  }

  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId)
  }

  const handleBackToRoot = () => {
    setCurrentFolder(null)
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (!user || !confirm('Are you sure you want to delete this folder? Documents in this folder will be moved to "No Folder".')) return

    try {
      const response = await fetch(`/api/folders/${folderId}?userId=${user.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        setRealFolders(prev => prev.filter(folder => folder.id !== folderId))
        // Refresh documents to show updated folder assignments
        fetchDocuments()
      } else {
        alert('Failed to delete folder: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting folder:', error)
      alert('Failed to delete folder')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {currentFolderId && (
                <Button variant="ghost" size="sm" onClick={handleBackToRoot} className="p-1">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <h1 className="font-serif text-4xl font-bold text-foreground">
                {currentFolder ? currentFolder.name : "My Documents"}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {currentFolder
                ? `Documents in ${currentFolder.name} folder`
                : "Access and manage all your AI-generated legal documents"}
            </p>
          </div>
          <div className="flex gap-2">
            {!currentFolderId && (
              <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FolderPlus className="w-4 h-4 mr-2" />
                    New Folder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Folder Name</label>
                      <Input
                        placeholder="Enter folder name..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Color</label>
                      <div className="flex gap-2">
                        {folderColors.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full border-2 ${
                              selectedColor === color ? "border-foreground" : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                        Create Folder
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Button
              onClick={handleNewDocument}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Document
            </Button>
          </div>
        </div>

        {!currentFolderId && realFolders.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-4">Folders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {realFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onClick={() => handleFolderClick(folder.id)}
                  onDelete={() => handleDeleteFolder(folder.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{currentDocuments.length}</p>
                  <p className="text-sm text-muted-foreground">{currentFolder ? "In Folder" : "Total Documents"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {currentDocuments.filter((doc) => doc.status === "completed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
                  <FileText className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {currentDocuments.filter((doc) => doc.status === "draft").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {currentDocuments.filter((d) => d.is_favorite).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documents, types, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="modified">Last Modified</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading documents...</p>
          </CardContent>
        </Card>
      ) : filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">
              {currentFolder ? `No documents in ${currentFolder.name}` : "No documents found"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? "Try adjusting your search terms or filters"
                : currentFolder
                  ? "Start by generating documents in this folder"
                  : "Start by generating your first legal document"}
            </p>
            <Button
              onClick={handleNewDocument}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-lg transition-all duration-200 border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-serif text-lg font-semibold text-foreground truncate">{document.title}</h3>
                        {document.is_favorite && <Star className="w-4 h-4 text-accent fill-current" />}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Created {new Date(document.created_at).toLocaleDateString()}
                        </span>
                        <span>Modified {new Date(document.updated_at).toLocaleDateString()}</span>
                        <span>{document.word_count?.toLocaleString() || 0} words</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{document.preview}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            document.status === "completed"
                              ? "default"
                              : document.status === "draft"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {document.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {document.type}
                        </Badge>
                        {(document.tags || []).slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {(document.tags || []).length > 2 && (
                          <span className="text-xs text-muted-foreground">+{(document.tags || []).length - 2} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleViewDocument(document.id)}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(document)}>
                      <File className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(document)}>
                      <Download className="w-4 h-4 mr-1" />
                      TXT
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleCopyDocument(document)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleToggleFavorite(document.id)}>
                          <Star className="w-4 h-4 mr-2" />
                          {document.is_favorite ? "Remove from favorites" : "Add to favorites"}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleOpenMoveToFolder(document.id)}>
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Move to Folder
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleEditDocument(document)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Document
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDocument(document.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Document View Modal */}
      {viewingDocument && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{viewingDocument.title}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsViewModalOpen(false)
                      setEditingDocument(viewingDocument)
                      setIsEditModalOpen(true)
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadDocument(viewingDocument)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Document Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>Type: {viewingDocument.type}</span>
                <span>Status: {viewingDocument.status}</span>
                <span>Created: {new Date(viewingDocument.created_at).toLocaleDateString()}</span>
                <span>Words: {viewingDocument.word_count || 0}</span>
              </div>

              {/* Tags */}
              {viewingDocument.tags && viewingDocument.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {viewingDocument.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Document Content */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-foreground max-h-[60vh] overflow-y-auto">
                  {viewingDocument.content}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Move to Folder Modal */}
      <Dialog open={isMoveToFolderOpen} onOpenChange={setIsMoveToFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Document to Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a folder to move this document to, or select "No Folder" to remove it from all folders.
            </p>
            
            {/* No Folder Option */}
            <div 
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleMoveToFolder(null)}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">No Folder</p>
                <p className="text-sm text-muted-foreground">Remove from all folders</p>
              </div>
            </div>

            {/* Available Folders */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Available Folders:</p>
              {realFolders.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                  No folders available. Create a folder first.
                </p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {realFolders.map((folder) => (
                    <div
                      key={folder.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleMoveToFolder(folder.id)}
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: folder.color }}
                      >
                        <FolderOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{folder.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {folder.documentCount} {folder.documentCount === 1 ? 'document' : 'documents'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsMoveToFolderOpen(false)
                  setDocumentToMove(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Edit Modal */}
      {editingDocument && (
        <DocumentEditModal
          document={editingDocument}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingDocument(null)
          }}
          onSave={handleSaveDocument}
          folders={realFolders}
          userId={user?.id || ''}
        />
      )}
    </div>
  )
}
