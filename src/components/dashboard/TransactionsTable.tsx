
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="p-2 pl-4 font-medium">İşlem</th>
              <th className="p-2 font-medium">Tutar</th>
              <th className="p-2 font-medium">Tarih</th>
              <th className="p-2 pr-4 font-medium">Durum</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t">
                <td className="p-2 pl-4">{transaction.type}</td>
                <td className={`p-2 ${transaction.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                  {transaction.amount < 0 ? "-" : "+"}₺{Math.abs(transaction.amount).toLocaleString()}
                </td>
                <td className="p-2">{transaction.date}</td>
                <td className="p-2 pr-4">
                  <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button 
        variant="outline" 
        onClick={() => navigate('/kasa-gecmis')}
        className="w-full"
      >
        Tüm İşlemleri Görüntüle
      </Button>
    </div>
  );
};

export default TransactionsTable;
