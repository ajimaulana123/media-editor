import { useState } from 'react';
import { createWorker, Worker } from 'tesseract.js';
import { useToast } from '@/hooks/use-toast';

export const useImageProcessor = () => {
    const { toast } = useToast();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState<string>("");
    const [conversionProgress, setConversionProgress] = useState<number>(0);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleWebpToPng = async () => {
        if (!imageFile) return;

        try {
            setConversionProgress(10);
            const img: HTMLImageElement = new Image();
            img.src = URL.createObjectURL(imageFile);

            await new Promise((resolve, reject) => {
                img.onload = () => {
                    setConversionProgress(30);
                    resolve(null);
                };
                img.onerror = reject;
            });

            setConversionProgress(50);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');
            ctx.drawImage(img, 0, 0);

            setConversionProgress(70);
            const pngUrl = canvas.toDataURL('image/png');

            setConversionProgress(90);
            const link = document.createElement('a');
            link.download = `${imageFile.name.split('.')[0]}.png`;
            link.href = pngUrl;
            link.click();

            URL.revokeObjectURL(img.src);
            setConversionProgress(100);

            toast({
                title: "Success",
                description: "Image successfully converted to PNG"
            });

            setTimeout(() => {
                setConversionProgress(0);
            }, 1000);
        } catch (error) {
            setConversionProgress(0);
            toast({
                title: "Error",
                description: "Failed to convert image",
                variant: "destructive"
            });
            console.error('Error converting image:', error);
        }
    };

    const handleImageToText = async () => {
        if (!imageFile) return;

        try {
            setExtractedText("Recognizing text...");

            const worker: Worker = await createWorker();
            await worker.load('eng');
            await worker.reinitialize();

            const { data: { text } } = await worker.recognize(imageFile);

            await worker.terminate();
            setExtractedText(text);

            toast({
                title: "Success",
                description: "Text successfully extracted from image"
            });
        } catch (error) {
            console.error('Error extracting text:', error);
            setExtractedText("");
            toast({
                title: "Error",
                description: "Failed to extract text from image",
                variant: "destructive"
            });
        }
    };

    return {
        imageFile,
        extractedText,
        conversionProgress,
        handleImageUpload,
        handleWebpToPng,
        handleImageToText
    };
}; 