"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SearchErrorStateProps {
  error?: any
  searchTerm: string
  city: string
  onBack?: () => void
}

export function SearchErrorState({ error, searchTerm, city, onBack }: SearchErrorStateProps) {
  // Determine error type and message
  const getErrorMessage = () => {
    // Handle specific "no providers found" case (400 status with this exact message)
    if (error?.status === 400 && error?.data?.message?.includes('No providers found for the given profession')) {
      return {
        title: `${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} Not Available`,
        description: `We couldn't find any ${searchTerm.toLowerCase()} providers in ${city}. This might be because the profession isn't offered in this area yet.`,
        showCreateOption: true
      }
    }
    
    // Handle generic 404 "not found" cases
    if (error?.status === 404 || error?.data?.message?.includes('not found')) {
      return {
        title: `${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} Not Available`,
        description: `We're having trouble finding ${searchTerm.toLowerCase()} providers in ${city}. This might be because the profession doesn't exist in our system yet.`,
        showCreateOption: true
      }
    }
    
    // Handle server errors (500+)
    if (error?.status >= 500) {
      return {
        title: "Service Temporarily Unavailable",
        description: "Our servers are having trouble processing your request. Please try again in a moment.",
        showCreateOption: false
      }
    }
    
    // Handle client errors (400-499, excluding our specific case)
    if (error?.status >= 400 && error?.status < 500) {
      return {
        title: "Search Failed",
        description: "We encountered an issue while searching for providers. Please check your search terms and try again.",
        showCreateOption: false
      }
    }
    
    // Generic fallback for unknown errors
    return {
      title: "Search Failed",
      description: "We encountered an issue while searching for providers. Please check your connection and try again.",
      showCreateOption: false
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <Card className="max-w-md w-full p-8 text-center border-2 border-red-200/30 bg-card shadow-lg">
        <div className="mb-6 pb-6 border-b border-slate-200/20">
          <div className="w-16 h-16 bg-red-50 border-2 border-red-200/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">{errorInfo.title}</h2>
          <p className="text-muted-foreground">
            {errorInfo.description}
          </p>
        </div>

        <div className="space-y-4 mb-6 pb-6 border-b border-slate-200/20">
          <Button asChild className="w-full">
            <button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </Button>

          <Button variant="outline" asChild className="w-full bg-transparent">
            {onBack ? (
              <button onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
            ) : (
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            )}
          </Button>
        </div>

        {errorInfo.showCreateOption && (
          <div className="pt-6 border-t border-slate-200/30">
            <div className="text-sm text-muted-foreground mb-3">
              Don't see your profession?
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/create-profession">
                Create "{searchTerm}" Profession
              </Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}