'use client';
import React, { useState, useEffect } from 'react';
import { ExtraIncome, Bank, Category } from '@/api/entities/all';
import { ExtraIncomeDto, BankDto, CategoryDetailResponseDto } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, RefreshCw, Pencil, Trash2, ArrowUp, CalendarIcon } from "lucide-react";
import { toast } from 'react-toastify';
import { withAuth } from '@/components/withAuth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function ExtraIncomePage() {
  const [extraIncomes, setExtraIncomes] = useState<ExtraIncomeDto[]>([]);
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [categories, setCategories] = useState<CategoryDetailResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExtraIncome, setCurrentExtraIncome] = useState<ExtraIncomeDto | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [bankId, setBankId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [extraIncomesData, banksData, categoriesData] = await Promise.all([
        ExtraIncome.list(),
        Bank.list(),
        Category.list()
      ]);
      
      setExtraIncomes(extraIncomesData);
      setBanks(banksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setAmount('');
    setBankId('');
    setCategoryId('');
    setDate(new Date().toISOString().slice(0, 10));
    setCurrentExtraIncome(null);
    setIsEditing(false);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (extraIncome: ExtraIncomeDto) => {
    setCurrentExtraIncome(extraIncome);
    const income = extraIncome as any;
    setName(income.name || extraIncome.description || '');
    setDescription(extraIncome.description || '');
    setAmount(extraIncome.amount.toString());
    setBankId(extraIncome.bankId);
    setCategoryId(extraIncome.categoryId || '_none');
    setDate(
      income.date || 
      (extraIncome.createdAt ? new Date(extraIncome.createdAt).toISOString().slice(0, 10) : 
      new Date().toISOString().slice(0, 10))
    );
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount || !bankId || !date) {
      toast.warning('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const formattedAmount = parseFloat(amount);
    if (isNaN(formattedAmount) || formattedAmount <= 0) {
      toast.warning('Por favor, informe um valor válido.');
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        name: name,
        description: description || name,
        amount: formattedAmount,
        date: date,
        bankId,
        categoryId: categoryId && categoryId !== "_none" ? categoryId : undefined
      };

      if (isEditing && currentExtraIncome) {
        // Calculate the difference in amount
        const amountDifference = formattedAmount - currentExtraIncome.amount;
        
        await ExtraIncome.update(currentExtraIncome.id, data);

        // Only update bank balance if there's a change in amount or bank
        if (amountDifference !== 0 || bankId !== currentExtraIncome.bankId) {
          // If bank changed, update both banks
          if (bankId !== currentExtraIncome.bankId) {
            // Subtract from old bank
            const oldBank = banks.find(b => b.id === currentExtraIncome.bankId);
            if (oldBank) {
              await Bank.update(currentExtraIncome.bankId, {
                balance: (oldBank.currentBalance || 0) - currentExtraIncome.amount,
                currentBalance: (oldBank.currentBalance || 0) - currentExtraIncome.amount,
                totalIncome: Math.max(0, (oldBank.totalIncome || 0) - currentExtraIncome.amount)
              });
            }
            
            // Add to new bank
            const newBank = banks.find(b => b.id === bankId);
            if (newBank) {
              await Bank.update(bankId, {
                balance: (newBank.currentBalance || 0) + formattedAmount,
                currentBalance: (newBank.currentBalance || 0) + formattedAmount,
                totalIncome: (newBank.totalIncome || 0) + formattedAmount
              });
            }
          } else if (amountDifference !== 0) {
            // Same bank, just update with the difference
            const selectedBank = banks.find(b => b.id === bankId);
            if (selectedBank) {
              await Bank.update(bankId, {
                balance: (selectedBank.currentBalance || 0) + amountDifference,
                currentBalance: (selectedBank.currentBalance || 0) + amountDifference,
                totalIncome: Math.max(0, (selectedBank.totalIncome || 0) + amountDifference)
              });
            }
          }
        }

        toast.success('Renda extra atualizada com sucesso!');
      } else {
        await ExtraIncome.create(data);

        // Update bank balance
        const selectedBank = banks.find(b => b.id === bankId);
        if (selectedBank) {
          await Bank.update(bankId, {
            balance: (selectedBank.currentBalance || 0) + formattedAmount,
            currentBalance: (selectedBank.currentBalance || 0) + formattedAmount,
            totalIncome: (selectedBank.totalIncome || 0) + formattedAmount
          });
        }

        toast.success('Renda extra adicionada com sucesso!');
      }
      
      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta renda extra? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsLoading(true);
    try {
      const incomeToDelete = extraIncomes.find(income => income.id === id);
      if (!incomeToDelete) {
        throw new Error('Renda extra não encontrada');
      }

      await ExtraIncome.delete(id);

      // Update bank balance
      const bank = banks.find(b => b.id === incomeToDelete.bankId);
      if (bank) {
        await Bank.update(incomeToDelete.bankId, {
          balance: (bank.currentBalance || 0) - incomeToDelete.amount,
          currentBalance: (bank.currentBalance || 0) - incomeToDelete.amount,
          totalIncome: Math.max(0, (bank.totalIncome || 0) - incomeToDelete.amount)
        });
      }

      toast.success('Renda extra excluída com sucesso!');
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Erro ao excluir. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getBankName = (bankId: string) => {
    const bank = banks.find(b => b.id === bankId);
    return bank ? bank.name : 'Banco não encontrado';
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId || categoryId === "_none") return 'Sem categoria';
    
    const category = categories.find(c => c.category?.id === categoryId);
    return category ? category.category.name : 'Categoria não encontrada';
  };

  const totalExtraIncome = extraIncomes.reduce((total, income) => total + income.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 py-8">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rendas Extras</h1>
            <p className="mt-1 text-gray-500">Gerencie suas rendas extras e complementares</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-200 shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Renda Extra
            </Button>
            <Button
              onClick={loadData}
              variant="outline"
              className="text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 transition-colors duration-200 shadow-sm"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Total Summary */}
        <Card className="mb-8 bg-white shadow-sm border border-gray-200/80 rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1 bg-green-50/50 p-4 rounded-lg border border-green-100/50">
                <p className="text-sm text-gray-600">Total de Rendas Extras</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalExtraIncome)}
                </p>
              </div>
              <div className="space-y-1 bg-blue-50/50 p-4 rounded-lg border border-blue-100/50">
                <p className="text-sm text-gray-600">Quantidade</p>
                <p className="text-2xl font-bold text-blue-600">{extraIncomes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extra Income List */}
        {extraIncomes.length === 0 ? (
          <Card className="bg-white shadow-sm border border-gray-200/80 rounded-lg overflow-hidden">
            <CardContent className="p-12 text-center">
              <ArrowUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">Nenhuma renda extra registrada</h3>
              <p className="text-gray-500 mb-6">Comece adicionando sua primeira renda extra</p>
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Renda Extra
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extraIncomes.map((income) => (
              <Card 
                key={income.id} 
                className="bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/80 rounded-lg overflow-hidden"
              >
                <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/80 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                      {income.description || 'Renda Extra'}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(income)}
                        className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(income.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-500 mt-1">
                    {formatDate(income.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Valor</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(income.amount)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Banco</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {getBankName(income.bankId)}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Categoria</p>
                      <p className="text-base font-medium text-gray-800">
                        {getCategoryName(income.categoryId)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-lg shadow-lg border border-gray-200/80">
          <DialogHeader className="space-y-3 border-b border-gray-100 pb-4 bg-gradient-to-br from-white to-gray-50/80">
            <DialogTitle className="text-xl">
              {isEditing ? 'Editar Renda Extra' : 'Nova Renda Extra'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {isEditing ? 'Atualize os detalhes da renda extra' : 'Adicione uma nova renda extra ao seu controle financeiro'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Freelance, Venda de produtos, etc."
                  className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Descrição <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Freelance, Venda de produtos, etc."
                  className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Valor <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="pl-8 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Data <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md"
                    required
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank" className="text-sm font-medium text-gray-700">
                  Banco <span className="text-red-500">*</span>
                </Label>
                <Select value={bankId} onValueChange={setBankId}>
                  <SelectTrigger 
                    id="bank" 
                    className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md bg-white"
                  >
                    <SelectValue placeholder="Selecione um banco" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                    {banks.map(bank => (
                      <SelectItem 
                        key={bank.id} 
                        value={bank.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Categoria
                </Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger 
                    id="category" 
                    className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md bg-white"
                  >
                    <SelectValue placeholder="Selecione uma categoria (opcional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                    <SelectItem value="_none" className="text-gray-500 hover:bg-gray-50 transition-colors duration-200">
                      Sem categoria
                    </SelectItem>
                    {categories.map(category => (
                      <SelectItem 
                        key={category.category.id} 
                        value={category.category.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        {category.category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 border-t border-gray-100 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isLoading}
                className="flex-1 border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-200 shadow-sm hover:shadow rounded-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {isEditing ? 'Atualizar' : 'Adicionar'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAuth(ExtraIncomePage); 