import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReportUploaderProps {
  onFileUpload?: (file: File) => void;
}

const ReportUploader = ({ onFileUpload }: ReportUploaderProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [reportName, setReportName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls') && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Desteklenmeyen dosya formatı",
          description: "Lütfen Excel veya CSV dosyası yükleyin.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Dosya boyutu çok büyük",
          description: "Maksimum dosya boyutu 10MB olmalıdır.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Extract report name from file name (remove extension)
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setReportName(fileName);
      
      // Set today's date as the default report date
      const today = new Date().toISOString().slice(0, 10);
      setReportDate(today);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Dosya seçilmedi",
        description: "Lütfen bir rapor dosyası seçin.",
        variant: "destructive",
      });
      return;
    }
    
    if (!reportName) {
      toast({
        title: "Rapor adı gerekli",
        description: "Lütfen rapor için bir isim girin.",
        variant: "destructive",
      });
      return;
    }
    
    if (!reportDate) {
      toast({
        title: "Rapor tarihi gerekli",
        description: "Lütfen rapor için bir tarih seçin.",
        variant: "destructive",
      });
      return;
    }
    
    // Start upload process
    setUploading(true);
    setUploadStatus("uploading");
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus("success");
        setUploading(false);
        
        toast({
          title: "Rapor başarıyla yüklendi",
          description: `${reportName} raporu sisteme eklendi.`,
        });
        
        // Call the onFileUpload callback if provided
        if (onFileUpload && file) {
          onFileUpload(file);
        }
      }
    }, 200);
  };
  
  // Reset form
  const resetForm = () => {
    setFile(null);
    setReportName("");
    setReportDate("");
    setUploadProgress(0);
    setUploadStatus("idle");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yeni Stok Raporu Yükle</CardTitle>
        <CardDescription>
          Excel veya CSV formatında stok raporu yükleyin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Rapor Dosyası</Label>
            {!file ? (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-6">
                <div className="mb-4 rounded-full bg-muted p-3">
                  <UploadCloud className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="mb-4 text-center">
                  <p className="text-sm font-medium">Dosyayı buraya sürükleyin veya seçin</p>
                  <p className="text-xs text-muted-foreground">
                    Excel (.xlsx, .xls) veya CSV (.csv)
                  </p>
                </div>
                <Input 
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Dosya Seç
                </Button>
              </div>
            ) : (
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded bg-muted p-2">
                      {file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-green-600"
                        >
                          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                          <path d="M4 7V2h10v4a2 2 0 0 0 2 2h4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
                          <path d="M10 12h2v6" />
                          <path d="M16 18h-6" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-blue-600"
                        >
                          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                          <path d="M4 7V2h10v4a2 2 0 0 0 2 2h4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
                          <path d="M10 12v6" />
                          <path d="M14 12v6" />
                          <path d="M10 18h4" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    Değiştir
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="report-name">Rapor Adı</Label>
            <Input
              id="report-name"
              placeholder="Örn: Nisan 2023 Stok Raporu"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              disabled={uploading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="report-date">Rapor Tarihi</Label>
            <Input
              id="report-date"
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              disabled={uploading}
            />
          </div>
          
          {uploadStatus === "uploading" && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Yükleniyor</Label>
                <span className="text-xs text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          {uploadStatus === "success" && (
            <div className="flex items-center rounded-md bg-green-50 p-3 text-sm text-green-600">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              <span>Rapor başarıyla yüklendi!</span>
            </div>
          )}
          
          {uploadStatus === "error" && (
            <div className="flex items-center rounded-md bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>Yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin.</span>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={uploading}
        >
          Formu Temizle
        </Button>
        <Button
          type="submit"
          className="bg-store-700 hover:bg-store-800"
          disabled={!file || uploading || uploadStatus === "success"}
          onClick={handleSubmit}
        >
          {uploading ? "Yükleniyor..." : "Raporu Yükle"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportUploader;
