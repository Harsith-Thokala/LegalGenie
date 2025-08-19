"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Folder, FileText, MoreVertical, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
interface FolderCardProps {
  folder: {
    id: string
    name: string
    color: string
    created_at: string
    updated_at: string
    documentCount: number
  }
  onClick: () => void
  onDelete: () => void
}

export function FolderCard({ folder, onClick, onDelete }: FolderCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1" onClick={onClick}>
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg"
              style={{ backgroundColor: `${folder.color}20` }}
            >
              <Folder className="w-6 h-6" style={{ color: folder.color }} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-1">{folder.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-3 h-3" />
                <span>
                  {folder.documentCount} document{folder.documentCount !== 1 ? "s" : ""}
                </span>
                <span>•</span>
                <span>Created {new Date(folder.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
