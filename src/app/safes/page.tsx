'use client';

import React, { useState, useEffect } from 'react';
import { Vault as Safe, Bank, Category } from '@/api/entities/all';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { withAuth } from '@/components/withAuth';
import { toast } from 'react-toastify';

interface SafeData {
  id: string;
  name: string;
  amount: number;
  currency: string;
  bank_id?: string;
  created_date: string;
  updated_date?: string;
}

interface BankData {
  id: string;
  name: string;
}

interface CategoryData {
  id: string;
  description: string;
  type: 'EXPENSE' | 'INCOME';
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Plus, PiggyBank, ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react";
import SafeTransactionDialog from '@/components/Safes/SafeTransactionDialog';
import { Label } from "@/components/ui/label";

function SafesPage() {
  const [safes, setSafes] = useState<SafeData[]>([]);
  const [banks, setBanks] = useState<BankData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [newSafe, setNewSafe] = useState({
    name: "",
    description: "",
    amount: "0,00",
    currency: "BRL",
    bank_id: "none"
  });
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [currentSafe, setCurrentSafe] = useState<SafeData | null>(null);
  const [transactionType, setTransactionType] = useState<'DEPOSIT' | 'WITHDRAWAL' | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [safesData, banksData, categoriesData] = await Promise.all([
        Safe.list(),
        Bank.list(),
        Category.list()
      ]);
      
      // Converte os valores de centavos para decimal
      const formattedSafes = safesData.map(safe => ({
        ...safe,
        amount: typeof safe.amount === 'number' ? safe.amount / 100 : 0
      }));
      
      setSafes(formattedSafes);
      setBanks(banksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const formatInputValue = (value: string): string => {
    // Remove tudo exceto números e vírgula
    const cleaned = value.replace(/[^\d,]/g, '');
    // Substitui vírgula por ponto para manipulação
    const withDot = cleaned.replace(',', '.');
    // Converte para número e formata com 2 casas decimais
    const number = parseFloat(withDot || '0');
    if (isNaN(number)) return "0,00";
    // Retorna o valor formatado com vírgula
    return number.toFixed(2).replace('.', ',');
  };

  const handleAmountChange = (value: string) => {
    // Remove caracteres não numéricos exceto vírgula
    const cleaned = value.replace(/[^\d,]/g, '');
    
    // Se estiver vazio, não atualiza
    if (!cleaned) {
      setNewSafe(prev => ({ ...prev, amount: "0,00" }));
      return;
    }

    // Encontra a posição da vírgula
    const commaIndex = cleaned.indexOf(',');
    
    // Se não tem vírgula, adiciona ,00 ao final
    if (commaIndex === -1) {
      setNewSafe(prev => ({ ...prev, amount: `${cleaned},00` }));
      return;
    }

    // Separa a parte inteira e decimal
    const integerPart = cleaned.slice(0, commaIndex);
    const decimalPart = cleaned.slice(commaIndex + 1);

    // Limita a parte decimal a 2 dígitos e completa com zeros se necessário
    const formattedDecimal = (decimalPart + "00").slice(0, 2);
    const formattedValue = `${integerPart || "0"},${formattedDecimal}`;
    
    setNewSafe(prev => ({ ...prev, amount: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSafe.name.trim() || !newSafe.amount || !newSafe.description.trim()) return;

    try {
      // Converte o valor para número (troca vírgula por ponto)
      const valueAsNumber = parseFloat(newSafe.amount.replace(',', '.'));
      if (isNaN(valueAsNumber)) {
        console.error("Valor inválido para saldo inicial");
        return;
      }

      const data = {
        name: newSafe.name.trim(),
        description: newSafe.description.trim(),
        initialAmount: valueAsNumber,
        currency: newSafe.currency,
      };

      if (newSafe.bank_id !== "none") {
        Object.assign(data, { bankId: newSafe.bank_id });
      }

      await Safe.create(data);
      setNewSafe({
        name: "",
        description: "",
        amount: "0,00",
        currency: "BRL",
        bank_id: "none"
      });
      loadData();
      toast.success("Cofre criado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar cofre:", error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível criar o cofre. Tente novamente mais tarde.");
      }
    }
  };

  const openTransactionDialog = (safe: SafeData, type: 'DEPOSIT' | 'WITHDRAWAL') => {
    setCurrentSafe(safe);
    setTransactionType(type);
    setTransactionDialogOpen(true);
  };

  const formatCurrency = (value: number, currency: string) => {
    try {
      return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
        style: 'currency',
        currency: currency
      }).format(value);
    } catch (error) {
      return currency === 'BRL' ? 'R$ 0,00' : '$ 0.00';
    }
  };

  return (
    <div className="h-full w-full bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cofres</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulário de Novo Cofre */}
          <div className="lg:col-span-4">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="border-b bg-purple-50/80">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-purple-900">
                  <Plus className="w-5 h-5 text-purple-600" />
                  Novo Cofre
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="name" className="text-base font-semibold text-gray-900 mb-1.5 block">
                        Nome do cofre <span className="text-purple-600">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={newSafe.name}
                        onChange={(e) => setNewSafe({ ...newSafe, name: e.target.value })}
                        placeholder="Ex: Viagem de férias"
                        className="w-full bg-white text-gray-900 border-gray-300 focus:border-purple-500 focus:ring-purple-500 placeholder:text-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-base font-semibold text-gray-900 mb-1.5 block">
                        Descrição <span className="text-purple-600">*</span>
                      </Label>
                      <Input
                        id="description"
                        value={newSafe.description}
                        onChange={(e) => setNewSafe({ ...newSafe, description: e.target.value })}
                        placeholder="Ex: Economias para viagem de férias"
                        className="w-full bg-white text-gray-900 border-gray-300 focus:border-purple-500 focus:ring-purple-500 placeholder:text-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount" className="text-base font-semibold text-gray-900 mb-1.5 block">
                        Saldo inicial <span className="text-purple-600">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="amount"
                          type="text"
                          inputMode="decimal"
                          value={newSafe.amount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          onBlur={(e) => {
                            const formatted = formatInputValue(e.target.value);
                            setNewSafe(prev => ({ ...prev, amount: formatted }));
                          }}
                          placeholder="0,00"
                          className="w-full pl-8 bg-white text-gray-900 border-gray-300 focus:border-purple-500 focus:ring-purple-500 placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="currency" className="text-base font-semibold text-gray-900 mb-1.5 block">
                        Moeda <span className="text-purple-600">*</span>
                      </Label>
                      <Select
                        value={newSafe.currency}
                        onValueChange={(value) => setNewSafe({ ...newSafe, currency: value })}
                        required
                      >
                        <SelectTrigger 
                          id="currency" 
                          className="w-full bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500"
                        >
                          <SelectValue placeholder="Selecione a moeda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BRL">Real (BRL)</SelectItem>
                          <SelectItem value="USD">Dólar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bank" className="text-base font-semibold text-gray-900 mb-1.5 block">
                        Banco vinculado <span className="text-gray-500 font-normal">(opcional)</span>
                      </Label>
                      <Select
                        value={newSafe.bank_id}
                        onValueChange={(value) => setNewSafe({ ...newSafe, bank_id: value })}
                      >
                        <SelectTrigger 
                          id="bank" 
                          className="w-full bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500"
                        >
                          <SelectValue placeholder="Vincular a um banco" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhum banco</SelectItem>
                          {banks.map((bank) => (
                            <SelectItem key={bank.id} value={bank.id}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium border-0 shadow-sm hover:shadow transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Cofre
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Cofres */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {safes.map((safe) => (
                <Card key={safe.id} className="bg-white shadow-lg border-0">
                  <CardHeader className="border-b bg-purple-50 pb-4">
                    <CardTitle className="text-lg font-medium flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PiggyBank className="w-5 h-5 text-purple-600" />
                        <span className="text-purple-900">{safe.name}</span>
                      </div>
                      <span className="text-sm font-normal text-purple-700">
                        {safe.currency}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-gray-800">
                      {formatCurrency(safe.amount, safe.currency)}
                    </div>
                    {safe.bank_id && (
                      <p className="text-sm text-gray-700 mt-2">
                        Vinculado a: <span className="font-medium">{banks.find(b => b.id === safe.bank_id)?.name}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-1">
                      Atualizado em {(() => {
                        try {
                          const date = new Date(safe.updated_date || safe.created_date);
                          if (isNaN(date.getTime())) {
                            return 'Data não disponível';
                          }
                          return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
                        } catch (error) {
                          return 'Data não disponível';
                        }
                      })()}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2 pt-0 border-t">
                    <Button 
                      onClick={() => openTransactionDialog(safe, "DEPOSIT")}
                      variant="ghost"
                      className="flex-1 text-green-700 hover:text-green-800 hover:bg-green-50 font-medium"
                    >
                      <ArrowUpCircle className="w-4 h-4 mr-2" />
                      Depositar
                    </Button>
                    <Button 
                      onClick={() => openTransactionDialog(safe, "WITHDRAWAL")}
                      variant="ghost"
                      className="flex-1 text-red-700 hover:text-red-800 hover:bg-red-50 font-medium"
                    >
                      <ArrowDownCircle className="w-4 h-4 mr-2" />
                      Sacar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {safes.length === 0 && (
                <Card className="md:col-span-2 bg-white shadow-lg border-0">
                  <CardContent className="text-center py-8">
                    <PiggyBank className="w-12 h-12 mx-auto mb-4 text-purple-300" />
                    <p className="text-gray-700 font-medium">Nenhum cofre cadastrado</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Adicione um cofre usando o formulário ao lado
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {currentSafe && transactionType && (
        <SafeTransactionDialog
          open={transactionDialogOpen}
          safe={currentSafe}
          type={transactionType}
          categories={categories.filter(cat => 
            transactionType === "DEPOSIT" ? cat.type === "INCOME" : cat.type === "EXPENSE"
          )}
          onClose={() => {
            setTransactionDialogOpen(false);
            setCurrentSafe(null);
            setTransactionType(null);
          }}
          onTransactionComplete={loadData}
        />
      )}
    </div>
  );
}

export default withAuth(SafesPage);