
import Layout from "@/components/Layout";
import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

const Index = () => {
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
        <DashboardHeader />
        <DashboardStats todayStats={todayStats} />
        <DashboardTabs 
          recentTransactions={recentTransactions} 
          recentReports={recentReports} 
        />
      </div>
    </Layout>
  );
};

export default Index;
