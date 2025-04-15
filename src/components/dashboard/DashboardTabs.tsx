
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TransactionsTable from "./TransactionsTable";
import ReportsTable from "./ReportsTable";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: string;
}

interface Report {
  id: number;
  name: string;
  date: string;
  items: number;
}

interface DashboardTabsProps {
  recentTransactions: Transaction[];
  recentReports: Report[];
}

const DashboardTabs = ({ recentTransactions, recentReports }: DashboardTabsProps) => {
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
            <TransactionsTable transactions={recentTransactions} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reports" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Son Stok Raporları</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportsTable reports={recentReports} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
