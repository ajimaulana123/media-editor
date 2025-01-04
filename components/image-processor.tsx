import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileInput } from "@/components/ui/file-input";
import { ImageDown, FileType, Image as ImageIcon } from 'lucide-react';
import { useImageProcessor } from "@/hooks/useImageProcessor";

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
        <Card className="w-full border-0 sm:border bg-card/50 backdrop-blur-sm shadow-lg rounded-xl">
            <CardHeader className="px-0 sm:px-6">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold 
                    bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    Image Processing
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-6 space-y-8">
                <div className="space-y-6 sm:space-y-8">
                    <div className="relative">
                        <FileInput
                            accept="image/*"
                            onChange={handleImageUpload}
                            icon={<ImageIcon className="h-8 w-8 text-primary/80" />}
                            text="Drop image here or click to browse"
                        />
                    </div>

                    {imageFile && (
                        <div className="space-y-6 sm:space-y-8">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                <Button
                                    onClick={handleWebpToPng}
                                    disabled={conversionProgress > 0}
                                    className="w-full sm:w-auto text-sm sm:text-base px-8 py-6 rounded-xl
                                    shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r 
                                    from-primary to-primary/90 hover:opacity-90"
                                >
                                    <ImageDown className="mr-2 h-5 w-5" />
                                    Convert to PNG
                                </Button>

                                <Button
                                    onClick={handleImageToText}
                                    className="w-full sm:w-auto text-sm sm:text-base px-8 py-6 rounded-xl
                                    shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r 
                                    from-primary to-primary/90 hover:opacity-90"
                                >
                                    <FileType className="mr-2 h-5 w-5" />
                                    Extract Text
                                </Button>
                            </div>

                            {conversionProgress > 0 && (
                                <div className="space-y-3">
                                    <Progress value={conversionProgress}
                                        className="w-full h-2.5 rounded-lg bg-muted/50" />
                                    <p className="text-sm text-muted-foreground text-center">
                                        Converting: {conversionProgress}%
                                    </p>
                                </div>
                            )}

                            {extractedText && (
                                <div className="p-6 bg-muted/30 backdrop-blur-sm rounded-xl shadow-lg 
                                    border border-muted-foreground/10">
                                    <h3 className="font-semibold mb-3 text-base sm:text-lg">
                                        Extracted Text:
                                    </h3>
                                    <p className="whitespace-pre-wrap text-sm md:text-base text-muted-foreground">
                                        {extractedText}
                                    </p>
                                </div>
                            )}

                            <div className="max-w-4xl mx-auto rounded-xl overflow-hidden">
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Preview"
                                    className="w-full h-auto rounded-xl shadow-xl border border-muted-foreground/10"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 