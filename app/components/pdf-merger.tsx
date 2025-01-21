"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PDFDocument } from 'pdf-lib'
import { motion, AnimatePresence } from 'framer-motion'
import { FileInput } from "@/components/ui/file-input"
import { FileIcon } from "lucide-react"

export function PDFMerger() {
    const [pdfFiles, setPdfFiles] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setPdfFiles(prev => [...prev, ...filesArray])
        }
    }

    const removePdf = (index: number) => {
        setPdfFiles(prev => prev.filter((_, i) => i !== index))
    }

    const mergePDFs = async () => {
        try {
            setIsLoading(true)
            const mergedPdf = await PDFDocument.create()

            for (const file of pdfFiles) {
                const fileBuffer = await file.arrayBuffer()
                const pdf = await PDFDocument.load(fileBuffer)
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
                copiedPages.forEach((page) => mergedPdf.addPage(page))
            }

            const mergedPdfFile = await mergedPdf.save()
            const blob = new Blob([mergedPdfFile], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            
            const link = document.createElement('a')
            link.href = url
            link.download = 'merged-document.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error merging PDFs:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto"
        >
            <Card className="p-4 sm:p-6 md:p-8">
                <div className="space-y-4 sm:space-y-6">
                    <motion.h2 
                        className="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        PDF Merger
                    </motion.h2>
                    <motion.p 
                        className="text-sm sm:text-base text-muted-foreground text-center sm:text-left"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Gabungkan beberapa file PDF menjadi satu dokumen.
                    </motion.p>
                    
                    <div className="space-y-4">
                        <div className="w-full">
                            <FileInput
                                accept=".pdf"
                                multiple
                                onChange={handleFileChange}
                                icon={<FileIcon className="h-8 w-8 text-primary/80" />}
                                text="Drop PDF files here or click to browse"
                            />
                        </div>

                        <AnimatePresence>
                            {pdfFiles.length > 0 && (
                                <motion.div 
                                    className="space-y-2"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="font-medium text-sm sm:text-base">File yang dipilih:</p>
                                    {pdfFiles.map((file, index) => (
                                        <motion.div 
                                            key={index} 
                                            className="flex items-center justify-between bg-muted p-2 sm:p-3 rounded
                                                flex-col sm:flex-row gap-2 sm:gap-4"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <span className="text-sm sm:text-base truncate max-w-[200px] sm:max-w-[300px]">
                                                {file.name}
                                            </span>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removePdf(index)}
                                                className="w-full sm:w-auto"
                                            >
                                                Hapus
                                            </Button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="mt-4 sm:mt-6"
                        >
                            <Button
                                onClick={mergePDFs}
                                disabled={pdfFiles.length < 2 || isLoading}
                                className="w-full py-2 sm:py-3 text-sm sm:text-base"
                            >
                                {isLoading ? 'Menggabungkan...' : 'Gabungkan PDF'}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
} 