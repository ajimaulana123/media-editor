"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { 
    Bold, 
    AlignJustify, 
    ArrowUpDown, 
    Type, 
    TextQuote,
    RemoveFormatting,
    SplitSquareVertical,
    Undo,
    Link,
    BookOpen,
    Copy,
    Trash2,
} from "lucide-react"

export function TextEditor() {
    const [text, setText] = useState("")
    const [wordCount, setWordCount] = useState(0)
    const [charCount, setCharCount] = useState(0)
    const [format, setFormat] = useState("markdown") // markdown atau html

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value
        setText(newText)
        setWordCount(newText.trim().split(/\s+/).filter(Boolean).length)
        setCharCount(newText.length)
    }

    const boldUnicodeMap: { [key: string]: string } = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
        'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
        's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
        'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
        'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    }

    const convertToLinkedInBold = (text: string): string => {
        return text.split('').map(char => boldUnicodeMap[char] || char).join('')
    }

    const makeBold = () => {
        const textarea = document.querySelector('textarea')
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = text.substring(start, end)

        if (selectedText) {
            let newText
            if (format === 'linkedin') {
                newText = 
                    text.substring(0, start) + 
                    convertToLinkedInBold(selectedText) + 
                    text.substring(end)
            } else {
                const prefix = format === "markdown" ? "**" : "<b>"
                const suffix = format === "markdown" ? "**" : "</b>"
                newText = 
                    text.substring(0, start) + 
                    prefix + 
                    selectedText + 
                    suffix + 
                    text.substring(end)
            }
            setText(newText)
        }
    }

    const transformText = {
        reverse: () => setText(text.split('').reverse().join('')),
        capitalize: () => setText(
            text.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
        ),
        alternating: () => setText(
            text.split('')
                .map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
                .join('')
        ),
        removeSpaces: () => setText(text.replace(/\s+/g, '')),
        addLineBreaks: () => {
            const formattedText = text
                // Tambahkan line break setelah tanda baca
                .replace(/([.!?])\s*/g, '$1\n\n')
                // Bersihkan multiple line breaks
                .replace(/\n\s*\n/g, '\n\n')
                // Bersihkan spasi di awal dan akhir
                .trim()
                // Pastikan setiap kalimat dimulai di baris baru
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join('\n\n')

            setText(formattedText)
        },
        slugify: () => setText(
            text.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
        ),
        countSentences: () => {
            const sentences = text.split(/[.!?]+/).filter(Boolean).length
            alert(`Number of sentences: ${sentences}`)
        },
        copyToClipboard: async () => {
            await navigator.clipboard.writeText(text)
            alert('Text copied to clipboard!')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="p-4 sm:p-6">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                        <motion.h2 
                            className="text-xl font-semibold"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Text Editor
                        </motion.h2>
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger className="w-full sm:w-32">
                                <SelectValue placeholder="Format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="markdown">Markdown</SelectItem>
                                <SelectItem value="html">HTML</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Text Area */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <Textarea
                            placeholder="Type or paste your text here..."
                            className="min-h-[200px] sm:min-h-[300px] font-mono"
                            value={text}
                            onChange={handleTextChange}
                        />
                        <div className="absolute bottom-2 right-2 text-sm text-muted-foreground">
                            Words: {wordCount} | Characters: {charCount}
                        </div>
                    </motion.div>

                    {/* Tools Sections */}
                    <div className="space-y-4">
                        {/* Text Case Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Text Case</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                <Button variant="outline" onClick={makeBold} className="flex gap-2">
                                    <Bold className="w-4 h-4" />
                                    Bold
                                </Button>
                                <Button variant="outline" onClick={() => setText(text.toLowerCase())} className="flex gap-2">
                                    <AlignJustify className="w-4 h-4" />
                                    lowercase
                                </Button>
                                <Button variant="outline" onClick={() => setText(text.toUpperCase())} className="flex gap-2">
                                    <ArrowUpDown className="w-4 h-4" />
                                    UPPERCASE
                                </Button>
                                <Button variant="outline" onClick={transformText.capitalize} className="flex gap-2">
                                    <Type className="w-4 h-4" />
                                    Capitalize
                                </Button>
                                <Button variant="outline" onClick={transformText.alternating} className="flex gap-2">
                                    <TextQuote className="w-4 h-4" />
                                    aLtErNaTiNg
                                </Button>
                            </div>
                        </motion.div>

                        <Separator className="my-4" />

                        {/* Format Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Format</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <Button variant="outline" onClick={transformText.removeSpaces} className="flex gap-2">
                                    <RemoveFormatting className="w-4 h-4" />
                                    Remove Spaces
                                </Button>
                                <Button variant="outline" onClick={transformText.addLineBreaks} className="flex gap-2">
                                    <SplitSquareVertical className="w-4 h-4" />
                                    Add Line Breaks
                                </Button>
                                <Button variant="outline" onClick={transformText.reverse} className="flex gap-2">
                                    <Undo className="w-4 h-4" />
                                    Reverse
                                </Button>
                                <Button variant="outline" onClick={transformText.slugify} className="flex gap-2">
                                    <Link className="w-4 h-4" />
                                    Slugify
                                </Button>
                            </div>
                        </motion.div>

                        <Separator className="my-4" />

                        {/* Tools Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Tools</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <Button variant="outline" onClick={transformText.countSentences} className="flex gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Count Sentences
                                </Button>
                                <Button variant="outline" onClick={transformText.copyToClipboard} className="flex gap-2">
                                    <Copy className="w-4 h-4" />
                                    Copy to Clipboard
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setText("")}
                                    className="flex gap-2 bg-destructive/10 hover:bg-destructive/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
} 