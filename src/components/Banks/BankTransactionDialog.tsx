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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Transaction, Bank } from "@/api/entities/all";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Loader2 } from "lucide-react";

interface BankTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  bank: {
    id: string;
    name: string;
    balance: number;
  };
  type: "DEPOSIT" | "WITHDRAWAL";
  categories: Array<{
    id: string;
    description: string;
  }>;
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
  const [categoryId, setCategoryId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    setLoading(true);
    try {
      // Create transaction record
      await Transaction.create({
        description: description.trim(),
        amount: parseFloat(amount),
        transaction_date: new Date().toISOString().split('T')[0],
        transaction_type: type,
        bank_id: bank.id,
        category_id: categoryId || undefined
      });

      // Update bank balance
      const newBalance = type === "DEPOSIT" 
        ? bank.balance + parseFloat(amount)
        : bank.balance - parseFloat(amount);
      
      await Bank.update(bank.id, {
        balance: newBalance
      });

      onTransactionComplete();
      onClose();

    } catch (error) {
      console.error("Error processing transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const DialogIcon = type === "DEPOSIT" ? ArrowUpCircle : ArrowDownCircle;
  const dialogTitle = type === "DEPOSIT" ? "Depositar" : "Sacar";
  const dialogColor = type === "DEPOSIT" ? "text-green-600" : "text-red-600";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DialogIcon className={`h-5 w-5 ${dialogColor}`} />
            {dialogTitle} no {bank?.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da transação"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria (opcional)</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem categoria</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className={type === "DEPOSIT" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
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