'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ClipboardCopy, Loader2, Link } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function ShortURL() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    try {
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`)
      if (!response.ok) throw new Error('Failed to shorten URL')
      setShortUrl(await response.text())
    } catch {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Link className="h-5 w-5" />
            URL Shortener
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Input
                  type="url"
                  placeholder="Enter your long URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className={cn(
                    "pr-4 transition-all duration-200",
                    "border-primary/20 focus:border-primary",
                    "bg-background/50 backdrop-blur-sm"
                  )}
                />
                <motion.div
                  initial={false}
                  animate={{ opacity: url ? 1 : 0 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <Link className="h-4 w-4" />
                </motion.div>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className={cn(
                  "whitespace-nowrap transition-all duration-200",
                  "hover:scale-105 active:scale-95"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Shortening
                  </>
                ) : 'Shorten URL'}
              </Button>
            </div>

            <AnimatePresence>
              {shortUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 pt-4">
                    <div className="relative flex-1">
                      <Input
                        readOnly
                        value={shortUrl}
                        className={cn(
                          "font-medium pr-4",
                          "bg-primary/5 border-primary/20",
                          "hover:bg-primary/10 transition-colors"
                        )}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      </motion.div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(shortUrl)
                        toast({ description: "URL copied to clipboard" })
                      }}
                      className={cn(
                        "shrink-0 transition-all duration-200",
                        "hover:scale-105 active:scale-95",
                        "hover:bg-primary hover:text-primary-foreground"
                      )}
                    >
                      <ClipboardCopy className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
} 