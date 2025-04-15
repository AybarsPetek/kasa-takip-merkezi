
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DataResetDialog = () => {
  const [isResetting, setIsResetting] = useState(false);
  const queryClient = useQueryClient();

  const resetAllData = async () => {
    try {
      setIsResetting(true);
      
      const { data, error } = await supabase.functions.invoke('reset-data');
      
      if (error) {
        throw new Error('Veri sıfırlama sırasında bir hata oluştu');
      }
      
      // Invalidate all queries to force refetching data
      queryClient.invalidateQueries({ queryKey: ['todayStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['recentReports'] });
      
      toast({
        title: "Başarılı",
        description: "Tüm veriler sıfırlandı",
        variant: "default",
      });
    } catch (error) {
      console.error("Veri sıfırlama hatası:", error);
      toast({
        title: "Hata",
        description: error.message || "Veri sıfırlama sırasında bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Verileri Sıfırla
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tüm verileri sıfırlamak istediğinize emin misiniz?</AlertDialogTitle>
          <AlertDialogDescription>
            Bu işlem, sistemdeki tüm kasa sayımlarını, nakit teslimlerini ve stok raporlarını silecektir.
            Bu eylem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={resetAllData}
            className="bg-red-500 hover:bg-red-600"
            disabled={isResetting}
          >
            {isResetting ? 'Sıfırlanıyor...' : 'Evet, Sıfırla'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DataResetDialog;
