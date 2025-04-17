
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TransactionsTable from "./TransactionsTable";
import ReportsTable from "./ReportsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction, Report } from "@/types/dashboardTypes";

interface DashboardTabsProps {
  recentTransactions: Transaction[];
  recentReports: Report[];
  isTransactionsLoading?: boolean;
  isReportsLoading?: boolean;
}

const DashboardTabs = ({ 
  recentTransactions, 
  recentReports,
  isTransactionsLoading = false,
  isReportsLoading = false
}: DashboardTabsProps) => {
  return (
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
            {isTransactionsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <TransactionsTable transactions={recentTransactions} />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reports" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Son Stok Raporları</CardTitle>
          </CardHeader>
          <CardContent>
            {isReportsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <ReportsTable reports={recentReports} />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
