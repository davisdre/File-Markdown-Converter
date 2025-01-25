import { DragDropZone } from "@/components/drag-drop-zone";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FileType } from "lucide-react";
import { convertFile } from "@/lib/api";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const { toast } = useToast();

  const convertMutation = useMutation({
    mutationFn: convertFile,
    onSuccess: (data) => {
      setMarkdown(data.markdown);
      toast({
        title: "Conversion successful",
        description: "Your file has been converted to markdown",
      });
    },
    onError: (error) => {
      toast({
        title: "Conversion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = async (file: File) => {
    setFile(file);
    const formData = new FormData();
    formData.append("file", file);
    convertMutation.mutate(formData);
  };

  const handleDownload = () => {
    if (!markdown) return;
    
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.split(".")[0] || "converted"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Convert Office Files to Markdown
          </h1>
          <p className="text-gray-600">
            Drag and drop your files to convert them to clean markdown format
          </p>
        </div>

        <Card className="p-6">
          <DragDropZone
            onFileSelect={handleFileSelect}
            isLoading={convertMutation.isPending}
          />

          {file && !convertMutation.isPending && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <FileType className="h-4 w-4" />
              <span>{file.name}</span>
            </div>
          )}
        </Card>

        {markdown && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Preview</h2>
              <Button onClick={handleDownload}>Download Markdown</Button>
            </div>
            <Card className="p-6">
              <MarkdownPreview content={markdown} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
