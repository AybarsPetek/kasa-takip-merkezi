import { DollarSign, TrendingUp, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TodayStats } from "@/types/dashboardTypes";

interface DashboardStatsProps {
  todayStats: TodayStats,
  isLoading?: boolean;
}

const DashboardStats = ({ todayStats, isLoading = false }: DashboardStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Günlük Toplam Nakit</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <>
              <div className="text-2xl font-bold">₺{todayStats.totalCash.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Bugünkü toplam kasa tutarı
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Giren Nakit</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <>
              <div className="text-2xl font-bold">₺{todayStats.cashIn.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Bugünkü giriş tutarı
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Çıkan Nakit</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <>
              <div className="text-2xl font-bold">₺{todayStats.cashOut.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Bugünkü teslim tutarı
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Fark</CardTitle>
          <TrendingUp className="h-4 w-4 text-store-600" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <>
              <div className="text-2xl font-bold">₺{todayStats.difference.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Giriş/çıkış farkı
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
