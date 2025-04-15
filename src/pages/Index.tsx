
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, ArrowUpCircle, ArrowDownCircle, CalendarRange } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  // Sample data for the dashboard
  const todayStats = {
    totalCash: 12850,
    cashIn: 8250,
    cashOut: 3100,
    difference: 5150
  };

  // Last 5 transactions (sample data)
  const recentTransactions = [
    { id: 1, type: "Kasa Sayım", amount: 4520, date: "2023-04-15 08:30", status: "Tamamlandı" },
    { id: 2, type: "Nakit Teslimi", amount: -2000, date: "2023-04-15 17:45", status: "Tamamlandı" },
    { id: 3, type: "Kasa Sayım", amount: 5340, date: "2023-04-14 08:15", status: "Tamamlandı" },
    { id: 4, type: "Nakit Teslimi", amount: -3000, date: "2023-04-14 18:00", status: "Tamamlandı" },
    { id: 5, type: "Kasa Sayım", amount: 2990, date: "2023-04-13 08:45", status: "Tamamlandı" }
  ];

  // Recent inventory reports (sample data)
  const recentReports = [
    { id: 1, name: "Nisan Ayı Stok Raporu", date: "2023-04-01", items: 245 },
    { id: 2, name: "Mart Ayı Stok Raporu", date: "2023-03-01", items: 230 },
    { id: 3, name: "Şubat Ayı Stok Raporu", date: "2023-02-01", items: 212 }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Mağaza Yönetim Paneli</h1>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/kasa-sayim')}
              className="bg-store-700 hover:bg-store-800"
            >
              Yeni Kasa Sayımı
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Günlük Toplam Nakit</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₺{todayStats.totalCash.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Bugünkü toplam kasa tutarı
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Giren Nakit</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₺{todayStats.cashIn.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Bugünkü giriş tutarı
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Çıkan Nakit</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₺{todayStats.cashOut.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Bugünkü teslim tutarı
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Fark</CardTitle>
              <TrendingUp className="h-4 w-4 text-store-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₺{todayStats.difference.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Giriş/çıkış farkı
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">Son İşlemler</TabsTrigger>
            <TabsTrigger value="reports">Stok Raporları</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Son İşlemler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr className="text-left">
                          <th className="p-2 pl-4 font-medium">İşlem</th>
                          <th className="p-2 font-medium">Tutar</th>
                          <th className="p-2 font-medium">Tarih</th>
                          <th className="p-2 pr-4 font-medium">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-t">
                            <td className="p-2 pl-4">{transaction.type}</td>
                            <td className={`p-2 ${transaction.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                              {transaction.amount < 0 ? "-" : "+"}₺{Math.abs(transaction.amount).toLocaleString()}
                            </td>
                            <td className="p-2">{transaction.date}</td>
                            <td className="p-2 pr-4">
                              <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                {transaction.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/kasa-gecmis')}
                    className="w-full"
                  >
                    Tüm İşlemleri Görüntüle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Son Stok Raporları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr className="text-left">
                          <th className="p-2 pl-4 font-medium">Rapor Adı</th>
                          <th className="p-2 font-medium">Tarih</th>
                          <th className="p-2 pr-4 font-medium">Ürün Sayısı</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentReports.map((report) => (
                          <tr key={report.id} className="border-t">
                            <td className="p-2 pl-4">{report.name}</td>
                            <td className="p-2">{report.date}</td>
                            <td className="p-2 pr-4">{report.items}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/stok-raporlari')}
                    className="w-full"
                  >
                    Tüm Raporları Görüntüle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
