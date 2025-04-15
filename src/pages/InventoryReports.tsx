
import Layout from "@/components/Layout";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileIcon, FileSpreadsheet, FileText, UploadCloud, PlusCircle, SearchIcon, Package2Icon, DownloadIcon, RefreshCw, BarChart4 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ReportUploader from "@/components/ReportUploader";

// Sample data for inventory reports
const inventoryReports = [
  {
    id: 1,
    name: "Nisan 2023 Stok Raporu",
    date: "2023-04-01",
    items: 245,
    fileSize: "1.2 MB",
    fileType: "excel",
    status: "completed",
    categories: [
      { name: "Elektronik", count: 58, value: 24500 },
      { name: "Giyim", count: 120, value: 18700 },
      { name: "Kozmetik", count: 67, value: 12300 }
    ]
  },
  {
    id: 2,
    name: "Mart 2023 Stok Raporu",
    date: "2023-03-01",
    items: 230,
    fileSize: "1.1 MB",
    fileType: "excel",
    status: "completed",
    categories: [
      { name: "Elektronik", count: 52, value: 22800 },
      { name: "Giyim", count: 110, value: 17200 },
      { name: "Kozmetik", count: 68, value: 13000 }
    ]
  },
  {
    id: 3,
    name: "Şubat 2023 Stok Raporu",
    date: "2023-02-01",
    items: 212,
    fileSize: "980 KB",
    fileType: "excel",
    status: "completed",
    categories: [
      { name: "Elektronik", count: 48, value: 19200 },
      { name: "Giyim", count: 102, value: 16300 },
      { name: "Kozmetik", count: 62, value: 11500 }
    ]
  },
  {
    id: 4,
    name: "Ocak 2023 Stok Raporu",
    date: "2023-01-01",
    items: 205,
    fileSize: "950 KB",
    fileType: "excel",
    status: "completed",
    categories: [
      { name: "Elektronik", count: 45, value: 18500 },
      { name: "Giyim", count: 100, value: 15800 },
      { name: "Kozmetik", count: 60, value: 11000 }
    ]
  }
];

const InventoryReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<number | null>(null);

  // Filter reports based on search term
  const filteredReports = inventoryReports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.date.includes(searchTerm)
  );
  
  // Get the selected report details
  const reportDetails = selectedReport !== null 
    ? inventoryReports.find(report => report.id === selectedReport) 
    : null;
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stok Raporları</h1>
          <p className="text-muted-foreground">
            Stok raporlarını yükleyin ve görüntüleyin
          </p>
        </div>
        
        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
            <TabsTrigger value="upload">Yeni Rapor Yükle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Stok Raporları</CardTitle>
                    <CardDescription>
                      Geçmiş stok raporlarını görüntüleyin
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rapor ara..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        {filteredReports.map(report => (
                          <button
                            key={report.id}
                            onClick={() => setSelectedReport(report.id)}
                            className={`w-full rounded-md p-3 text-left transition-colors ${
                              selectedReport === report.id
                                ? "bg-store-50 text-store-700"
                                : "hover:bg-muted"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="rounded bg-muted p-2">
                                {report.fileType === "excel" ? (
                                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                ) : (
                                  <FileText className="h-5 w-5 text-blue-600" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="font-medium">{report.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {report.date} • {report.items} ürün
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                        
                        {filteredReports.length === 0 && (
                          <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed">
                            <FileIcon className="h-10 w-10 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Arama kriterlerine uygun rapor bulunamadı
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setSearchTerm("")}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Tüm Raporları Göster
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="md:col-span-2 space-y-6">
                {reportDetails ? (
                  <>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{reportDetails.name}</CardTitle>
                            <CardDescription>
                              Yüklenme Tarihi: {reportDetails.date}
                            </CardDescription>
                          </div>
                          <Badge className="bg-green-600">Tamamlandı</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="rounded-md bg-muted p-4 text-center">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Toplam Ürün
                            </h4>
                            <div className="mt-2 flex items-center justify-center gap-1">
                              <Package2Icon className="h-4 w-4 text-store-600" />
                              <span className="text-2xl font-bold">
                                {reportDetails.items}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-md bg-muted p-4 text-center">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Dosya Boyutu
                            </h4>
                            <div className="mt-2 flex items-center justify-center gap-1">
                              <FileIcon className="h-4 w-4 text-store-600" />
                              <span className="text-2xl font-bold">
                                {reportDetails.fileSize}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-md bg-muted p-4 text-center">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Kategoriler
                            </h4>
                            <div className="mt-2 flex items-center justify-center gap-1">
                              <BarChart4 className="h-4 w-4 text-store-600" />
                              <span className="text-2xl font-bold">
                                {reportDetails.categories.length}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Kategori Dağılımı</h4>
                          <div className="space-y-3">
                            {reportDetails.categories.map(category => (
                              <div key={category.name} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span>{category.name}</span>
                                  <span className="text-muted-foreground">{category.count} ürün</span>
                                </div>
                                <Progress 
                                  value={(category.count / reportDetails.items) * 100} 
                                  className="h-2" 
                                />
                                <div className="text-right text-xs text-muted-foreground">
                                  Değer: ₺{category.value.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">
                          <DownloadIcon className="h-4 w-4 mr-2" />
                          Raporu İndir
                        </Button>
                        <Button className="bg-store-700 hover:bg-store-800">
                          Detaylı Görüntüle
                        </Button>
                      </CardFooter>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Rapor Bilgileri</CardTitle>
                      <CardDescription>
                        Görüntülemek için bir rapor seçin
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex h-64 flex-col items-center justify-center rounded-md border border-dashed">
                      <FileIcon className="h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Sol taraftaki listeden bir rapor seçin
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload">
            <div className="grid gap-6 md:grid-cols-2">
              <ReportUploader />
              
              <Card>
                <CardHeader>
                  <CardTitle>Rapor Yükleme Talimatları</CardTitle>
                  <CardDescription>
                    Stok raporları için bilgiler
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Desteklenen Dosya Formatları</h4>
                    <p className="text-sm text-muted-foreground">
                      Raporlarınızı aşağıdaki formatlardan birinde yükleyebilirsiniz:
                    </p>
                    <ul className="mt-2 list-disc pl-6 text-sm">
                      <li>Excel (.xlsx, .xls)</li>
                      <li>CSV (.csv)</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium">Gerekli Sütunlar</h4>
                    <p className="text-sm text-muted-foreground">
                      Stok raporunuzda aşağıdaki sütunların bulunması gerekmektedir:
                    </p>
                    <ul className="mt-2 list-disc pl-6 text-sm">
                      <li>Ürün Kodu</li>
                      <li>Ürün Adı</li>
                      <li>Kategori</li>
                      <li>Miktar</li>
                      <li>Birim Fiyat</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium">Maksimum Dosya Boyutu</h4>
                    <p className="text-sm text-muted-foreground">
                      Yükleyebileceğiniz maksimum dosya boyutu 10 MB'dir.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Şablon İndir</h4>
                    <p className="text-sm text-muted-foreground">
                      Stok rapor şablonunu indirerek başlayabilirsiniz:
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <DownloadIcon className="h-4 w-4" />
                        Excel Şablonu İndir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default InventoryReports;
