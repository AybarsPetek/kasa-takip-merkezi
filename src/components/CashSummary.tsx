
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CashSummaryProps {
  previousAmount: number;
  currentAmount: number;
  banknotesTotal: number;
  coinsTotal: number;
  showDeliveryWarning?: boolean;
  deliveryAmount?: number;
  isLoading?: boolean;
}

const CashSummary = ({
  previousAmount,
  currentAmount,
  banknotesTotal,
  coinsTotal,
  showDeliveryWarning = false,
  deliveryAmount = 0,
  isLoading = false
}: CashSummaryProps) => {
  const difference = currentAmount - previousAmount;
  const percentChange = previousAmount ? Math.round((difference / previousAmount) * 100) : 0;
  
  // Calculate remaining after delivery
  const remainingAfterDelivery = currentAmount - (deliveryAmount || 0);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kasa Özeti</CardTitle>
          <CardDescription>
            Kasadaki nakit miktarına genel bakış
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-store-700" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kasa Özeti</CardTitle>
        <CardDescription>
          Kasadaki nakit miktarına genel bakış
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">Mevcut Nakit</div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-store-700" />
              <span className="text-xl font-bold">₺{currentAmount.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">Banknotlar</div>
            <div className="text-sm font-medium">₺{banknotesTotal.toLocaleString()}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">Bozuk Paralar</div>
            <div className="text-sm font-medium">₺{coinsTotal.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="text-sm font-medium">Önceki Bakiye</div>
          <div className="font-medium">₺{previousAmount.toLocaleString()}</div>
        </div>
        
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-1 text-sm font-medium">
            <span>Değişim</span>
            {difference > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : difference < 0 ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : null}
          </div>
          <div 
            className={cn(
              "font-medium",
              difference > 0 ? "text-green-600" : 
              difference < 0 ? "text-red-600" : ""
            )}
          >
            {difference > 0 ? "+" : ""}₺{difference.toLocaleString()} ({percentChange}%)
          </div>
        </div>

        {deliveryAmount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="text-sm font-medium">Teslim Tutarı</div>
              <div className="font-medium text-red-600">-₺{deliveryAmount.toLocaleString()}</div>
            </div>
            
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="text-sm font-medium">Kalan Bakiye</div>
              <div className="font-bold">₺{remainingAfterDelivery.toLocaleString()}</div>
            </div>

            {showDeliveryWarning && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Teslim tutarı mevcut nakitten fazla olamaz!</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CashSummary;
