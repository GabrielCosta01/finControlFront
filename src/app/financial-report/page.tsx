"use client";

import React, { useState, useEffect } from 'react';
import { Bank, Expense, ExtraIncome, Category } from '@/api/entities/all';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
  ChevronRight,
  Calendar,
  PieChart,
  BarChart3
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, getMonth, getYear, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { withAuth } from '@/components/withAuth';
import type { BankDto, ExtraIncomeDto, CategoryDetailResponseDto, ExpenseDataDto } from '@/types';

function FinancialReportPage() {
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [expenses, setExpenses] = useState<ExpenseDataDto[]>([]);
  const [extraIncomes, setExtraIncomes] = useState<ExtraIncomeDto[]>([]);
  const [categories, setCategories] = useState<CategoryDetailResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para filtros
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [year, month] = selectedMonth.split('-').map(Number);
      const startDate = startOfMonth(new Date(year, month - 1));
      const endDate = endOfMonth(new Date(year, month - 1));
      
      const [banksData, expensesData, extraIncomesData, categoriesData] = await Promise.all([
        Bank.list(),
        Expense.list(), 
        ExtraIncome.list(),
        Category.list()
      ]);
      
      setBanks(banksData);
      setCategories(categoriesData);
      
      // Extrair os dados de despesas e filtrar por mês
      const expensesDataFiltered = expensesData
        .map(expenseDetail => expenseDetail.expense)
        .filter(expense => {
          if (!expense.expenseDate) return false;
          const expenseDate = parseISO(expense.expenseDate);
          return expenseDate >= startDate && expenseDate <= endDate;
        });
      
      setExpenses(expensesDataFiltered);
      
      // Filtrar rendas extras por mês
      const filteredIncomes = extraIncomesData.filter(income => {
        // Usar createdAt se date não estiver disponível
        const incomeDate = income.createdAt ? parseISO(income.createdAt) : null;
        if (!incomeDate) return false;
        return incomeDate >= startDate && incomeDate <= endDate;
      });
      setExtraIncomes(filteredIncomes);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular valores para o relatório
  const totalExpenses = expenses.reduce((total, expense) => total + expense.value, 0);
  const totalIncomes = extraIncomes.reduce((total, income) => total + income.amount, 0);
  const monthlyBalance = totalIncomes - totalExpenses;

  // Calcular despesas por categoria
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const categoryId = expense.categoryId;
    if (!categoryId) return acc;
    
    if (!acc[categoryId]) {
      acc[categoryId] = 0;
    }
    acc[categoryId] += expense.value;
    return acc;
  }, {} as Record<string, number>);

  // Calcular rendas extras por categoria
  const incomesByCategory = extraIncomes.reduce((acc, income) => {
    const categoryId = income.categoryId;
    if (!categoryId) return acc;
    
    if (!acc[categoryId]) {
      acc[categoryId] = 0;
    }
    acc[categoryId] += income.amount;
    return acc;
  }, {} as Record<string, number>);

  // Gerar lista de meses para seleção
  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = subMonths(currentDate, i);
      const value = `${getYear(date)}-${String(getMonth(date) + 1).padStart(2, '0')}`;
      const label = format(date, 'MMMM yyyy', { locale: ptBR });
      
      options.push({ value, label });
    }
    
    return options;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.category?.id === categoryId);
    return category ? category.category.name : 'Sem categoria';
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatório Financeiro Mensal</h1>
          <p className="mt-1 text-gray-500">Análise detalhada das suas finanças</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select 
              value={selectedMonth} 
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="bg-white border border-gray-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Selecione o mês" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                {getMonthOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-900 border border-gray-200"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-sm border border-gray-200/80 rounded-lg overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/80 pb-4">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Entradas no Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncomes)}
            </div>
            <p className="text-sm text-gray-500 mt-1">{extraIncomes.length} transações</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200/80 rounded-lg overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/80 pb-4">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              Saídas no Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-sm text-gray-500 mt-1">{expenses.length} transações</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200/80 rounded-lg overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/80 pb-4">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-500" />
              Saldo Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(monthlyBalance)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {monthlyBalance >= 0 ? 'Positivo' : 'Negativo'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Análise por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white shadow-sm border border-gray-200/80 rounded-lg overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/80">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-red-500" />
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {Object.keys(expensesByCategory).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma despesa encontrada no período
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(expensesByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([categoryId, value]) => (
                    <div key={categoryId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="font-medium">{getCategoryName(categoryId)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{formatCurrency(value)}</span>
                        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                          {Math.round((value / totalExpenses) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200/80 rounded-lg overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/80">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-green-500" />
              Rendas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {Object.keys(incomesByCategory).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma renda encontrada no período
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(incomesByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([categoryId, value]) => (
                    <div key={categoryId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="font-medium">{getCategoryName(categoryId)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{formatCurrency(value)}</span>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          {Math.round((value / totalIncomes) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabelas de Transações */}
      <div className="grid grid-cols-1 gap-8">
        <Card className="bg-white shadow-sm border border-gray-200/80 rounded-lg overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/80">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Detalhamento de Transações
            </CardTitle>
            <CardDescription>
              Todas as transações do período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                <TrendingDown className="w-4 h-4 mr-2 text-red-500" />
                Despesas
              </h3>
              {expenses.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                  Nenhuma despesa encontrada no período
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Banco</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map(expense => {
                        // Usar bankId se existir na expense
                        const bankId = (expense as any).bankId;
                        const bankName = bankId ? banks.find(b => b.id === bankId)?.name || 'N/A' : 'N/A';
                        return (
                          <TableRow key={expense.id}>
                            <TableCell>{formatDate(expense.expenseDate)}</TableCell>
                            <TableCell className="font-medium">{expense.name}</TableCell>
                            <TableCell>{expense.categoryId ? getCategoryName(expense.categoryId) : 'Sem categoria'}</TableCell>
                            <TableCell>{bankName}</TableCell>
                            <TableCell className="text-right font-semibold text-red-600">
                              {formatCurrency(expense.value)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                Rendas Extras
              </h3>
              {extraIncomes.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                  Nenhuma renda extra encontrada no período
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Banco</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {extraIncomes.map(income => {
                        const bankName = banks.find(b => b.id === income.bankId)?.name || 'N/A';
                        return (
                          <TableRow key={income.id}>
                            <TableCell>
                              {formatDate(income.createdAt || '')}
                            </TableCell>
                            <TableCell className="font-medium">{income.description || 'Sem descrição'}</TableCell>
                            <TableCell>{income.categoryId ? getCategoryName(income.categoryId) : 'Sem categoria'}</TableCell>
                            <TableCell>{bankName}</TableCell>
                            <TableCell className="text-right font-semibold text-green-600">
                              {formatCurrency(income.amount)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(FinancialReportPage); 