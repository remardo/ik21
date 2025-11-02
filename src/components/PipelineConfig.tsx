import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Play, Pause, Settings, Code, Activity, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

const pipelines = [
  {
    id: 'process_debtors',
    name: 'Process Debtors from XLS',
    description: 'Обработка загруженных файлов с должниками из S3 и запуск индивидуальных пайплайнов',
    status: 'active',
    trigger: 's3_bucket',
    totalRuns: 23,
    successRate: 100,
    avgDuration: '12s',
    lastRun: '2025-11-02 14:23',
  },
  {
    id: 'call_debtor',
    name: 'Call Debtor Pipeline',
    description: 'Основной пайплайн обзвона должника с проверкой ФЗ, TTS генерацией и Asterisk интеграцией',
    status: 'active',
    trigger: 'manual/api',
    totalRuns: 2453,
    successRate: 68,
    avgDuration: '3m 24s',
    lastRun: '2025-11-02 14:30',
  },
  {
    id: 'analyze_call',
    name: 'Analyze Call Recording',
    description: 'Транскрибация и анализ записей звонков через Yandex SpeechKit',
    status: 'active',
    trigger: 's3_recording',
    totalRuns: 1672,
    successRate: 94,
    avgDuration: '45s',
    lastRun: '2025-11-02 14:28',
  },
  {
    id: 'compliance_check',
    name: 'FZ-230 Compliance Check',
    description: 'Проверка соблюдения законодательных ограничений на звонки',
    status: 'active',
    trigger: 'scheduled',
    totalRuns: 8934,
    successRate: 100,
    avgDuration: '2s',
    lastRun: '2025-11-02 14:30',
  },
];

const pipelineYaml = `name: Call Debtor Pipeline

params:
  - name: full_name
  - name: phone_number
  - name: debt_amount
  - name: timezone

actions:
  # 1. Сохранить в БД с начальным статусом
  - name: save_initial_state
    type: db_query
    connection: postgres_main
    query: "INSERT INTO debtors (name, phone, status) 
            VALUES ('{{ params.full_name }}', '{{ params.phone_number }}', 'new');"
    register: db_result

  # 2. Проверить ограничения ФЗ-230
  - name: check_legal_time
    type: script
    script: python /scripts/check_fz.py --phone {{ params.phone_number }} --tz {{ params.timezone }}
    register: compliance_check

  # 3. Ждать если нельзя звонить
  - name: wait_if_needed
    type: wait_for
    condition: "{{ actions.compliance_check.result == 'ok' }}"
    timeout: 1h

  # 4. Сгенерировать аудио через Coqui TTS
  - name: generate_tts
    type: http_request
    url: http://coqui-tts-service/api/tts
    method: POST
    body:
      text: "Здравствуйте, {{ params.full_name }}. У вас имеется задолженность..."
    register: tts_response

  # 5. Инициировать звонок через Asterisk ARI
  - name: make_call
    type: http_request
    url: http://asterisk-service/ari/channels
    method: POST
    body:
      endpoint: "PJSIP/{{ params.phone_number }}@beeline-trunk"
      app: "debtor_calls"
    register: call_result

  # 6. Обновить статус в БД
  - name: update_db_status
    type: db_query
    connection: postgres_main
    query: "UPDATE debtors SET status = '{{ actions.call_result.status }}', 
            last_call_at = NOW() WHERE id = {{ actions.db_result.id }};"`;

