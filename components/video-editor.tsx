'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { FileInput } from "@/components/ui/file-input";
import { Scissors, Video, Loader2 } from 'lucide-react';
import { useVideoEditor } from "@/hooks/useVideoEditor";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function VideoEditor() {
    const {
        videoSrc,
        startTime,
        endTime,
        duration,
        isProcessing,
        conversionProgress,
        videoRef,
        handleVideoUpload,
        handleLoadedMetadata,
        handleCutVideo,
        setStartTime,
        setEndTime
    } = useVideoEditor();

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
                            <Video className="h-8 w-8 text-primary" />
                        </motion.div>
                        Video Editor
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
                                accept="video/*"
                                onChange={handleVideoUpload}
                                icon={<Video className="h-8 w-8 text-primary/80" />}
                                text="Drop video here or click to browse"
                            />
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {videoSrc && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6 sm:space-y-8"
                                >
                                    <motion.div 
                                        className="grid gap-6 sm:gap-8"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="space-y-2">
                                            <p className="text-sm md:text-base font-medium flex justify-between items-center">
                                                Start Time
                                                <span className="text-muted-foreground">{startTime.toFixed(2)}s</span>
                                            </p>
                                            <Slider
                                                value={[startTime]}
                                                min={0}
                                                max={duration}
                                                step={0.1}
                                                onValueChange={(value) => setStartTime(value[0])}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm md:text-base font-medium flex justify-between items-center">
                                                End Time
                                                <span className="text-muted-foreground">{endTime.toFixed(2)}s</span>
                                            </p>
                                            <Slider
                                                value={[endTime]}
                                                min={0}
                                                max={duration}
                                                step={0.1}
                                                onValueChange={(value) => setEndTime(value[0])}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <Button
                                                onClick={handleCutVideo}
                                                disabled={isProcessing}
                                                className={cn(
                                                    "w-full sm:w-auto text-sm sm:text-base px-8 py-6 rounded-xl",
                                                    "shadow-lg hover:shadow-xl transition-all duration-300",
                                                    "bg-gradient-to-r from-primary to-primary/90",
                                                    "hover:opacity-90 hover:scale-105 active:scale-95"
                                                )}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Scissors className="mr-2 h-5 w-5" />
                                                        Cut Video
                                                    </>
                                                )}
                                            </Button>

                                            <AnimatePresence>
                                                {isProcessing && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="space-y-3"
                                                    >
                                                        <Progress value={conversionProgress}
                                                            className="w-full h-2.5 rounded-lg bg-muted/50" />
                                                        <p className="text-sm text-muted-foreground text-center">
                                                            Processing: {conversionProgress}%
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "spring", duration: 0.5 }}
                                        className="aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden 
                                            bg-black/5 shadow-xl border border-muted-foreground/10"
                                    >
                                        <video
                                            ref={videoRef}
                                            src={videoSrc}
                                            controls
                                            onLoadedMetadata={handleLoadedMetadata}
                                            className="w-full h-full object-contain"
                                        />
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