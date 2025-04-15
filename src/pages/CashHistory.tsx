
import Layout from "@/components/Layout";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon, DownloadIcon, FilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample data for cash history
const cashHistoryData = [
  { 
    id: 1, 
    type: "Kasa Sayım", 
    amount: 8250, 
    date: "2023-04-15 08:30", 
    createdBy: "Ahmet Yılmaz", 
    status: "Tamamlandı",
    details: {
      banknotes: 8150,
      coins: 100,
      previousAmount: 5000,
      difference: 3250
    }
  },
  { 
    id: 2, 
    type: "Nakit Teslim", 
    amount: -2000, 
    date: "2023-04-15 17:45", 
    createdBy: "Ahmet Yılmaz", 
    recipient: "Finans Departmanı",
    note: "Günlük hasılat teslimi",
    status: "Tamamlandı"
  },
  { 
    id: 3, 
    type: "Kasa Sayım", 
    amount: 5340, 
    date: "2023-04-14 08:15", 
    createdBy: "Mehmet Demir", 
    status: "Tamamlandı",
    details: {
      banknotes: 5200,
      coins: 140,
      previousAmount: 3500,
      difference: 1840
    }
  },
  { 
    id: 4, 
    type: "Nakit Teslim", 
    amount: -3000, 
    date: "2023-04-14 18:00", 
    createdBy: "Mehmet Demir", 
    recipient: "Finans Departmanı",
    note: "Günlük hasılat teslimi",
    status: "Tamamlandı"
  },
  { 
    id: 5, 
    type: "Kasa Sayım", 
    amount: 2990, 
    date: "2023-04-13 08:45", 
    createdBy: "Ayşe Kaya", 
    status: "Tamamlandı",
    details: {
      banknotes: 2850,
      coins: 140,
      previousAmount: 2500,
      difference: 490
    }
  },
  { 
    id: 6, 
    type: "Nakit Teslim", 
    amount: -1500, 
    date: "2023-04-13 17:30", 
    createdBy: "Ayşe Kaya", 
    recipient: "Finans Departmanı",
    note: "Günlük hasılat teslimi",
    status: "Tamamlandı"
  },
];

const CashHistory = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter the data based on filters
  const filteredData = cashHistoryData.filter(item => {
    // Type filter
    if (selectedType !== "all" && selectedType !== item.type) {
      return false;
    }
    
    // Date filter (if dates are set)
    if (fromDate) {
      const itemDate = new Date(item.date);
      if (itemDate < fromDate) {
        return false;
      }
    }
    
    if (toDate) {
      const itemDate = new Date(item.date);
      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (itemDate > endOfDay) {
        return false;
      }
    }
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return item.date.toLowerCase().includes(searchLower) || 
             item.createdBy.toLowerCase().includes(searchLower) ||
             (item.recipient && item.recipient.toLowerCase().includes(searchLower)) ||
             (item.note && item.note.toLowerCase().includes(searchLower));
    }
    
    return true;
  });
  
  // Calculate totals
  const totalIn = filteredData
    .filter(item => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalOut = filteredData
    .filter(item => item.amount < 0)
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);
    
  const netAmount = totalIn - totalOut;
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kasa Geçmiş İşlemleri</h1>
          <p className="text-muted-foreground">
            Kasa sayımları ve nakit teslimleri geçmişi
          </p>
        </div>
        
        <div className="flex flex-col gap-6 md:flex-row">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Rapor Özeti</CardTitle>
              <CardDescription>
                Filtrelere göre toplam tutarlar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-md bg-green-50 p-4">
                  <div className="text-sm font-medium text-green-600">Toplam Giriş</div>
                  <div className="text-2xl font-bold text-green-700">₺{totalIn.toLocaleString()}</div>
                </div>
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm font-medium text-red-600">Toplam Çıkış</div>
                  <div className="text-2xl font-bold text-red-700">₺{totalOut.toLocaleString()}</div>
                </div>
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="text-sm font-medium text-blue-600">Net Tutar</div>
                  <div className="text-2xl font-bold text-blue-700">₺{netAmount.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <DownloadIcon className="h-4 w-4" />
                Raporu İndir
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="md:w-1/3">
            <CardHeader>
              <CardTitle>Filtrele</CardTitle>
              <CardDescription>
                Sonuçları daraltın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Ara</Label>
                <Input 
                  id="search" 
                  placeholder="İsim, not veya tarih..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="type">İşlem Tipi</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Tüm işlemler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm İşlemler</SelectItem>
                    <SelectItem value="Kasa Sayım">Kasa Sayımları</SelectItem>
                    <SelectItem value="Nakit Teslim">Nakit Teslimler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Başlangıç Tarihi</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PP", { locale: tr }) : "Tarih seçin"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>Bitiş Tarihi</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PP", { locale: tr }) : "Tarih seçin"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFromDate(undefined);
                  setToDate(undefined);
                  setSelectedType("all");
                  setSearchTerm("");
                }}
              >
                Temizle
              </Button>
              <Button className="bg-store-700 hover:bg-store-800">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>İşlem Geçmişi</CardTitle>
            <CardDescription>
              {filteredData.length} işlem listeleniyor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="p-2 pl-4 font-medium">Tarih</th>
                    <th className="p-2 font-medium">İşlem</th>
                    <th className="p-2 font-medium">Tutar</th>
                    <th className="p-2 font-medium">Kişi</th>
                    <th className="p-2 font-medium">Durum</th>
                    <th className="p-2 pr-4 font-medium">Detay</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((transaction) => (
                    <tr key={transaction.id} className="border-t">
                      <td className="p-2 pl-4 whitespace-nowrap">{transaction.date}</td>
                      <td className="p-2 whitespace-nowrap">{transaction.type}</td>
                      <td className={`p-2 whitespace-nowrap ${transaction.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                        {transaction.amount < 0 ? "-" : "+"}₺{Math.abs(transaction.amount).toLocaleString()}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {transaction.type === "Nakit Teslim" ? transaction.recipient : transaction.createdBy}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          {transaction.status}
                        </span>
                      </td>
                      <td className="p-2 pr-4">
                        <Button variant="ghost" size="sm">
                          Görüntüle
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CashHistory;