export function PipelineConfig() {
  const [selectedPipeline, setSelectedPipeline] = useState(pipelines[1]);

  return (
    <div className="space-y-6">
      {/* Pipelines Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pipelines.map((pipeline) => (
          <Card 
            key={pipeline.id}
            className={`cursor-pointer transition-all ${
              selectedPipeline.id === pipeline.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedPipeline(pipeline)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{pipeline.name}</CardTitle>
                  <CardDescription>{pipeline.description}</CardDescription>
                </div>
                <Badge className={`${
                  pipeline.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {pipeline.status === 'active' ? 'Активен' : 'Остановлен'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-500 text-sm">Запусков</p>
                  <p className="text-slate-900">{pipeline.totalRuns.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Успешность</p>
                  <p className="text-slate-900">{pipeline.successRate}%</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Ср. время</p>
                  <p className="text-slate-900">{pipeline.avgDuration}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                <span>Последний запуск: {pipeline.lastRun}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{selectedPipeline.name}</CardTitle>
              <CardDescription className="mt-1">
                Pipeline ID: <code className="text-slate-700">{selectedPipeline.id}</code>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-2" />
                Приостановить
              </Button>
              <Button size="sm">
                <Play className="w-4 h-4 mr-2" />
                Запустить
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="config" className="w-full">
            <TabsList>
              <TabsTrigger value="config">Конфигурация</TabsTrigger>
              <TabsTrigger value="yaml">YAML</TabsTrigger>
              <TabsTrigger value="runs">Последние запуски</TabsTrigger>
              <TabsTrigger value="integrations">Интеграции</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-6 mt-6">
              {/* Trigger Configuration */}
              <div className="space-y-3">
                <h3 className="text-slate-900">Триггер запуска</h3>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-900">Тип триггера</p>
                      <p className="text-slate-600 text-sm">{selectedPipeline.trigger}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Настроить
                    </Button>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-slate-900">Настройки</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <Label htmlFor="retry">Повторные попытки при ошибке</Label>
                      <p className="text-slate-500 text-sm">Автоматически перезапускать при сбое</p>
                    </div>
                    <Switch id="retry" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <Label htmlFor="logging">Расширенное логирование</Label>
                      <p className="text-slate-500 text-sm">Сохранять подробные логи выполнения</p>
                    </div>
                    <Switch id="logging" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <Label htmlFor="parallel">Параллельное выполнение</Label>
                      <p className="text-slate-500 text-sm">Максимум 50 одновременных экземпляров</p>
                    </div>
                    <Switch id="parallel" defaultChecked />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="yaml" className="mt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-slate-700">Конфигурация пайплайна</p>
                  <Button variant="outline" size="sm">
                    <Code className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                </div>
                <Textarea
                  value={pipelineYaml}
                  readOnly
                  className="font-mono text-sm h-96"
                />
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    Изменения в YAML будут применены после сохранения и требуют перезапуска пайплайна.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="runs" className="mt-6">
              <div className="space-y-3">
                {[
                  { id: 'run_001', status: 'success', duration: '3m 12s', time: '14:30:15', records: 1 },
                  { id: 'run_002', status: 'success', duration: '3m 45s', time: '14:25:08', records: 1 },
                  { id: 'run_003', status: 'failed', duration: '0m 23s', time: '14:20:33', records: 1 },
                  { id: 'run_004', status: 'success', duration: '2m 58s', time: '14:15:22', records: 1 },
                  { id: 'run_005', status: 'success', duration: '3m 34s', time: '14:10:45', records: 1 },
                ].map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        run.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {run.status === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-slate-900 font-mono text-sm">{run.id}</p>
                        <p className="text-slate-500 text-sm">{run.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-slate-600 text-sm">Длительность</p>
                        <p className="text-slate-900">{run.duration}</p>
                      </div>
                      <Button variant="ghost" size="sm">Логи</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="mt-6">
              <div className="space-y-3">
                <p className="text-slate-700 mb-4">Сервисы, используемые в этом пайплайне</p>
                {[
                  { name: 'PostgreSQL', status: 'connected', description: 'База данных для хранения состояний' },
                  { name: 'Asterisk ARI', status: 'connected', description: 'Телефония и совершение звонков' },
                  { name: 'Coqui TTS', status: 'connected', description: 'Генерация речи' },
                  { name: 'Yandex Object Storage', status: 'connected', description: 'Хранение аудиозаписей' },
                  { name: 'Yandex SpeechKit', status: 'connected', description: 'Транскрибация звонков' },
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-slate-900">{integration.name}</p>
                        <p className="text-slate-500 text-sm">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 text-sm">Подключено</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
