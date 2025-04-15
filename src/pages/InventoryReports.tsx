
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UploadCloud, FileSpreadsheet, Download, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReportUploader from "@/components/ReportUploader";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Sample data for inventory reports
const inventoryReportsData = [
  {
    id: 1,
    name: "Nisan Ayı Stok Raporu",
    date: "2023-04-01",
    items: 245,
    totalValue: 124500,
    status: "Onaylandı",
    category: "Aylık"
  },
  {
    id: 2,
    name: "Mart Ayı Stok Raporu",
    date: "2023-03-01",
    items: 230,
    totalValue: 118750,
    status: "Onaylandı",
    category: "Aylık"
  },
  {
    id: 3,
    name: "Şubat Ayı Stok Raporu",
    date: "2023-02-01",
    items: 212,
    totalValue: 108000,
    status: "Onaylandı",
    category: "Aylık"
  },
  {
    id: 4,
    name: "Ocak Ayı Stok Raporu",
    date: "2023-01-01",
    items: 195,
    totalValue: 99500,
    status: "Onaylandı",
    category: "Aylık"
  },
  {
    id: 5,
    name: "2022 Q4 Stok Raporu",
    date: "2022-12-31",
    items: 205,
    totalValue: 112500,
    status: "Onaylandı",
    category: "Çeyreklik"
  }
];

// Sample data for low stock items
const lowStockItemsData = [
  { id: 1, name: "Ürün A", currentStock: 5, minRequiredStock: 10, category: "Elektronik" },
  { id: 2, name: "Ürün B", currentStock: 3, minRequiredStock: 15, category: "Giyim" },
  { id: 3, name: "Ürün C", currentStock: 2, minRequiredStock: 8, category: "Kozmetik" },
  { id: 4, name: "Ürün D", currentStock: 4, minRequiredStock: 12, category: "Ev Eşyası" },
  { id: 5, name: "Ürün E", currentStock: 1, minRequiredStock: 5, category: "Gıda" }
];

const InventoryReports = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploader, setShowUploader] = useState(false);

  // Filter reports based on filters
  const filteredReports = inventoryReportsData.filter(report => {
    // Category filter
    if (selectedCategory !== "all" && selectedCategory !== report.category) {
      return false;
    }
    
    // Date filter (if date is set)
    if (date) {
      const reportDate = new Date(report.date);
      const filterDate = new Date(date);
      if (
        reportDate.getFullYear() !== filterDate.getFullYear() ||
        reportDate.getMonth() !== filterDate.getMonth()
      ) {
        return false;
      }
    }
    
    // Search filter
    if (searchTerm) {
      return report.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (!file) return;
    
    // Simulate upload process
    setTimeout(() => {
      toast({
        title: "Rapor Yüklendi",
        description: `${file.name} başarıyla yüklendi.`,
      });
      setShowUploader(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stok Raporları</h1>
            <p className="text-muted-foreground">
              Stok raporlarını yönetin ve analiz edin
            </p>
          </div>
          <Button onClick={() => setShowUploader(true)} className="bg-store-700 hover:bg-store-800">
            <UploadCloud className="mr-2 h-4 w-4" />
            Rapor Yükle
          </Button>
        </div>

        {showUploader ? (
          <Card>
            <CardHeader>
              <CardTitle>Stok Raporu Yükle</CardTitle>
              <CardDescription>
                Excel veya CSV formatında stok raporu yükleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportUploader onFileUpload={handleFileUpload} />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUploader(false)}>
                İptal
              </Button>
              <Button className="bg-store-700 hover:bg-store-800" disabled>
                Yükle ve İşle
              </Button>
            </CardFooter>
          </Card>
        ) : null}

        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reports">Stok Raporları</TabsTrigger>
            <TabsTrigger value="lowStock">Azalan Stok</TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle>Stok Raporları</CardTitle>
                  <CardDescription>Tüm stok raporlarının listesi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Rapor ara..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "MMMM yyyy", { locale: tr }) : "Tarih Filtrele"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            captionLayout="dropdown-buttons"
                            fromYear={2020}
                            toYear={2025}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr className="text-left">
                          <th className="p-2 pl-4 font-medium">Rapor Adı</th>
                          <th className="p-2 font-medium">Tarih</th>
                          <th className="p-2 font-medium">Ürün Sayısı</th>
                          <th className="p-2 font-medium">Toplam Değer</th>
                          <th className="p-2 font-medium">Kategori</th>
                          <th className="p-2 pr-4 font-medium">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.map((report) => (
                          <tr key={report.id} className="border-t">
                            <td className="p-2 pl-4">
                              <div className="font-medium">{report.name}</div>
                            </td>
                            <td className="p-2">{report.date}</td>
                            <td className="p-2">{report.items}</td>
                            <td className="p-2">₺{report.totalValue.toLocaleString()}</td>
                            <td className="p-2">
                              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                {report.category}
                              </div>
                            </td>
                            <td className="p-2 pr-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <span>İşlemler</span>
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    <span>Görüntüle</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    <span>İndir</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Filtreler</CardTitle>
                  <CardDescription>Raporları kategorilerine göre filtreleyin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Kategori Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Kategoriler</SelectItem>
                        <SelectItem value="Aylık">Aylık</SelectItem>
                        <SelectItem value="Çeyreklik">Çeyreklik</SelectItem>
                        <SelectItem value="Yıllık">Yıllık</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <h3 className="mb-2 text-sm font-medium">Rapor Özeti</h3>
                    <dl className="space-y-2">
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-muted-foreground">Toplam Rapor</dt>
                        <dd className="font-medium">{filteredReports.length}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-muted-foreground">Toplam Ürün</dt>
                        <dd className="font-medium">
                          {filteredReports.reduce((sum, report) => sum + report.items, 0)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-muted-foreground">Toplam Değer</dt>
                        <dd className="font-medium">
                          ₺{filteredReports
                            .reduce((sum, report) => sum + report.totalValue, 0)
                            .toLocaleString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => {
                    setSelectedCategory("all");
                    setDate(undefined);
                    setSearchTerm("");
                  }}>
                    <Filter className="mr-2 h-4 w-4" />
                    Filtreleri Temizle
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lowStock">
            <Card>
              <CardHeader>
                <CardTitle>Azalan Stok Ürünleri</CardTitle>
                <CardDescription>Minimum stok seviyesinin altındaki ürünler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="text-left">
                        <th className="p-2 pl-4 font-medium">Ürün Adı</th>
                        <th className="p-2 font-medium">Mevcut Stok</th>
                        <th className="p-2 font-medium">Minimum Stok</th>
                        <th className="p-2 font-medium">Kategori</th>
                        <th className="p-2 pr-4 font-medium">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItemsData.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-2 pl-4 font-medium">{item.name}</td>
                          <td className="p-2">{item.currentStock}</td>
                          <td className="p-2">{item.minRequiredStock}</td>
                          <td className="p-2">{item.category}</td>
                          <td className="p-2 pr-4">
                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              item.currentStock / item.minRequiredStock < 0.3
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {item.currentStock / item.minRequiredStock < 0.3 ? "Kritik" : "Az"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Tüm Stok Durumunu Görüntüle
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default InventoryReports;

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
