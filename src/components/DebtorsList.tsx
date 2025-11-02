import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, Play, Pause, MoreVertical, LayoutGrid, Table as TableIcon, Phone, Clock, AlertCircle, Mail, MapPin, Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { DebtorDetailDialog } from './DebtorDetailDialog';
import { debtors } from './debtors-mock-data';
const statusConfig: Record<string, { label: string; color: string; borderColor: string }> = {
  new: { label: 'Новый', color: 'bg-muted text-foreground', borderColor: 'border-border' },
  time_check: { label: 'Проверка времени', color: 'bg-cyan-100 text-cyan-700', borderColor: 'border-border' },
  ready_to_call: { label: 'Готов к звонку', color: 'bg-blue-100 text-blue-700', borderColor: 'border-border' },
  calling: { label: 'Звоним', color: 'bg-purple-100 text-purple-700', borderColor: 'border-border' },
  success: { label: 'Успешно', color: 'bg-green-100 text-green-700', borderColor: 'border-border' },
  fail_busy: { label: 'Занято', color: 'bg-orange-100 text-orange-700', borderColor: 'border-border' },
  fail_no_answer: { label: 'Не отвечает', color: 'bg-red-100 text-red-700', borderColor: 'border-border' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Низкий', color: 'text-muted-foreground' },
  medium: { label: 'Средний', color: 'text-yellow-600' },
  high: { label: 'Высокий', color: 'text-red-600' },
};

// Функция для получения инициалов
const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`;
  }
  return name.substring(0, 2).toUpperCase();
};

export function DebtorsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedDebtor, setSelectedDebtor] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredDebtors = debtors.filter(debtor => {
    const matchesSearch = debtor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         debtor.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || debtor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDebtorClick = (debtor: any) => {
    setSelectedDebtor(debtor);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени или телефону..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[240px]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Фильтр по статусу" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="new">Новые</SelectItem>
                <SelectItem value="ready_to_call">Готовы к звонку</SelectItem>
                <SelectItem value="calling">Звоним</SelectItem>
                <SelectItem value="success">Успешные</SelectItem>
                <SelectItem value="fail_busy">Занято</SelectItem>
                <SelectItem value="fail_no_answer">Не отвечает</SelectItem>
                <SelectItem value="time_check">Проверка времени</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Header with view toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Список должников ({filteredDebtors.length})</CardTitle>
              <CardDescription className="mt-1">
                Управление базой должников и автоматизированный обзвон
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="flex border rounded-lg p-1 bg-muted">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="h-8"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8"
                >
                  <TableIcon className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Запустить обзвон
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDebtors.map((debtor) => {
            const attemptsProgress = (debtor.attempts / debtor.maxAttempts) * 100;
            
            return (
              <Card 
                key={debtor.id} 
                className={`border-l-4 ${statusConfig[debtor.status].borderColor} hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
                onClick={() => handleDebtorClick(debtor)}
              >
                <CardContent className="p-5">
                  {/* Header with Avatar and Priority */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getInitials(debtor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-foreground truncate">
                          {debtor.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <AlertCircle className={`w-3 h-3 ${priorityConfig[debtor.priority].color}`} />
                          <span className={priorityConfig[debtor.priority].color}>
                            {priorityConfig[debtor.priority].label} приоритет
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={statusConfig[debtor.status].color}>
                      {statusConfig[debtor.status].label}
                    </Badge>
                  </div>

                  {/* Debt Amount - Large Display */}
                  <div className="mb-4 p-4 bg-muted rounded-lg border border-slate-100">
                    <div className="text-xs text-muted-foreground mb-1">Сумма задолженности</div>
                    <div className="text-2xl text-foreground flex items-baseline gap-1">
                      {debtor.debt.toLocaleString('ru-RU')}
                      <span className="text-lg">₽</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                      <Calendar className="w-3 h-3" />
                      <span>Просрочка {debtor.overdueDays} дней</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-foreground">{debtor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{debtor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{debtor.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{debtor.timezone}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Attempts Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Попыток звонков</span>
                      <span>{debtor.attempts} из {debtor.maxAttempts}</span>
                    </div>
                    <Progress value={attemptsProgress} className="h-2" />
                  </div>

                  {/* Last Call Info */}
                  {debtor.lastCall && (
                    <div className="text-xs text-muted-foreground mb-4">
                      Последний звонок: {debtor.lastCall}
                    </div>
                  )}

                  {/* Pipeline ID */}
                  <div className="mb-4">
                    <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground block truncate">
                      {debtor.pipelineId}
                    </code>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      className="flex-1" 
                      size="sm"
                      variant={debtor.status === 'calling' ? 'secondary' : 'default'}
                    >
                      {debtor.status === 'calling' ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Пауза
                        </>
                      ) : (
                        <>
                          <Phone className="w-4 h-4 mr-2" />
                          Позвонить
                        </>
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>История звонков</DropdownMenuItem>
                        <DropdownMenuItem>Редактировать данные</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDebtorClick(debtor)}>
                          Просмотр деталей
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>ФИО</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Долг</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Попыток</TableHead>
                    <TableHead>Последний звонок</TableHead>
                    <TableHead>Pipeline ID</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDebtors.map((debtor) => (
                    <TableRow 
                      key={debtor.id}
                      className="cursor-pointer"
                      onClick={() => handleDebtorClick(debtor)}
                    >
                      <TableCell>{debtor.id}</TableCell>
                      <TableCell className="text-foreground">{debtor.name}</TableCell>
                      <TableCell className="font-mono text-sm">{debtor.phone}</TableCell>
                      <TableCell className="text-foreground">
                        {debtor.debt.toLocaleString('ru-RU')} ₽
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[debtor.status].color}>
                          {statusConfig[debtor.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">{debtor.attempts}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {debtor.lastCall || '—'}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded text-foreground">
                          {debtor.pipelineId}
                        </code>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Play className="w-4 h-4 mr-2" />
                              Запустить звонок
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pause className="w-4 h-4 mr-2" />
                              Приостановить
                            </DropdownMenuItem>
                            <DropdownMenuItem>История звонков</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDebtorClick(debtor)}>
                              Просмотр деталей
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail Dialog */}
      <DebtorDetailDialog
        debtor={selectedDebtor}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}
