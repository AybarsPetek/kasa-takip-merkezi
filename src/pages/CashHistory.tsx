
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Eye, CalendarIcon, CashIcon, TrendingUp, TrendingDown, Info, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { fetchCashCountHistory, fetchCashDeliveryHistory, fetchCashCountDetails, CashCountHistoryItem, CashDeliveryHistoryItem, CashCountDetailItem } from "@/services/cashService";

const CashHistory = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("counts");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10;
  
  // Data loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Cash count history data
  const [cashCounts, setCashCounts] = useState<CashCountHistoryItem[]>([]);
  const [cashDeliveries, setCashDeliveries] = useState<CashDeliveryHistoryItem[]>([]);
  
  // Detail view state
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedCount, setSelectedCount] = useState<CashCountHistoryItem | null>(null);
  const [countDetails, setCountDetails] = useState<CashCountDetailItem[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  
  // Sort state
  const [sortField, setSortField] = useState<string>("tarih");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Load data based on active tab
  useEffect(() => {
    loadData(currentPage);
  }, [activeTab, currentPage]);
  
  const loadData = async (page: number) => {
    setIsLoading(true);
    try {
      if (activeTab === "counts") {
        const { data, count } = await fetchCashCountHistory(page, pageSize);
        setCashCounts(data || []);
        setTotalPages(Math.ceil(count / pageSize));
      } else {
        const { data, count } = await fetchCashDeliveryHistory(page, pageSize);
        setCashDeliveries(data || []);
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Hata",
        description: "Veriler yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  // View cash count details
  const viewCashCountDetails = async (count: CashCountHistoryItem) => {
    setSelectedCount(count);
    setIsLoadingDetails(true);
    setShowDetails(true);
    
    try {
      const { details } = await fetchCashCountDetails(count.id);
      setCountDetails(details || []);
    } catch (error) {
      console.error("Error loading details:", error);
      toast({
        title: "Hata",
        description: "Detaylar yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };
  
  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    
    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} 
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );
    
    // First page
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink 
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Last page if needed
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );
    
    return items;
  };
  
  // Render sort icon
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kasa Geçmişi</h1>
          <p className="text-muted-foreground">
            Geçmiş kasa sayımları ve nakit teslimatlarını görüntüleyin.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="counts">Kasa Sayımları</TabsTrigger>
            <TabsTrigger value="deliveries">Nakit Teslimler</TabsTrigger>
          </TabsList>
          
          <TabsContent value="counts">
            <Card>
              <CardHeader>
                <CardTitle>Kasa Sayım Geçmişi</CardTitle>
                <CardDescription>
                  Tüm kasa sayım kayıtlarını görüntüleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-store-700" />
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => handleSortChange("tarih")}
                            >
                              <div className="flex items-center">
                                Tarih {renderSortIcon("tarih")}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => handleSortChange("toplam")}
                            >
                              <div className="flex items-center">
                                Toplam {renderSortIcon("toplam")}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => handleSortChange("fark")}
                            >
                              <div className="flex items-center">
                                Fark {renderSortIcon("fark")}
                              </div>
                            </TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cashCounts.length > 0 ? (
                            cashCounts.map((count) => (
                              <TableRow key={count.id}>
                                <TableCell>{formatDate(count.tarih)}</TableCell>
                                <TableCell>₺{count.toplam.toLocaleString()}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    {count.fark > 0 ? (
                                      <>
                                        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                                        <span className="text-green-600">+₺{count.fark.toLocaleString()}</span>
                                      </>
                                    ) : count.fark < 0 ? (
                                      <>
                                        <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                                        <span className="text-red-600">-₺{Math.abs(count.fark).toLocaleString()}</span>
                                      </>
                                    ) : (
                                      <span>₺0</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                                    {count.durum}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => viewCashCountDetails(count)}
                                  >
                                    <Eye className="mr-1 h-4 w-4" />
                                    Detaylar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4">
                                Kayıt bulunamadı
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {totalPages > 1 && (
                      <Pagination className="mt-4">
                        <PaginationContent>
                          {generatePaginationItems()}
                        </PaginationContent>
                      </Pagination>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deliveries">
            <Card>
              <CardHeader>
                <CardTitle>Nakit Teslim Geçmişi</CardTitle>
                <CardDescription>
                  Tüm nakit teslim kayıtlarını görüntüleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-store-700" />
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => handleSortChange("tarih")}
                            >
                              <div className="flex items-center">
                                Tarih {renderSortIcon("tarih")}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => handleSortChange("miktar")}
                            >
                              <div className="flex items-center">
                                Miktar {renderSortIcon("miktar")}
                              </div>
                            </TableHead>
                            <TableHead>Teslim Alan</TableHead>
                            <TableHead>Not</TableHead>
                            <TableHead>Durum</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cashDeliveries.length > 0 ? (
                            cashDeliveries.map((delivery) => (
                              <TableRow key={delivery.id}>
                                <TableCell>{formatDate(delivery.tarih)}</TableCell>
                                <TableCell>₺{delivery.miktar.toLocaleString()}</TableCell>
                                <TableCell>{delivery.teslim_alan}</TableCell>
                                <TableCell>{delivery.notlar || "-"}</TableCell>
                                <TableCell>
                                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                                    {delivery.durum}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4">
                                Kayıt bulunamadı
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {totalPages > 1 && (
                      <Pagination className="mt-4">
                        <PaginationContent>
                          {generatePaginationItems()}
                        </PaginationContent>
                      </Pagination>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Cash Count Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Kasa Sayım Detayları</DialogTitle>
              <DialogDescription>
                {selectedCount && `${formatDate(selectedCount.tarih)} tarihli kasa sayımı`}
              </DialogDescription>
            </DialogHeader>
            
            {isLoadingDetails ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-store-700" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary */}
                {selectedCount && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium">Toplam</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">₺{selectedCount.toplam.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium">Banknotlar</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">₺{selectedCount.banknot_toplami.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium">Bozuk Paralar</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">₺{selectedCount.bozuk_para_toplami.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* Details Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Para Tipi</TableHead>
                        <TableHead>Değer</TableHead>
                        <TableHead>Adet</TableHead>
                        <TableHead>Toplam</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {countDetails.length > 0 ? (
                        countDetails.map((detail) => (
                          <TableRow key={detail.id}>
                            <TableCell className="capitalize">{detail.para_tipi}</TableCell>
                            <TableCell>₺{detail.deger}</TableCell>
                            <TableCell>{detail.adet}</TableCell>
                            <TableCell>₺{detail.toplam.toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            Detay bulunamadı
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Notes */}
                {selectedCount && selectedCount.notlar && (
                  <div className="flex items-start rounded-md bg-muted/50 p-4">
                    <Info className="mr-2 h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Not</h4>
                      <p className="text-sm text-muted-foreground">{selectedCount.notlar}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CashHistory;
