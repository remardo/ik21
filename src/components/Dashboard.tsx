import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Phone, CheckCircle, XCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

// Mock data
const statsCards = [
  { title: 'Всего должников', value: '2,453', change: '+12%', icon: Users, color: 'bg-blue-500' },
  { title: 'Звонков сегодня', value: '847', change: '+8%', icon: Phone, color: 'bg-green-500' },
  { title: 'Успешных контактов', value: '423', change: '+15%', icon: CheckCircle, color: 'bg-emerald-500' },
  { title: 'Ожидают обзвона', value: '1,234', change: '-5%', icon: Clock, color: 'bg-orange-500' },
];

const callsData = [
  { date: '27 окт', calls: 720, successful: 340 },
  { date: '28 окт', calls: 850, successful: 410 },
  { date: '29 окт', calls: 780, successful: 380 },
  { date: '30 окт', calls: 920, successful: 450 },
  { date: '31 окт', calls: 810, successful: 390 },
  { date: '1 ноя', calls: 890, successful: 430 },
  { date: '2 ноя', calls: 847, successful: 423 },
];

const statusData = [
  { name: 'Готов к звонку', value: 1234, color: '#3b82f6' },
  { name: 'Успешно', value: 423, color: '#10b981' },
  { name: 'Занято', value: 178, color: '#f59e0b' },
  { name: 'Не отвечает', value: 246, color: '#ef4444' },
  { name: 'В процессе', value: 89, color: '#8b5cf6' },
  { name: 'Проверка времени', value: 283, color: '#06b6d4' },
];

const pipelineStats = [
  { name: 'call_debtor', active: 89, queued: 1234, success: 423, failed: 246 },
  { name: 'process_debtors', active: 2, queued: 5, success: 18, failed: 1 },
  { name: 'analyze_call', active: 34, queued: 156, success: 289, failed: 12 },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <p className="text-foreground text-3xl">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 text-sm">{stat.change}</span>
                  </div>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calls Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Динамика звонков</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={callsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" tick={{ fill: 'var(--muted-foreground)' }} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fill: 'var(--muted-foreground)' }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", color: "var(--popover-foreground)" }} />
                <Legend wrapperStyle={{ color: "var(--muted-foreground)" }} />
                <Line type="monotone" dataKey="calls" stroke="var(--chart-1)" strokeWidth={2} name="Всего звонков" />
                <Line type="monotone" dataKey="successful" stroke="var(--chart-2)" strokeWidth={2} name="Успешных" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Распределение по статусам</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, x, y, textAnchor }: any) => (
                    <text x={x} y={y} textAnchor={textAnchor} fill="var(--muted-foreground)" fontSize={12}>
                      {`${name}: ${(percent * 100).toFixed(0)}%`}
                    </text>
                  )}
                  outerRadius={80}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", color: "var(--popover-foreground)" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Status */}
      <Card>
        <CardHeader>
          <CardTitle>Статус Mastra Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineStats.map((pipeline) => (
              <div key={pipeline.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <code className="px-2 py-1 bg-muted text-foreground rounded text-sm">
                      {pipeline.name}
                    </code>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {pipeline.active} активных
                    </Badge>
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      {pipeline.queued} в очереди
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600">✓ {pipeline.success}</span>
                    <span className="text-red-600">✗ {pipeline.failed}</span>
                  </div>
                </div>
                <Progress 
                  value={(pipeline.success / (pipeline.success + pipeline.failed + pipeline.active + pipeline.queued)) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Последние события</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '14:23', event: 'Завершен обзвон партии #847', status: 'success', icon: CheckCircle },
              { time: '14:15', event: 'Проверка ФЗ-230 для 45 должников', status: 'info', icon: AlertCircle },
              { time: '14:08', event: 'Сгенерировано 127 TTS аудиофайлов', status: 'success', icon: CheckCircle },
              { time: '13:52', event: 'Ошибка подключения к Asterisk ARI', status: 'error', icon: XCircle },
              { time: '13:45', event: 'Загружен новый файл должников (234 записи)', status: 'info', icon: Users },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.status === 'success' ? 'bg-green-100' :
                  activity.status === 'error' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <activity.icon className={`w-4 h-4 ${
                    activity.status === 'success' ? 'text-green-600' :
                    activity.status === 'error' ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-foreground text-sm">{activity.event}</p>
                </div>
                <span className="text-muted-foreground text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
