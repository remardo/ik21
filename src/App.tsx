import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { DebtorsList } from './components/DebtorsList';
import { CallHistory } from './components/CallHistory';
import { PipelineConfig } from './components/PipelineConfig';
import { UploadData } from './components/UploadData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { LayoutDashboard, Users, Phone, Settings, Upload } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">Коллекторская Система</h1>
                <p className="text-slate-500 text-sm">Управление через Mastra</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm">
                Mastra: Активна
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="debtors" className="gap-2">
              <Users className="w-4 h-4" />
              Должники
            </TabsTrigger>
            <TabsTrigger value="calls" className="gap-2">
              <Phone className="w-4 h-4" />
              История звонков
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Загрузка данных
            </TabsTrigger>
            <TabsTrigger value="pipelines" className="gap-2">
              <Settings className="w-4 h-4" />
              Пайплайны
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="debtors">
            <DebtorsList />
          </TabsContent>

          <TabsContent value="calls">
            <CallHistory />
          </TabsContent>

          <TabsContent value="upload">
            <UploadData />
          </TabsContent>

          <TabsContent value="pipelines">
            <PipelineConfig />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
