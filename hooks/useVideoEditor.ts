import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useToast } from "@/hooks/use-toast";

export const useVideoEditor = () => {
  const { toast } = useToast();
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionProgress, setConversionProgress] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setEndTime(videoRef.current.duration);
    }
  };

  const handleCutVideo = async () => {
    if (!videoSrc) return;

    try {
      setIsProcessing(true);
      const ffmpeg = new FFmpeg();

      await ffmpeg.load({
        coreURL: await toBlobURL(
          "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.js",
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.wasm",
          "application/wasm"
        ),
      });

      ffmpeg.on("progress", ({ progress }) => {
        setConversionProgress(Math.round(progress * 100));
      });

      const inputData = await fetchFile(videoSrc);
      await ffmpeg.writeFile("input.mp4", inputData);

      // Optimized FFmpeg Command (Maintaining Resolution)
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-ss",
        `${startTime.toFixed(3)}`, // Start at precise time
        "-to",
        `${endTime.toFixed(3)}`, // End at precise time
        "-c:v",
        "copy", // Copy video codec (no re-encoding)
        "-c:a",
        "copy", // Copy audio codec (no re-encoding)
        "-threads",
        "4", // Enable multi-threading
        "-copyts", // Preserve timestamps
        "output.mp4",
      ]);

      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([data], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      // Trigger Download
      const link = document.createElement("a");
      link.href = url;
      link.download = "trimmed_video.mp4";
      link.click();

      URL.revokeObjectURL(url);
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");

      setIsProcessing(false);
      setConversionProgress(100);

      toast({
        title: "Success",
        description: `Video cut from ${startTime.toFixed(
          3
        )}s to ${endTime.toFixed(3)}s`,
      });
    } catch (error) {
      console.error("Error cutting video:", error);
      setIsProcessing(false);
      setConversionProgress(0);
      toast({
        title: "Error",
        description: "Video might be too large. Try a smaller file.",
        variant: "destructive",
      });
    }
  };

  return {
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
    setEndTime,
  };
};
