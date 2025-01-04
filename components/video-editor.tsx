import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { FileInput } from "@/components/ui/file-input";
import { Scissors, Video } from 'lucide-react';
import { useVideoEditor } from "@/hooks/useVideoEditor";

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
        <Card className="w-full border-0 sm:border bg-card/50 backdrop-blur-sm shadow-lg rounded-xl">
            <CardHeader className="px-0 sm:px-6">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold 
                    bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    Video Editor
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-6 space-y-8">
                <div className="space-y-6 sm:space-y-8">
                    <div className="relative">
                        <FileInput
                            accept="video/*"
                            onChange={handleVideoUpload}
                            icon={<Video className="h-8 w-8 text-primary/80" />}
                            text="Drop video here or click to browse"
                        />
                    </div>

                    {videoSrc && (
                        <div className="space-y-6 sm:space-y-8">
                            <div className="grid gap-6 sm:gap-8">
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
                                        className="w-full sm:w-auto text-sm sm:text-base px-8 py-6 rounded-xl
                                        shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r 
                                        from-primary to-primary/90 hover:opacity-90"
                                    >
                                        <Scissors className="mr-2 h-5 w-5" />
                                        {isProcessing ? "Processing..." : "Cut Video"}
                                    </Button>

                                    {isProcessing && (
                                        <div className="space-y-3">
                                            <Progress value={conversionProgress}
                                                className="w-full h-2.5 rounded-lg bg-muted/50" />
                                            <p className="text-sm text-muted-foreground text-center">
                                                Processing: {conversionProgress}%
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden 
                                bg-black/5 shadow-xl border border-muted-foreground/10">
                                <video
                                    ref={videoRef}
                                    src={videoSrc}
                                    controls
                                    onLoadedMetadata={handleLoadedMetadata}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 