
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Report } from "@/types/dashboardTypes";

interface ReportsTableProps {
  reports: Report[];
}

const ReportsTable = ({ reports }: ReportsTableProps) => {
  const navigate = useNavigate();
  
  return (
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
            {reports.map((report) => (
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
  );
};

export default ReportsTable;
