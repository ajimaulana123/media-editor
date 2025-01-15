'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileInput } from "@/components/ui/file-input";
import { ImageDown, FileType, Image as ImageIcon } from 'lucide-react';
import { useImageProcessor } from "@/hooks/useImageProcessor";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from 'next/image'

export function ImageProcessor() {
    const {
        imageFile,
        extractedText,
        conversionProgress,
        handleImageUpload,
        handleWebpToPng,
        handleImageToText
    } = useImageProcessor();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="w-full border-0 sm:border bg-card/50 backdrop-blur-sm shadow-lg rounded-xl">
                <CardHeader className="px-0 sm:px-6">
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold 
                        bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70
                        flex items-center gap-2">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                        >
                            <ImageIcon className="h-8 w-8 text-primary" />
                        </motion.div>
                        Image Processing
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0 sm:px-6 space-y-8">
                    <div className="space-y-6 sm:space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="relative"
                        >
                            <FileInput
                                accept="image/*"
                                onChange={handleImageUpload}
                                icon={<ImageIcon className="h-8 w-8 text-primary/80" />}
                                text="Drop image here or click to browse"
                            />
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {imageFile && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6 sm:space-y-8"
                                >
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                        <Button
                                            onClick={handleWebpToPng}
                                            disabled={conversionProgress > 0}
                                            className={cn(
                                                "w-full sm:w-auto text-sm sm:text-base px-8 py-6 rounded-xl",
                                                "shadow-lg hover:shadow-xl transition-all duration-300",
                                                "bg-gradient-to-r from-primary to-primary/90",
                                                "hover:opacity-90 hover:scale-105 active:scale-95"
                                            )}
                                        >
                                            <ImageDown className="mr-2 h-5 w-5" />
                                            Convert to PNG
                                        </Button>

                                        <Button
                                            onClick={handleImageToText}
                                            className={cn(
                                                "w-full sm:w-auto text-sm sm:text-base px-8 py-6 rounded-xl",
                                                "shadow-lg hover:shadow-xl transition-all duration-300",
                                                "bg-gradient-to-r from-primary to-primary/90",
                                                "hover:opacity-90 hover:scale-105 active:scale-95"
                                            )}
                                        >
                                            <FileType className="mr-2 h-5 w-5" />
                                            Extract Text
                                        </Button>
                                    </div>

                                    <AnimatePresence>
                                        {conversionProgress > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-3"
                                            >
                                                <Progress value={conversionProgress}
                                                    className="w-full h-2.5 rounded-lg bg-muted/50" />
                                                <p className="text-sm text-muted-foreground text-center">
                                                    Converting: {conversionProgress}%
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <AnimatePresence>
                                        {extractedText && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="p-6 bg-muted/30 backdrop-blur-sm rounded-xl shadow-lg 
                                                    border border-muted-foreground/10"
                                            >
                                                <h3 className="font-semibold mb-3 text-base sm:text-lg">
                                                    Extracted Text:
                                                </h3>
                                                <p className="whitespace-pre-wrap text-sm md:text-base text-muted-foreground">
                                                    {extractedText}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "spring", duration: 0.5 }}
                                        className="max-w-4xl mx-auto rounded-xl overflow-hidden"
                                    >
                                        <div className="relative w-full aspect-auto">
                                            <Image
                                                src={URL.createObjectURL(imageFile)}
                                                alt="Preview"
                                                fill
                                                className="object-contain rounded-xl shadow-xl border border-muted-foreground/10"
                                                unoptimized
                                            />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
} 