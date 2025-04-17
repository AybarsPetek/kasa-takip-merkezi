
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Download, Eye, FileSpreadsheet, Loader2 } from "lucide-react";
import { downloadReportFile } from "@/services/reports/fileService";
import { fetchReports, ReportData } from "@/services/reports";
import { useToast } from "@/components/ui/use-toast";

interface ReportsGridProps {
  onSelectReport: (reportId: string) => void;
  filters?: {
    category?: string;
    searchTerm?: string;
    date?: Date;
  };
}

const ReportsGrid = ({ onSelectReport, filters }: ReportsGridProps) => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        const data = await fetchReports();
        
        // Apply filters if provided
        let filteredData = [...data];
        
        if (filters) {
          if (filters.category && filters.category !== 'all') {
            filteredData = filteredData.filter(report => report.category === filters.category);
          }
          
          if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filteredData = filteredData.filter(report => 
              report.name.toLowerCase().includes(searchLower)
            );
          }
          
          if (filters.date) {
            const filterYear = filters.date.getFullYear();
            const filterMonth = filters.date.getMonth();
            
            filteredData = filteredData.filter(report => {
              const reportDate = new Date(report.date);
              return reportDate.getFullYear() === filterYear && reportDate.getMonth() === filterMonth;
            });
          }
        }
        
        setReports(filteredData);
      } catch (error) {
        console.error("Error loading reports:", error);
        toast({
          title: "Veri yükleme hatası",
          description: "Raporlar yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReports();
  }, [filters, toast]);

  const handleDownload = async (report: ReportData) => {
    if (report.filePath) {
      try {
        await downloadReportFile(report.filePath, report.name);
      } catch (error) {
        console.error("Download error:", error);
        toast({
          title: "İndirme Hatası",
          description: "Dosya indirilirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Dosya Bulunamadı",
        description: "Bu rapor için dosya bulunamadı.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-store-700" />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="h-48">
        <CardContent className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Henüz hiç rapor bulunmamaktadır.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="pl-4 font-medium">Rapor Adı</TableHead>
            <TableHead className="font-medium">Tarih</TableHead>
            <TableHead className="font-medium">Ürün Sayısı</TableHead>
            <TableHead className="font-medium">Toplam Değer</TableHead>
            <TableHead className="font-medium">Kategori</TableHead>
            <TableHead className="pr-4 font-medium">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id} className="border-t">
              <TableCell className="pl-4">
                <div className="font-medium">{report.name}</div>
              </TableCell>
              <TableCell>{new Date(report.date).toLocaleDateString('tr-TR')}</TableCell>
              <TableCell>{report.items}</TableCell>
              <TableCell>₺{report.totalValue.toLocaleString()}</TableCell>
              <TableCell>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  {report.category}
                </div>
              </TableCell>
              <TableCell className="pr-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <span>İşlemler</span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onSelectReport(report.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Analiz Et</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(report)}>
                      <Download className="mr-2 h-4 w-4" />
                      <span>İndir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsGrid;
