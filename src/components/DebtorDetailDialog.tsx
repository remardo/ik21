import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar, FileText, Users, Building2, Phone, Mail, MapPin, Clock, AlertCircle } from 'lucide-react';

interface DebtorDetailDialogProps {
  debtor: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InfoRow = ({ label, value, highlight = false }: { label: string; value: string | number | null | undefined; highlight?: boolean }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-border last:border-0">
    <div className="text-sm text-muted-foreground sm:w-1/3">{label}</div>
    <div className={`text-sm sm:w-2/3 ${highlight ? 'text-foreground' : 'text-muted-foreground'}`}>
      {value !== null && value !== undefined && value !== '' ? value : '—'}
    </div>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <Card className="mb-4">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Icon className="w-5 h-5 text-muted-foreground" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      {children}
    </CardContent>
  </Card>
);

export function DebtorDetailDialog({ debtor, open, onOpenChange }: DebtorDetailDialogProps) {
  if (!debtor) return null;

  const statusConfig: Record<string, { label: string; color: string }> = {
    new: { label: 'Новый', color: 'bg-muted text-foreground' },
    time_check: { label: 'Проверка времени', color: 'bg-cyan-100 text-cyan-700' },
    ready_to_call: { label: 'Готов к звонку', color: 'bg-blue-100 text-blue-700' },
    calling: { label: 'Звоним', color: 'bg-purple-100 text-purple-700' },
    success: { label: 'Успешно', color: 'bg-green-100 text-green-700' },
    fail_busy: { label: 'Занято', color: 'bg-orange-100 text-orange-700' },
    fail_no_answer: { label: 'Не отвечает', color: 'bg-red-100 text-red-700' },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{debtor.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={statusConfig[debtor.status]?.color}>
                  {statusConfig[debtor.status]?.label}
                </Badge>
                <span className="text-sm text-muted-foreground">ID: {debtor.id}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Сумма задолженности</div>
              <div className="text-3xl text-foreground">
                {debtor.debt.toLocaleString('ru-RU')} ₽
              </div>
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <Calendar className="w-4 h-4" />
                <span>Просрочка {debtor.overdueDays} дней</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="h-[calc(90vh-180px)] overflow-y-auto px-6 py-4">
          <Tabs defaultValue="debt" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="debt">
                <FileText className="w-4 h-4 mr-2" />
                Долговые обязательства
              </TabsTrigger>
              <TabsTrigger value="debtor">
                <Users className="w-4 h-4 mr-2" />
                Должник
              </TabsTrigger>
              <TabsTrigger value="counterparties">
                <Building2 className="w-4 h-4 mr-2" />
                Контрагенты
              </TabsTrigger>
            </TabsList>

            {/* Долговые обязательства */}
            <TabsContent value="debt" className="space-y-4">
              <SectionCard title="Основная информация" icon={FileText}>
                <div className="space-y-1">
                  <InfoRow label="Код долгового обязательства" value={debtor.debtObligation.code} highlight />
                  <InfoRow label="Номер долгового обязательства" value={debtor.debtObligation.number} />
                  <InfoRow label="Тип долгового обязательства" value={debtor.debtObligation.type} />
                  <InfoRow label="Договор цессии" value={debtor.debtObligation.cessionContract} />
                  <InfoRow label="Статус договора" value={debtor.debtObligation.contractStatus} />
                </div>
              </SectionCard>

              <SectionCard title="Даты и сроки" icon={Calendar}>
                <div className="space-y-1">
                  <InfoRow label="Дата заключения ДЗ" value={debtor.debtObligation.conclusionDate} />
                  <InfoRow label="Дата передачи по цессии" value={debtor.debtObligation.cessionTransferDate} />
                  <InfoRow label="Дата выхода на просрочку" value={debtor.debtObligation.overdueDate} />
                  <InfoRow label="Срок займа" value={debtor.debtObligation.loanTerm} />
                  <InfoRow label="Период с учетом пролонгаций" value={debtor.debtObligation.extensionPeriod} />
                  <InfoRow label="Количество пролонгаций" value={debtor.debtObligation.extensionCount} />
                  <InfoRow label="Дата вывода" value={debtor.debtObligation.withdrawalDate} />
                </div>
              </SectionCard>

              <SectionCard title="Финансовые показатели" icon={AlertCircle}>
                <div className="space-y-1">
                  <InfoRow label="Сумма займа" value={`${debtor.debtObligation.loanAmount?.toLocaleString('ru-RU')} ₽`} highlight />
                  <InfoRow label="Основной долг" value={`${debtor.debtObligation.principalDebt?.toLocaleString('ru-RU')} ₽`} />
                  <InfoRow label="Проценты" value={`${debtor.debtObligation.interest?.toLocaleString('ru-RU')} ₽`} />
                  <InfoRow label="Штрафы" value={`${debtor.debtObligation.fines?.toLocaleString('ru-RU')} ₽`} />
                  <InfoRow label="Пени" value={`${debtor.debtObligation.penalties?.toLocaleString('ru-RU')} ₽`} />
                  <InfoRow label="Гос. пошлина" value={`${debtor.debtObligation.stateFee?.toLocaleString('ru-RU')} ₽`} />
                  <InfoRow label="Судебные издержки" value={`${debtor.debtObligation.legalCosts?.toLocaleString('ru-RU')} ₽`} />
                  <InfoRow label="Сумма Индексации" value={`${debtor.debtObligation.indexationAmount?.toLocaleString('ru-RU')} ₽`} />
                  <InfoRow label="Планируемая сумма" value={`${debtor.debtObligation.plannedAmount?.toLocaleString('ru-RU')} ₽`} />
                  <InfoRow label="Размер основного процента" value={`${debtor.debtObligation.mainInterestRate}%`} />
                  <InfoRow label="Валюта" value={debtor.debtObligation.currency} />
                </div>
              </SectionCard>

              <SectionCard title="Работа и кредитование" icon={Building2}>
                <div className="space-y-1">
                  <InfoRow label="Кредитор" value={debtor.debtObligation.creditor} />
                  <InfoRow label="Точка выдачи" value={debtor.debtObligation.issuancePoint} />
                  <InfoRow label="Программа кредитования" value={debtor.debtObligation.lendingProgram} />
                  <InfoRow label="Название организации" value={debtor.debtObligation.organizationName} />
                  <InfoRow label="Адрес места работы" value={debtor.debtObligation.workAddress} />
                  <InfoRow label="Должность" value={debtor.debtObligation.position} />
                  <InfoRow label="Стационарный телефон по месту работы" value={debtor.debtObligation.workPhone} />
                </div>
              </SectionCard>

              <SectionCard title="Исполнительное производство и суд" icon={FileText}>
                <div className="space-y-1">
                  <InfoRow label="Стадия ИП" value={debtor.debtObligation.executionStage} />
                  <InfoRow label="Статус ИП" value={debtor.debtObligation.executionStatus} />
                  <InfoRow label="Состояние ИД" value={debtor.debtObligation.executionState} />
                  <InfoRow label="Тип ИП" value={debtor.debtObligation.executionType} />
                  <InfoRow label="Статус заявления в мировой суд" value={debtor.debtObligation.courtApplicationStatus} />
                  <InfoRow label="Наименование суда" value={debtor.debtObligation.courtName} />
                  <InfoRow label="Стадия взыскания" value={debtor.debtObligation.collectionStage} />
                </div>
              </SectionCard>

              <SectionCard title="Документы для суда" icon={FileText}>
                <div className="space-y-1">
                  <InfoRow label="Дата проверки документов для суда" value={debtor.debtObligation.documentsCheckDate} />
                  <InfoRow label="Состояние скан копии для суда" value={debtor.debtObligation.scanCopyState} />
                  <InfoRow label="Комплектность документов для суда" value={debtor.debtObligation.documentsCompleteness} />
                  <InfoRow label="Оформление документов для суда" value={debtor.debtObligation.documentsRegistration} />
                  <InfoRow label="Принадлежность документов для суда" value={debtor.debtObligation.documentsOwnership} />
                  <InfoRow label="Читабельность документов для суда" value={debtor.debtObligation.documentsReadability} />
                  <InfoRow label="Дата действия документов для суда" value={debtor.debtObligation.documentsExpiryDate} />
                  <InfoRow label="Восстановление документов для суда" value={debtor.debtObligation.documentsRecovery} />
                </div>
              </SectionCard>

              <SectionCard title="Прочее" icon={AlertCircle}>
                <div className="space-y-1">
                  <InfoRow label="Заморожен" value={debtor.debtObligation.frozen ? 'Да' : 'Нет'} />
                  <InfoRow label="Реструктуризация" value={debtor.debtObligation.restructuring ? 'Да' : 'Нет'} />
                  <InfoRow label="id Заемщика" value={debtor.debtObligation.borrowerId} />
                  <InfoRow label="Вывод" value={debtor.debtObligation.withdrawal} />
                  <InfoRow label="Состояние клиента" value={debtor.debtObligation.clientState} />
                  <InfoRow label="В работе" value={debtor.debtObligation.inProgress ? 'Да' : 'Нет'} />
                  <InfoRow label="Рекомендация сотрудника" value={debtor.debtObligation.employeeRecommendation} />
                  <InfoRow label="Район выезда" value={debtor.debtObligation.travelDistrict} />
                  <InfoRow label="Временная зона" value={debtor.debtObligation.timezone} />
                </div>
              </SectionCard>
            </TabsContent>

            {/* Должник */}
            <TabsContent value="debtor" className="space-y-4">
              <SectionCard title="Персональные данные" icon={Users}>
                <div className="space-y-1">
                  <InfoRow label="Код должника" value={debtor.debtorInfo.code} highlight />
                  <InfoRow label="Ф.И.О. Должника" value={debtor.debtorInfo.fullName} highlight />
                  <InfoRow label="Тип должника" value={debtor.debtorInfo.type} />
                  <InfoRow label="Дата рождения" value={debtor.debtorInfo.birthDate} />
                  <InfoRow label="Место рождения" value={debtor.debtorInfo.birthPlace} />
                  <InfoRow label="Предыдущая фамилия" value={debtor.debtorInfo.previousSurname} />
                  <InfoRow label="Семейное положение" value={debtor.debtorInfo.maritalStatus} />
                  <InfoRow label="СНИЛС" value={debtor.debtorInfo.snils} />
                  <InfoRow label="ИНН (у ИП)" value={debtor.debtorInfo.inn} />
                </div>
              </SectionCard>

              <SectionCard title="Паспортные данные" icon={FileText}>
                <div className="space-y-1">
                  <InfoRow label="Серия" value={debtor.debtorInfo.passportSeries} />
                  <InfoRow label="Номер" value={debtor.debtorInfo.passportNumber} />
                  <InfoRow label="Дата выдачи" value={debtor.debtorInfo.passportIssueDate} />
                  <InfoRow label="Кем выдан" value={debtor.debtorInfo.passportIssuedBy} />
                  <InfoRow label="Код подразделения" value={debtor.debtorInfo.passportDepartmentCode} />
                </div>
              </SectionCard>

              <SectionCard title="Контактные данные" icon={Phone}>
                <div className="space-y-1">
                  <InfoRow label="Телефон" value={debtor.phone} highlight />
                  <InfoRow label="Адрес эл. почты" value={debtor.email} />
                </div>
              </SectionCard>

              <SectionCard title="Адреса" icon={MapPin}>
                <div className="space-y-1">
                  <InfoRow label="Адрес регистрации" value={debtor.debtorInfo.registrationAddress} />
                  <InfoRow label="Ком. по АР" value={debtor.debtorInfo.registrationComment} />
                  <InfoRow label="Адрес проживания" value={debtor.debtorInfo.residenceAddress} />
                  <InfoRow label="Ком. по АФ" value={debtor.debtorInfo.residenceComment} />
                </div>
              </SectionCard>

              <SectionCard title="Трудовая деятельность" icon={Building2}>
                <div className="space-y-1">
                  <InfoRow label="Место трудовой деятельности" value={debtor.debtorInfo.workPlace} />
                </div>
              </SectionCard>

              <SectionCard title="Информация о смерти" icon={AlertCircle}>
                <div className="space-y-1">
                  <InfoRow label="Дат�� смерти" value={debtor.debtorInfo.deathDate} />
                  <InfoRow label="Подтверждающий документ" value={debtor.debtorInfo.deathCertificate} />
                  <InfoRow label="Наследственное дело" value={debtor.debtorInfo.inheritanceCase} />
                  <InfoRow label="ФИО Нотариуса" value={debtor.debtorInfo.notaryFullName} />
                  <InfoRow label="Нотариальная палата" value={debtor.debtorInfo.notaryChamber} />
                  <InfoRow label="Адрес нотариуса" value={debtor.debtorInfo.notaryAddress} />
                  <InfoRow label="Телефон нотариуса" value={debtor.debtorInfo.notaryPhone} />
                </div>
              </SectionCard>
            </TabsContent>

            {/* Контрагенты */}
            <TabsContent value="counterparties" className="space-y-4">
              {debtor.counterparties && debtor.counterparties.length > 0 ? (
                debtor.counterparties.map((counterparty: any, index: number) => (
                  <SectionCard key={index} title={`Контрагент ${index + 1}`} icon={Building2}>
                    <div className="space-y-1">
                      <InfoRow label="Код контрагента" value={counterparty.code} highlight />
                      <InfoRow label="Ф.И.О. контрагента" value={counterparty.fullName} highlight />
                      <InfoRow label="Тип контрагента" value={counterparty.type} />
                    </div>
                  </SectionCard>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>Контрагенты не указаны</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
