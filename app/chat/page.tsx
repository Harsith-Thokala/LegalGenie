"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Bot, User, Scale, FileText, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

const suggestedQuestions = [
  "What are the key elements of a valid contract?",
  "How do I protect my intellectual property?",
  "What should be included in an employment agreement?",
  "What are the requirements for forming an LLC?",
  "How do confidentiality agreements work?",
  "What are my rights as a tenant?",
]

export default function ChatPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI legal assistant. I can help answer questions about legal concepts, procedures, and provide general guidance on various legal matters. Please note that I provide general information only and cannot replace professional legal advice. How can I assist you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Create chat session when user is authenticated
  useEffect(() => {
    if (user && !currentSessionId) {
      createChatSession()
    }
  }, [user])

  const createChatSession = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          title: 'Legal Consultation'
        })
      })

      const data = await response.json()
      if (data.success) {
        setCurrentSessionId(data.session.id)
      }
    } catch (error) {
      console.error('Error creating chat session:', error)
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim()) return

    // Check authentication
    if (!user || !currentSessionId) {
      alert('Please sign in to use the chat assistant')
      router.push('/login')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call real AI chat API
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          sessionId: currentSessionId,
          userId: user.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response')
      }

      const assistantMessage: Message = {
        id: data.message.id,
        content: data.message.content,
        sender: "assistant",
        timestamp: new Date(data.message.timestamp),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }

    setIsLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg">
            <MessageSquare className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Legal Assistant</h1>
            <p className="text-muted-foreground">Get instant answers to your legal questions</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
            <Scale className="w-4 h-4 text-primary" />
            <div>
              <p className="font-medium text-xs">Legal Expertise</p>
              <p className="text-xs text-muted-foreground">Trained on legal knowledge</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
            <Clock className="w-4 h-4 text-accent" />
            <div>
              <p className="font-medium text-xs">Instant Responses</p>
              <p className="text-xs text-muted-foreground">Get answers immediately</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
            <FileText className="w-4 h-4 text-primary" />
            <div>
              <p className="font-medium text-xs">Comprehensive</p>
              <p className="text-xs text-muted-foreground">Covers multiple legal areas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Suggested Questions Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSendMessage(question)}
                  className="w-full text-left justify-start h-auto p-3 text-xs leading-relaxed hover:bg-muted break-words whitespace-normal"
                  disabled={isLoading}
                >
                  <span className="block overflow-hidden">{question}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b flex-shrink-0 py-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="w-5 h-5 text-primary" />
                Legal AI Assistant
                <Badge variant="secondary" className="ml-auto text-xs">
                  Online
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              <div className="flex-1 overflow-hidden">
                <ScrollArea ref={scrollAreaRef} className="h-full">
                  <div className="p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-gradient-to-br from-accent to-primary text-primary-foreground"
                          }`}
                        >
                          {message.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground border border-border"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                          <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary text-primary-foreground">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-muted text-foreground border border-border rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                            <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <div className="border-t p-4 flex-shrink-0 bg-background">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a legal question..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This AI provides general information only. Always consult a qualified attorney for legal advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
