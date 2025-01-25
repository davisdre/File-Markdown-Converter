import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DragDropZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

const ACCEPTED_FILES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
};

export function DragDropZone({ onFileSelect, isLoading = false }: DragDropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILES,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8
        transition-colors duration-200 ease-in-out
        ${isDragActive ? "border-primary bg-primary/5" : "border-gray-200"}
        ${isLoading ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-primary"}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-center">
        <Upload
          className={`h-12 w-12 ${
            isDragActive ? "text-primary" : "text-gray-400"
          }`}
        />
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {isLoading ? "Converting..." : "Drop your file here or click to browse"}
          </p>
          <p className="text-xs text-gray-500">
            Supports PDF, Word, PowerPoint, and Excel files
          </p>
        </div>
        {isLoading && <Progress value={30} className="w-full max-w-xs" />}
      </div>
    </div>
  );
}
