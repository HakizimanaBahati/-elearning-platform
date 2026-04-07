import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Play, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VideoUploaderProps {
  onVideoUpload?: (videoUrl: string, fileName: string) => void;
}

export function VideoUploader({ onVideoUpload }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState<{
    url: string;
    fileName: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Video file must be less than 500MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate video upload with progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 500);

      // Simulate upload completion
      await new Promise((resolve) => setTimeout(resolve, 3000));
      clearInterval(interval);
      setUploadProgress(100);

      // In a real implementation, this would upload to S3
      const videoUrl = URL.createObjectURL(file);
      setUploadedVideo({
        url: videoUrl,
        fileName: file.name,
      });

      onVideoUpload?.(videoUrl, file.name);
      toast.success("Video uploaded successfully");

      // Reset after 2 seconds
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      toast.error("Failed to upload video");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const event = {
        target: { files: [file] },
      } as any;
      handleFileSelect(event);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-indigo-600" />
          Upload Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedVideo ? (
          <>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-900 font-semibold mb-1">
                Drag and drop your video here
              </p>
              <p className="text-sm text-slate-600 mb-4">
                or click to select from your computer
              </p>
              <p className="text-xs text-slate-500">
                Supported formats: MP4, WebM, Ogg (Max 500MB)
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Uploading...
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900">Upload successful</p>
                <p className="text-sm text-green-800">{uploadedVideo.fileName}</p>
              </div>
            </div>

            <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
              <Play className="w-16 h-16 text-white opacity-50" />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setUploadedVideo(null)}
              >
                Upload Another
              </Button>
              <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                Continue
              </Button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Videos will be automatically transcribed for accessibility and searchability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
