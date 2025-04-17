
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Downloads a report file from Supabase storage
 */
export const downloadReportFile = async (filePath: string, fileName: string): Promise<void> => {
  try {
    const { data, error } = await supabase.storage
      .from('stock-reports')
      .download(filePath);
      
    if (error) {
      throw new Error(error.message);
    }
    
    // Create a download link
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'report-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
    useToast().toast({
      title: "Dosya indirme hatası",
      description: "Dosya indirilirken bir hata oluştu.",
      variant: "destructive",
    });
  }
};
