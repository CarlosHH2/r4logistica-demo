
import React, { useState } from 'react';
import { Upload, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CsvImport = () => {
  const [isUploading, setIsUploading] = useState(false);

  const downloadTemplate = () => {
    const headers = [
      'street',
      'number',
      'int_number',
      'neighborhood',
      'postal_code',
      'administrative_area',
      'sub_administrative_area',
      'reference',
      'notes'
    ];
    
    const csvContent = [
      headers.join(','),
      'Av Insurgentes,123,2B,Condesa,06140,CDMX,Ciudad de México,Edificio gris,Entregar en recepción',
      'Calle Durango,45,,Roma Norte,06700,CDMX,Ciudad de México,Casa azul,Tocar timbre'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ordenes_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',');
        const orders = rows.slice(1, 501).map(row => {
          const values = row.split(',');
          const order: Record<string, any> = {
            is_manual: true,
            country: 'MX'
          };
          
          headers.forEach((header, index) => {
            order[header.trim()] = values[index]?.trim() || null;
          });
          
          return order;
        });

        if (orders.length > 500) {
          toast.error('El archivo excede el límite de 500 órdenes');
          return;
        }

        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          toast.error('Usuario no autenticado');
          return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const order of orders) {
          const { error } = await supabase
            .from('orders')
            .insert({
              ...order,
              user_id: userData.user.id
            });

          if (error) {
            console.error('Error importing order:', error);
            errorCount++;
          } else {
            successCount++;
          }
        }

        toast.success(`Importación completada: ${successCount} órdenes creadas, ${errorCount} errores`);
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error('Error al procesar el archivo');
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar órdenes desde CSV</DialogTitle>
          <DialogDescription>
            Sube un archivo CSV con las órdenes que deseas importar.
            Límite: 500 órdenes por archivo.
          </DialogDescription>
        </DialogHeader>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Descarga la plantilla CSV para asegurar el formato correcto.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-4">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Descargar plantilla
          </Button>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <Button 
            onClick={() => document.getElementById('csv-upload')?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Importando...' : 'Subir CSV'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CsvImport;
