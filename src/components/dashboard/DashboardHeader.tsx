
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DataResetDialog from "./DataResetDialog";

const DashboardHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">Mağaza Yönetim Paneli</h1>
      <div className="flex items-center gap-4">
        <Button 
          onClick={() => navigate('/kasa-sayim')}
          className="bg-store-700 hover:bg-store-800"
        >
          Yeni Kasa Sayımı
        </Button>
        
        <DataResetDialog />
      </div>
    </div>
  );
};

export default DashboardHeader;
