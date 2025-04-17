
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyzeStockReport, StockItem } from "@/services/reportService";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, PieChart, BarChart, LineChart, Package } from "lucide-react";

interface ReportAnalysisProps {
  reportId: string;
}

const ReportAnalysis = ({ reportId }: ReportAnalysisProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    totalItems: number;
    totalValue: number;
    lowStockItems: StockItem[];
    categoryBreakdown: { category: string; count: number; value: number }[];
  } | null>(null);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setIsLoading(true);
        const analysis = await analyzeStockReport(reportId);
        setData(analysis);
      } catch (error) {
        console.error("Error loading report analysis:", error);
        toast({
          title: "Veri yükleme hatası",
          description: "Rapor analiz verileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (reportId) {
      loadReportData();
    }
  }, [reportId, toast]);

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-store-700" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <p className="text-muted-foreground">Rapor verisi bulunamadı.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stok Raporu Analizi</CardTitle>
        <CardDescription>Raporunuzun otomatik analizini görüntüleyin</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalItems}</div>
              <p className="text-xs text-muted-foreground">
                Raporda bulunan ürün sayısı
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Toplam Değer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₺{data.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Envanterin toplam değeri
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Azalan Stok</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Stok seviyesi düşük ürün sayısı
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="low-stock" className="space-y-4">
          <TabsList>
            <TabsTrigger value="low-stock">
              <Package className="mr-2 h-4 w-4" />
              <span>Azalan Stok</span>
            </TabsTrigger>
            <TabsTrigger value="categories">
              <PieChart className="mr-2 h-4 w-4" />
              <span>Kategori Dağılımı</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="low-stock" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ürün Adı</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Mevcut Stok</TableHead>
                  <TableHead>Min. Stok</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.lowStockItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.currentStock}</TableCell>
                    <TableCell>{item.minRequiredStock}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.currentStock / item.minRequiredStock < 0.3
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-yellow-500 bg-yellow-50 text-yellow-700"
                        }
                      >
                        {item.currentStock / item.minRequiredStock < 0.3
                          ? "Kritik"
                          : "Azalıyor"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Ürün Sayısı</TableHead>
                  <TableHead>Toplam Değer</TableHead>
                  <TableHead>Toplam Yüzdesi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.categoryBreakdown.map((category, index) => {
                  const percentage = ((category.value / data.totalValue) * 100).toFixed(1);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{category.category}</TableCell>
                      <TableCell>{category.count}</TableCell>
                      <TableCell>₺{category.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-md bg-muted rounded-full h-2.5">
                            <div
                              className="bg-store-600 h-2.5 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {percentage}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportAnalysis;
