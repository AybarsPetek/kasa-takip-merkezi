
import Layout from "@/components/Layout";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CashSummary from "@/components/CashSummary";

// Types for cash denominations
interface CashDenomination {
  value: number;
  label: string;
  count: number;
}

// Types for cash delivery
interface CashDelivery {
  amount: number;
  recipient: string;
  note: string;
}

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
  
  const [previousCashAmount, setPreviousCashAmount] = useState<number>(5000);
  const [cashDelivery, setCashDelivery] = useState<CashDelivery>({
    amount: 0,
    recipient: "",
    note: ""
  });

  // Calculate totals
  const banknotesTotal = banknotes.reduce((sum, item) => sum + (item.value * item.count), 0);
  const coinsTotal = coins.reduce((sum, item) => sum + (item.value * item.count), 0);
  const cashTotal = banknotesTotal + coinsTotal;
  
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
  const submitCashCount = () => {
    // In a real app, we would save this to a database
    toast({
      title: "Kasa sayımı kaydedildi",
      description: `Toplam: ₺${cashTotal.toLocaleString()} - Tarih: ${new Date().toLocaleString()}`,
    });
  };
  
  // Submit cash delivery
  const submitCashDelivery = () => {
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
    
    // In a real app, we would save this to a database
    toast({
      title: "Nakit teslimi kaydedildi",
      description: `₺${cashDelivery.amount.toLocaleString()} - ${cashDelivery.recipient}`,
    });
    
    // Reset form
    setCashDelivery({
      amount: 0,
      recipient: "",
      note: ""
    });
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
                            ₺{(banknote.value * banknote.count).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <div className="text-sm text-muted-foreground">Toplam</div>
                    <div className="text-lg font-bold">₺{banknotesTotal.toLocaleString()}</div>
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
                            ₺{(coin.value * coin.count).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <div className="text-sm text-muted-foreground">Toplam</div>
                    <div className="text-lg font-bold">₺{coinsTotal.toLocaleString()}</div>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <CashSummary
                  previousAmount={previousCashAmount}
                  currentAmount={cashTotal}
                  banknotesTotal={banknotesTotal}
                  coinsTotal={coinsTotal}
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
                          defaultValue={new Date().toISOString().slice(0, 16)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="countNote">Not (İsteğe Bağlı)</Label>
                        <Input id="countNote" placeholder="Sayım ile ilgili not..." />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={submitCashCount}
                      className="w-full bg-store-700 hover:bg-store-800"
                    >
                      Kasa Sayımını Kaydet
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
                  >
                    Nakit Teslimini Kaydet
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
                />

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Önceki Teslimler</CardTitle>
                    <CardDescription>
                      Son yapılan teslimler
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">₺3,000.00</div>
                          <div className="text-sm text-muted-foreground">Finans Departmanı</div>
                        </div>
                        <div className="text-sm text-muted-foreground">Bugün, 14:30</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">₺2,500.00</div>
                          <div className="text-sm text-muted-foreground">Finans Departmanı</div>
                        </div>
                        <div className="text-sm text-muted-foreground">Dün, 16:45</div>
                      </div>
                    </div>
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
