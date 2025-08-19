"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Scale, MessageSquare, FileText, LogIn, LogOut, User } from "lucide-react"
import { GenieLampLogo } from "./genie-lamp-logo"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function Navigation() {
  const pathname = usePathname()
  const { user, signOut, loading } = useAuth()

  const navItems = [
    {
      href: "/",
      label: "Generate Documents",
      icon: FileText,
      description: "Create legal documents with AI",
    },
    {
      href: "/chat",
      label: "Legal Assistant",
      icon: MessageSquare,
      description: "Ask legal questions",
    },
    {
      href: "/documents",
      label: "My Documents",
      icon: Scale,
      description: "View previous documents",
    },
  ]

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg p-1">
              <GenieLampLogo className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-bold text-foreground">LegalGenie</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            {loading ? (
              <div className="ml-4 w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="border-primary/20 hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4 border-primary/20 hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border">
          <div className="py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </Link>
              )
            })}

            <Link
              href="/login"
              className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <div>
                <div>Sign In</div>
                <div className="text-xs opacity-70">Access your account</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
