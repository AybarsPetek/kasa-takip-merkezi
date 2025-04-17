
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { Transaction, Report } from "@/components/dashboard/DashboardTabs";
import { fetchRecentTransactions, fetchRecentReports, fetchTodayStats } from "@/services/dashboardService";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  // Fetch today's statistics
  const { data: todayStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['todayStats'],
    queryFn: fetchTodayStats
  });

  // Fetch recent transactions
  const { data: recentTransactions = [], isLoading: transactionsLoading, error: transactionsError } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: () => fetchRecentTransactions(5)
  });

  // Fetch recent reports
  const { data: recentReports = [], isLoading: reportsLoading, error: reportsError } = useQuery({
    queryKey: ['recentReports'],
    queryFn: () => fetchRecentReports(3)
  });

  // Handle errors
  useEffect(() => {
    if (statsError) {
      toast({
        title: "Hata",
        description: "İstatistikler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
    
    if (transactionsError) {
      toast({
        title: "Hata",
        description: "İşlemler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
    
    if (reportsError) {
      toast({
        title: "Hata",
        description: "Raporlar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  }, [statsError, transactionsError, reportsError]);

  // Default values to use while data is loading
  const defaultStats = {
    totalCash: 0,
    cashIn: 0,
    cashOut: 0,
    difference: 0
  };

  return (
    <Layout>
      <div className="space-y-6">
        <DashboardHeader />
        <DashboardStats todayStats={todayStats || defaultStats} isLoading={statsLoading} />
        <DashboardTabs 
          recentTransactions={recentTransactions} 
          recentReports={recentReports}
          isTransactionsLoading={transactionsLoading}
          isReportsLoading={reportsLoading}
        />
      </div>
    </Layout>
  );
};

export default Index;
