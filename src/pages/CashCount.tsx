
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CashSummary from "@/components/CashSummary";
import { saveCashCount, saveCashDelivery, fetchPreviousCashDeliveries, fetchLatestCashCount, CashDenomination, CashDelivery } from "@/services/cashService";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const CashCount = () => {
  const { toast } = useToast();
  
  // Cash denominations in Turkish Lira
  const [banknotes, setBanknotes] = useState<CashDenomination[]>([
    { value: 200, label: "₺200", count: 0 },
    { value: 100, label: "₺100", count: 0 },
    { value: 50, label: "₺50", count: 0 },
    { value: 20, label: "₺20", count: 0 },
    { value: 10, label: "₺10", count: 0 },
    { value: 5, label: "₺5", count: 0 }
  ]);
  
  const [coins, setCoins] = useState<CashDenomination[]>([
    { value: 1, label: "₺1", count: 0 },
    { value: 0.5, label: "50 kuruş", count: 0 },
    { value: 0.25, label: "25 kuruş", count: 0 },
    { value: 0.1, label: "10 kuruş", count: 0 },
    { value: 0.05, label: "5 kuruş", count: 0 },
    { value: 0.01, label: "1 kuruş", count: 0 }
  ]);
  
  const [previousCashAmount, setPreviousCashAmount] = useState<number>(0);
  const [cashDelivery, setCashDelivery] = useState<CashDelivery>({
    amount: 0,
    recipient: "",
    note: ""
  });
  const [countNote, setCountNote] = useState<string>("");
  const [countDate, setCountDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [previousDeliveries, setPreviousDeliveries] = useState<any[]>([]);
  
  const [isCountLoading, setIsCountLoading] = useState<boolean>(false);
  const [isDeliveryLoading, setIsDeliveryLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  // Calculate totals
  const banknotesTotal = banknotes.reduce((sum, item) => sum + (item.value * item.count), 0);
  const coinsTotal = coins.reduce((sum, item) => sum + (item.value * item.count), 0);
  const cashTotal = Math.round((banknotesTotal + coinsTotal) * 100) / 100;
  
  // Load previous amount and deliveries
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get latest cash count
        const latestCount = await fetchLatestCashCount();
        if (latestCount) {
          setPreviousCashAmount(latestCount.toplam);
        }
        
        // Get previous deliveries
        const deliveries = await fetchPreviousCashDeliveries();
        setPreviousDeliveries(deliveries);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Veri Yükleme Hatası",
          description: "Önceki veriler yüklenirken bir hata oluştu.",
          variant: "destructive"
        });
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  // Update count for banknotes
  const updateBanknoteCount = (index: number, count: number) => {
    const newBanknotes = [...banknotes];
    newBanknotes[index].count = count;
    setBanknotes(newBanknotes);
  };
  
  // Update count for coins
  const updateCoinCount = (index: number, count: number) => {
    const newCoins = [...coins];
    newCoins[index].count = count;
    setCoins(newCoins);
  };
  
  // Handle cash delivery form changes
  const handleDeliveryChange = (field: keyof CashDelivery, value: string | number) => {
    setCashDelivery(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Submit cash count
  const submitCashCount = async () => {
    setIsCountLoading(true);
    
    try {
      await saveCashCount(
        banknotesTotal,
        coinsTotal,
        cashTotal,
        previousCashAmount,
        cashTotal - previousCashAmount,
        countNote,
        countDate,
        [...banknotes, ...coins]
      );
      
      toast({
        title: "Kasa sayımı kaydedildi",
        description: `Toplam: ₺${cashTotal.toLocaleString()} - Tarih: ${new Date(countDate).toLocaleString('tr-TR')}`,
      });
      
      // Update previous amount to current total
      setPreviousCashAmount(cashTotal);
      
      // Reset form fields
      setCountNote("");
    } catch (error) {
      console.error('Error submitting cash count:', error);
      toast({
        title: "Hata",
        description: "Kasa sayımı kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsCountLoading(false);
    }
  };
  
  // Submit cash delivery
  const submitCashDelivery = async () => {
    if (cashDelivery.amount <= 0) {
      toast({
        title: "Hata",
        description: "Geçerli bir tutar giriniz",
        variant: "destructive"
      });
      return;
    }
    
    if (cashDelivery.amount > cashTotal) {
      toast({
        title: "Hata",
        description: "Teslim tutarı mevcut nakitten fazla olamaz",
        variant: "destructive"
      });
      return;
    }
    
    if (!cashDelivery.recipient) {
      toast({
        title: "Hata",
        description: "Teslim alan kişiyi belirtiniz",
        variant: "destructive"
      });
      return;
    }
    
    setIsDeliveryLoading(true);
    
    try {
      const result = await saveCashDelivery(cashDelivery);
      
      toast({
        title: "Nakit teslimi kaydedildi",
        description: `₺${cashDelivery.amount.toLocaleString()} - ${cashDelivery.recipient}`,
      });
      
      // Update previous deliveries list
      setPreviousDeliveries(prev => [result, ...prev.slice(0, 4)]);
      
      // Reset form
      setCashDelivery({
        amount: 0,
        recipient: "",
        note: ""
      });
    } catch (error) {
      console.error('Error submitting cash delivery:', error);
      toast({
        title: "Hata",
        description: "Nakit teslimi kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsDeliveryLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return `Bugün, ${format(date, 'HH:mm')}`;
    } else if (date.getTime() > now.getTime() - 86400000) {
      return `Dün, ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd.MM.yyyy, HH:mm');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kasa Sayım İşlemleri</h1>
          <p className="text-muted-foreground">
            Günlük kasa sayımı yapın ve nakit teslimlerini yönetin.
          </p>
        </div>

        <Tabs defaultValue="count" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="count">Kasa Sayım</TabsTrigger>
            <TabsTrigger value="delivery">Nakit Teslim</TabsTrigger>
          </TabsList>
          
          <TabsContent value="count">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Banknot Sayımı</CardTitle>
                    <CardDescription>Kasadaki banknotların adedini girin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {banknotes.map((banknote, index) => (
                        <div key={banknote.label} className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor={`banknote-${banknote.value}`} className="text-right">
                            {banknote.label}
                          </Label>
                          <Input
                            id={`banknote-${banknote.value}`}
                            type="number"
                            min="0"
                            value={banknote.count}
                            onChange={(e) => updateBanknoteCount(index, parseInt(e.target.value) || 0)}
                            className="col-span-1"
                          />
                          <div className="text-right font-medium">
                            ₺{(banknote.value * banknote.count).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <div className="text-sm text-muted-foreground">Toplam</div>
                    <div className="text-lg font-bold">₺{banknotesTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bozuk Para Sayımı</CardTitle>
                    <CardDescription>Kasadaki bozuk paraların adedini girin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {coins.map((coin, index) => (
                        <div key={coin.label} className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor={`coin-${coin.value}`} className="text-right">
                            {coin.label}
                          </Label>
                          <Input
                            id={`coin-${coin.value}`}
                            type="number"
                            min="0"
                            value={coin.count}
                            onChange={(e) => updateCoinCount(index, parseInt(e.target.value) || 0)}
                            className="col-span-1"
                          />
                          <div className="text-right font-medium">
                            ₺{(coin.value * coin.count).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <div className="text-sm text-muted-foreground">Toplam</div>
                    <div className="text-lg font-bold">₺{coinsTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <CashSummary
                  previousAmount={previousCashAmount}
                  currentAmount={cashTotal}
                  banknotesTotal={banknotesTotal}
                  coinsTotal={coinsTotal}
                  isLoading={isInitialLoading}
                />
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Kasa Sayımı Kaydet</CardTitle>
                    <CardDescription>
                      Kasa sayımını tamamlayıp kaydedin
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="countDate">Sayım Tarihi</Label>
                        <Input
                          id="countDate"
                          type="datetime-local"
                          value={countDate}
                          onChange={(e) => setCountDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="countNote">Not (İsteğe Bağlı)</Label>
                        <Input 
                          id="countNote" 
                          placeholder="Sayım ile ilgili not..." 
                          value={countNote}
                          onChange={(e) => setCountNote(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={submitCashCount}
                      className="w-full bg-store-700 hover:bg-store-800"
                      disabled={isCountLoading}
                    >
                      {isCountLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Kaydediliyor...
                        </>
                      ) : (
                        "Kasa Sayımını Kaydet"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="delivery">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nakit Teslim İşlemi</CardTitle>
                  <CardDescription>
                    Kasadan nakit teslimini kaydedin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="deliveryAmount">Teslim Edilen Tutar</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">₺</span>
                        <Input
                          id="deliveryAmount"
                          type="number"
                          min="0"
                          className="pl-8"
                          value={cashDelivery.amount}
                          onChange={(e) => handleDeliveryChange('amount', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="recipient">Teslim Alan</Label>
                      <Input
                        id="recipient"
                        placeholder="Teslim alan kişi"
                        value={cashDelivery.recipient}
                        onChange={(e) => handleDeliveryChange('recipient', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryDate">Teslim Tarihi</Label>
                      <Input
                        id="deliveryDate"
                        type="datetime-local"
                        defaultValue={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => handleDeliveryChange('date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryNote">Açıklama</Label>
                      <Input
                        id="deliveryNote"
                        placeholder="Teslim ile ilgili açıklama"
                        value={cashDelivery.note}
                        onChange={(e) => handleDeliveryChange('note', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={submitCashDelivery}
                    className="w-full bg-store-700 hover:bg-store-800"
                    disabled={isDeliveryLoading}
                  >
                    {isDeliveryLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      "Nakit Teslimini Kaydet"
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <div>
                <CashSummary
                  previousAmount={previousCashAmount}
                  currentAmount={cashTotal}
                  banknotesTotal={banknotesTotal}
                  coinsTotal={coinsTotal}
                  showDeliveryWarning={cashDelivery.amount > cashTotal}
                  deliveryAmount={cashDelivery.amount}
                  isLoading={isInitialLoading}
                />

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Önceki Teslimler</CardTitle>
                    <CardDescription>
                      Son yapılan teslimler
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isInitialLoading ? (
                      <div className="space-y-3 animate-pulse">
                        <div className="h-12 bg-gray-100 rounded"></div>
                        <div className="h-12 bg-gray-100 rounded"></div>
                      </div>
                    ) : previousDeliveries.length > 0 ? (
                      <div className="space-y-3">
                        {previousDeliveries.map(delivery => (
                          <div key={delivery.id} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">₺{delivery.miktar.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                              <div className="text-sm text-muted-foreground">{delivery.teslim_alan}</div>
                            </div>
                            <div className="text-sm text-muted-foreground">{formatDate(delivery.tarih)}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        Henüz nakit teslimi yapılmamış
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CashCount;
