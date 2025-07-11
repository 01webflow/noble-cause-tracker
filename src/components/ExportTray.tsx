
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, File, Camera, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ExportOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  format: string;
  description: string;
}

interface ExportTrayProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  dateRange: any;
}

export const ExportTray = ({ isOpen, onClose, reportType, dateRange }: ExportTrayProps) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { toast } = useToast();

  const exportOptions: ExportOption[] = [
    {
      id: 'csv',
      label: 'CSV Export',
      icon: File,
      format: 'CSV',
      description: 'Spreadsheet compatible format'
    },
    {
      id: 'pdf',
      label: 'PDF Report',
      icon: FileText,
      format: 'PDF',
      description: 'Formatted document with charts'
    },
    {
      id: 'png',
      label: 'PNG Charts',
      icon: Camera,
      format: 'PNG',
      description: 'High-quality chart images'
    }
  ];

  const handleExport = async (option: ExportOption) => {
    setIsExporting(option.id);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock file based on format
      let content = '';
      let mimeType = '';
      let filename = '';
      
      switch (option.format) {
        case 'CSV':
          content = generateCSVContent();
          mimeType = 'text/csv;charset=utf-8;';
          filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'PDF':
          content = 'PDF content would be generated here';
          mimeType = 'application/pdf';
          filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        case 'PNG':
          content = 'PNG image data would be generated here';
          mimeType = 'image/png';
          filename = `${reportType}-charts-${new Date().toISOString().split('T')[0]}.png`;
          break;
      }
      
      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: `${option.format} file has been downloaded successfully.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Export Failed",
        description: `Failed to export ${option.format} file. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const generateCSVContent = () => {
    const headers = ['Month', 'Donations', 'Sponsors', 'New Donors', 'New Sponsors'];
    const sampleData = [
      ['Jan', '12000', '5', '85', '2'],
      ['Feb', '19000', '7', '95', '3'],
      ['Mar', '15000', '6', '78', '1'],
      ['Apr', '22000', '8', '112', '4'],
      ['May', '18000', '6', '89', '2'],
      ['Jun', '25000', '9', '125', '3']
    ];
    
    return [headers, ...sampleData].map(row => row.join(',')).join('\n');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          {/* Export Tray */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 100, rotateX: -15 }}
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[101] w-full max-w-2xl"
          >
            <div className="glass-card rounded-t-3xl p-6 border-t border-x border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Export Options</h3>
                  <p className="text-gray-300 text-sm">Choose your preferred export format</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white/70 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exportOptions.map((option, index) => {
                  const Icon = option.icon;
                  const isLoading = isExporting === option.id;
                  
                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                      onClick={() => !isLoading && handleExport(option)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <motion.div
                          className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-3 group-hover:shadow-lg transition-all duration-300"
                          animate={isLoading ? { rotate: 360 } : {}}
                          transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                        >
                          {isLoading ? (
                            <Loader2 className="h-6 w-6 text-white" />
                          ) : (
                            <Icon className="h-6 w-6 text-white" />
                          )}
                        </motion.div>
                        
                        <h4 className="text-white font-semibold mb-1">
                          {option.label}
                        </h4>
                        <p className="text-gray-300 text-xs">
                          {option.description}
                        </p>
                        
                        {isLoading && (
                          <p className="text-blue-400 text-xs mt-2">
                            Generating...
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
