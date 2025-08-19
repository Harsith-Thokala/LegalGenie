"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, X, Plus } from "lucide-react"

interface DocumentEditModalProps {
  document: any
  isOpen: boolean
  onClose: () => void
  onSave: (updatedDocument: any) => void
  folders: any[]
  userId: string
}

export function DocumentEditModal({ 
  document, 
  isOpen, 
  onClose, 
  onSave, 
  folders, 
  userId 
}: DocumentEditModalProps) {
  const [editedDocument, setEditedDocument] = useState({
    ...document,
    // Convert database field names to form-friendly names for editing
    tags: document?.tags || []
  })
  const [newTag, setNewTag] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setEditedDocument({
      ...document,
      tags: document?.tags || []
    })
  }, [document])

  const handleSave = async () => {
    if (!editedDocument.title.trim()) {
      alert('Document title is required')
      return
    }

    setIsSaving(true)
    
    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editedDocument,
          userId: userId
        })
      })

      const data = await response.json()
      
      if (data.success) {
        onSave(data.document)
        onClose()
      } else {
        alert('Failed to save document: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving document:', error)
      alert('Failed to save document')
    } finally {
      setIsSaving(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !(editedDocument.tags || []).includes(newTag.trim())) {
      setEditedDocument({
        ...editedDocument,
        tags: [...(editedDocument.tags || []), newTag.trim()]
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditedDocument({
      ...editedDocument,
      tags: (editedDocument.tags || []).filter((tag: string) => tag !== tagToRemove)
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedDocument.title}
              onChange={(e) => setEditedDocument({
                ...editedDocument,
                title: e.target.value
              })}
              placeholder="Document title"
            />
          </div>

          {/* Type and Folder */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={editedDocument.type}
                onValueChange={(value) => setEditedDocument({
                  ...editedDocument,
                  type: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Employment">Employment</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Legal Document">Legal Document</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="folder">Folder</Label>
              <Select
                value={editedDocument.folder_id || "none"}
                onValueChange={(value) => setEditedDocument({
                  ...editedDocument,
                  folder_id: value === "none" ? null : value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Folder</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={editedDocument.status}
              onValueChange={(value) => setEditedDocument({
                ...editedDocument,
                status: value
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(editedDocument.tags || []).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={editedDocument.content}
              onChange={(e) => setEditedDocument({
                ...editedDocument,
                content: e.target.value
              })}
              placeholder="Document content"
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
