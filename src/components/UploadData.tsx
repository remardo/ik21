import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from './ui/badge';

export function UploadData() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploadStatus('processing');
          
          // Simulate processing
          setTimeout(() => {
            setUploadStatus('success');
          }, 2000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const recentUploads = [
    {
      id: 1,
      filename: 'debtors_november_2025.xlsx',
      uploadedAt: '2025-11-02 14:23',
      records: 234,
      status: 'processed',
      pipelineRuns: 234,
    },
    {
      id: 2,
      filename: 'debtors_october_2025_part2.xlsx',
      uploadedAt: '2025-11-01 09:15',
      records: 156,
      status: 'processed',
      pipelineRuns: 156,
    },
    {
      id: 3,
      filename: 'debtors_october_2025_part1.xlsx',
      uploadedAt: '2025-10-30 16:45',
      records: 189,
      status: 'processed',
      pipelineRuns: 189,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Загрузка данных о должниках</CardTitle>
          <CardDescription>
            Загрузите Excel-файл с данными о должниках. Файл будет автоматически обработан Mastra и запустит пайплайны обзвона.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-foreground mb-1">
                    Нажмите для выбора файла или перетащите сюда
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Поддерживаются форматы: .xlsx, .xls (максимум 10 МБ)
                  </p>
                </div>
                <Button type="button">Выбрать файл</Button>
              </div>
            </label>
          </div>

          {/* Upload Progress */}
          {uploadStatus !== 'idle' && (
            <div className="space-y-4">
              {uploadStatus === 'uploading' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">Загрузка файла...</span>
                    <span className="text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {uploadStatus === 'processing' && (
                <Alert>
                  <Clock className="w-4 h-4" />
                  <AlertDescription>
                    Файл загружен. Mastra обрабатывает данные и запускает пайплайны...
                  </AlertDescription>
                </Alert>
              )}

              {uploadStatus === 'success' && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Успешно! Обработано 234 записи. Запущено 234 пайплайна обзвона.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* File Format Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-900 mb-2">Требования к формату файла:</p>
            <ul className="text-blue-700 text-sm space-y-1 ml-4">
              <li>• Столбец "ФИО" — полное имя должника</li>
              <li>• Столбец "Телефон" — номер в формате +7XXXXXXXXXX</li>
              <li>• Столбец "Сумма долга" — числовое значение</li>
              <li>• Столбец "Часовой пояс" — например, Europe/Moscow</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>История загрузок</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUploads.map((upload) => (
              <div 
                key={upload.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-foreground">{upload.filename}</p>
                    <p className="text-muted-foreground text-sm">{upload.uploadedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-foreground">{upload.records} записей</p>
                    <p className="text-muted-foreground text-sm">{upload.pipelineRuns} пайплайнов</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    Обработан
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Yandex Object Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle>Подключение к Yandex Object Storage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-foreground">Bucket: debtor-lists</p>
                <p className="text-muted-foreground text-sm">Регион: ru-central1</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700">Подключено</Badge>
          </div>

          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              При загрузке файла в S3-бакет автоматически запускается Mastra Pipeline 
              <code className="mx-1 px-2 py-0.5 bg-muted rounded text-sm">process_debtors</code>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
