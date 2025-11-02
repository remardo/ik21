import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Search, PlayCircle, Download, FileAudio, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Mock data
const callHistory = [
  {
    id: 1,
    debtorName: 'Иванов Иван Иванович',
    phone: '+7 (495) 123-45-67',
    datetime: '2025-11-02 14:23:15',
    duration: '02:34',
    status: 'answered',
    recording: 'https://storage.example.com/rec_001.mp3',
    transcript: 'Оператор: Здравствуйте, Иван Иванович. У вас имеется задолженность в размере 45000 рублей.\nДолжник: Да, я знаю. Планирую погасить в течение недели.\nОператор: Благодарим за информацию. Подтверждаете обязательство?\nДолжник: Да, подтверждаю.',
    sentiment: 'positive',
    keywords: ['погашу', 'подтверждаю', 'неделя'],
  },
  {
    id: 2,
    debtorName: 'Петрова Мария Сергеевна',
    phone: '+7 (495) 234-56-78',
    datetime: '2025-11-02 13:45:22',
    duration: '01:12',
    status: 'busy',
    recording: null,
    transcript: null,
    sentiment: null,
    keywords: [],
  },
  {
    id: 3,
    debtorName: 'Сидоров Петр Александрович',
    phone: '+7 (495) 345-67-89',
    datetime: '2025-11-02 12:18:40',
    duration: '03:45',
    status: 'answered',
    recording: 'https://storage.example.com/rec_003.mp3',
    transcript: 'Оператор: Здравствуйте, Петр Александрович. У вас имеется задолженность в размере 23400 рублей.\nДолжник: Это недоразумение, я уже все оплатил.\nОператор: Позвольте уточнить информацию.',
    sentiment: 'negative',
    keywords: ['оплатил', 'недоразумение'],
  },
  {
    id: 4,
    debtorName: 'Козлова Анна Викторовна',
    phone: '+7 (495) 456-78-90',
    datetime: '2025-11-02 11:30:15',
    duration: '00:00',
    status: 'no_answer',
    recording: null,
    transcript: null,
    sentiment: null,
    keywords: [],
  },
  {
    id: 5,
    debtorName: 'Морозов Дмитрий Олегович',
    phone: '+7 (495) 567-89-01',
    datetime: '2025-11-02 10:22:33',
    duration: '04:12',
    status: 'answered',
    recording: 'https://storage.example.com/rec_005.mp3',
    transcript: 'Оператор: Здравствуйте, Дмитрий Олегович. У вас имеется задолженность в размере 92300 рублей.\nДолжник: Сейчас нет возможности оплатить. Могу частями.\nОператор: Мы можем обсудить план рассрочки.',
    sentiment: 'neutral',
    keywords: ['рассрочка', 'частями', 'нет возможности'],
  },
  {
    id: 6,
    debtorName: 'Васильева Елена Игоревна',
    phone: '+7 (495) 678-90-12',
    datetime: '2025-11-02 09:15:08',
    duration: '01:45',
    status: 'answered',
    recording: 'https://storage.example.com/rec_006.mp3',
    transcript: 'Оператор: Здравствуйте, Елена Игоревна. У вас имеется задолженность в размере 34700 рублей.\nДолжник: Хорошо, оплачу сегодня.',
    sentiment: 'positive',
    keywords: ['оплачу', 'сегодня'],
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  answered: { label: 'Отвечен', color: 'bg-green-100 text-green-700' },
  busy: { label: 'Занято', color: 'bg-orange-100 text-orange-700' },
  no_answer: { label: 'Не отвечает', color: 'bg-red-100 text-red-700' },
  failed: { label: 'Ошибка', color: 'bg-slate-100 text-slate-700' },
};

const sentimentConfig: Record<string, { label: string; color: string }> = {
  positive: { label: 'Позитивная', color: 'text-green-600' },
  neutral: { label: 'Нейтральная', color: 'text-slate-600' },
  negative: { label: 'Негативная', color: 'text-red-600' },
};

export function CallHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCall, setSelectedCall] = useState(null);

  const filteredCalls = callHistory.filter(call => 
    call.debtorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    call.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Поиск по имени или телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>История звонков ({filteredCalls.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата и время</TableHead>
                  <TableHead>ФИО должника</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Длительность</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Запись</TableHead>
                  <TableHead>Тональность</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="text-slate-600 text-sm">
                      {call.datetime}
                    </TableCell>
                    <TableCell className="text-slate-900">{call.debtorName}</TableCell>
                    <TableCell className="font-mono text-sm">{call.phone}</TableCell>
                    <TableCell className="text-slate-600">{call.duration}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[call.status].color}>
                        {statusConfig[call.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {call.recording ? (
                        <div className="flex items-center gap-2">
                          <FileAudio className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-600 text-sm">Доступна</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {call.sentiment && sentimentConfig[call.sentiment] ? (
                        <span className={`text-sm ${sentimentConfig[call.sentiment].color}`}>
                          {sentimentConfig[call.sentiment].label}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedCall(call)}
                          >
                            Детали
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Детали звонка</DialogTitle>
                          </DialogHeader>
                          <CallDetails call={call} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CallDetails({ call }: { call: any }) {
  if (!call) return null;

  return (
    <div className="space-y-6">
      {/* Call Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-slate-500 text-sm mb-1">ФИО должника</p>
          <p className="text-slate-900">{call.debtorName}</p>
        </div>
        <div>
          <p className="text-slate-500 text-sm mb-1">Телефон</p>
          <p className="text-slate-900 font-mono">{call.phone}</p>
        </div>
        <div>
          <p className="text-slate-500 text-sm mb-1">Дата и время</p>
          <p className="text-slate-900">{call.datetime}</p>
        </div>
        <div>
          <p className="text-slate-500 text-sm mb-1">Длительность</p>
          <p className="text-slate-900">{call.duration}</p>
        </div>
      </div>

      {/* Recording */}
      {call.recording && (
        <div className="space-y-2">
          <p className="text-slate-700">Аудиозапись</p>
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
            <PlayCircle className="w-8 h-8 text-blue-600" />
            <div className="flex-1">
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-blue-600"></div>
              </div>
              <p className="text-slate-500 text-sm mt-1">0:52 / {call.duration}</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Скачать
            </Button>
          </div>
        </div>
      )}

      {/* Transcript and Analysis */}
      {call.transcript && (
        <Tabs defaultValue="transcript" className="w-full">
          <TabsList>
            <TabsTrigger value="transcript">Транскрипция</TabsTrigger>
            <TabsTrigger value="analysis">Анализ</TabsTrigger>
          </TabsList>
          <TabsContent value="transcript" className="space-y-2">
            <div className="p-4 bg-slate-50 rounded-lg whitespace-pre-wrap text-sm">
              {call.transcript}
            </div>
          </TabsContent>
          <TabsContent value="analysis" className="space-y-4">
            <div>
              <p className="text-slate-700 mb-2">Тональность разговора</p>
              <Badge className={`${
                call.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                call.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {call.sentiment && sentimentConfig[call.sentiment] ? sentimentConfig[call.sentiment].label : 'Не определена'}
              </Badge>
            </div>
            <div>
              <p className="text-slate-700 mb-2">Ключевые слова</p>
              <div className="flex flex-wrap gap-2">
                {call.keywords && call.keywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-900 mb-1">Рекомендация Mastra AI</p>
                  <p className="text-blue-700 text-sm">
                    {call.sentiment === 'positive' 
                      ? 'Должник демонстрирует готовность к погашению. Рекомендуется отправить SMS с реквизитами для оплаты.'
                      : call.sentiment === 'negative'
                      ? 'Обнаружен конфликт. Рекомендуется передать дело старшему специалисту.'
                      : 'Должник открыт к диалогу. Предложить план рассрочки платежа.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
