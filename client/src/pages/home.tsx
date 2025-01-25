import { DragDropZone } from "@/components/drag-drop-zone";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FileType, Copy, Check } from "lucide-react";
import { convertFile } from "@/lib/api";

interface ConversionResult {
  fileName: string;
  markdown: string;
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [conversions, setConversions] = useState<ConversionResult[]>([]);
  const [copying, setCopying] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const convertMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await convertFile(formData);
      const fileName = formData.get("file") instanceof File 
        ? (formData.get("file") as File).name 
        : "unknown";
      return { ...response, fileName };
    },
    onSuccess: (data) => {
      setConversions(prev => [...prev, { fileName: data.fileName, markdown: data.markdown }]);
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

  const handleFileSelect = async (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);

    for (const file of newFiles) {
      const formData = new FormData();
      formData.append("file", file);
      convertMutation.mutate(formData);
    }
  };

  const handleDownload = (conversion: ConversionResult) => {
    const blob = new Blob([conversion.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${conversion.fileName.split(".")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (conversion: ConversionResult) => {
    try {
      await navigator.clipboard.writeText(conversion.markdown);
      setCopying(prev => ({ ...prev, [conversion.fileName]: true }));
      setTimeout(() => {
        setCopying(prev => ({ ...prev, [conversion.fileName]: false }));
      }, 2000);
      toast({
        title: "Copied to clipboard",
        description: "The markdown content has been copied",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
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

          {files.length > 0 && !convertMutation.isPending && (
            <div className="mt-4 flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-700">Uploaded Files:</div>
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <FileType className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {conversions.map((conversion, index) => (
          <div key={index} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{conversion.fileName}</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleCopy(conversion)}
                >
                  {copying[conversion.fileName] ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copying[conversion.fileName] ? "Copied!" : "Copy"}
                </Button>
                <Button onClick={() => handleDownload(conversion)}>
                  Download Markdown
                </Button>
              </div>
            </div>
            <Card className="p-6">
              <MarkdownPreview content={conversion.markdown} />
            </Card>
          </div>
        ))}
      </div>
      <footer className="absolute bottom-0 left-0 right-0 text-center p-4 text-sm text-gray-600">
        Made by <a href="https://x.com/davisdredotcom" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Drew</a> with ❤️ | Powered by <a href="https://replit.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Replit</a>
      </footer>
    </div>
  );
}