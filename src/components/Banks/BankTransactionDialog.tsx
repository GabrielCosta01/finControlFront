import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Bank, Expense, ExtraIncome } from "@/api/entities/all";
import { BankDto, CategoryDetailResponseDto, ExpenseCreateDto, ExtraIncomeDto } from "@/types";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Loader2, Building2, Calendar } from "lucide-react";
import { toast } from 'react-toastify';

interface BankTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  bank: Pick<BankDto, 'id' | 'name' | 'currentBalance'>;
  type: "DEPOSIT" | "WITHDRAWAL";
  categories: CategoryDetailResponseDto[];
  onTransactionComplete: () => void;
}

export default function BankTransactionDialog({
  open,
  onClose,
  bank,
  type,
  categories,
  onTransactionComplete
}: BankTransactionDialogProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string>("_none");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de todos os campos obrigatórios
    if (!description.trim()) {
      toast.warning("Por favor, informe uma descrição");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.warning("Por favor, informe um valor válido");
      return;
    }

    if (!date) {
      toast.warning("Por favor, selecione uma data");
      return;
    }

    if (categoryId === "_none") {
      toast.warning("Por favor, selecione uma categoria");
      return;
    }

    setLoading(true);
    try {
      // Create transaction record based on type
      if (type === "WITHDRAWAL") {
        const expenseData: ExpenseCreateDto = {
          name: description.trim(),
          value: parseFloat(amount),
          bankId: bank.id,
          expenseDate: date,
          categoryId
        };

        await Expense.create(expenseData);
      } else {
        const incomeData: ExtraIncomeDto = {
          description: description.trim(),
          amount: parseFloat(amount),
          date: date,
          categoryId
        };

        await ExtraIncome.create(incomeData);
      }

      // Update bank balance
      const newBalance = type === "DEPOSIT" 
        ? bank.currentBalance + parseFloat(amount)
        : bank.currentBalance - parseFloat(amount);
      
      await Bank.update(bank.id, {
        balance: newBalance
      });

      toast.success(`${type === "DEPOSIT" ? "Depósito" : "Saque"} realizado com sucesso!`);
      onTransactionComplete();
      onClose();

    } catch (error) {
      console.error("Error processing transaction:", error);
      toast.error(`Erro ao realizar ${type === "DEPOSIT" ? "depósito" : "saque"}. Tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  const DialogIcon = type === "DEPOSIT" ? ArrowUpCircle : ArrowDownCircle;
  const dialogTitle = type === "DEPOSIT" ? "Depositar" : "Sacar";
  const dialogColor = type === "DEPOSIT" ? "text-green-600" : "text-red-600";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg border border-gray-200/80">
        <DialogHeader className="space-y-3 border-b border-gray-100 pb-4 bg-gradient-to-br from-white to-gray-50/80">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <DialogIcon className={`h-5 w-5 ${dialogColor} transition-transform duration-200 hover:scale-110`} />
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-gray-600">
            <Building2 className="h-4 w-4" />
            {bank?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Descreva ${type === "DEPOSIT" ? "o depósito" : "o saque"}`}
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
                  max={new Date().toISOString().slice(0, 10)}
                  className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Categoria <span className="text-red-500">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger 
                  id="category" 
                  className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md bg-white"
                >
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                  <SelectItem value="_none" className="text-gray-500 hover:bg-gray-50 transition-colors duration-200">
                    Selecione uma categoria
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
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-gray-200 hover:border-gray-300 transition-colors duration-200"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className={`flex-1 ${
                type === "DEPOSIT" 
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" 
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              } text-white transition-all duration-200 shadow-sm hover:shadow rounded-md`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {type === "DEPOSIT" ? "Depositar" : "Sacar"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}