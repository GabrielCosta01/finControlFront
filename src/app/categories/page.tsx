'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Tag, Trash2, RefreshCw } from "lucide-react";
import { Category } from '@/api/entities/all';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState({
    description: '',
    type: 'EXPENSE',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await Category.list();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.description.trim()) return;

    try {
      await Category.create(newCategory);
      setNewCategory({
        description: '',
        type: 'EXPENSE',
      });
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await Category.delete(id);
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  const handleTypeToggle = (id: string, currentType: string) => {
    const newType = currentType === 'EXPENSE' ? 'INCOME' : 'EXPENSE';
    
    Category.update(id, { type: newType })
      .then(() => fetchCategories())
      .catch(error => console.error("Erro ao alterar tipo:", error));
  };

  return (
    <div className="h-full w-full">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchCategories}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulário de Nova Categoria */}
          <div className="lg:col-span-4">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-500" />
                  Nova Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Nome da categoria"
                      className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={newCategory.type === 'EXPENSE' ? 'default' : 'outline'}
                        className={`flex-1 ${newCategory.type === 'EXPENSE' ? 'bg-red-500 hover:bg-red-600 border-0' : 'border-gray-200'}`}
                        onClick={() => setNewCategory({ ...newCategory, type: 'EXPENSE' })}
                      >
                        Despesa
                      </Button>
                      <Button
                        type="button"
                        variant={newCategory.type === 'INCOME' ? 'default' : 'outline'}
                        className={`flex-1 ${newCategory.type === 'INCOME' ? 'bg-green-500 hover:bg-green-600 border-0' : 'border-gray-200'}`}
                        onClick={() => setNewCategory({ ...newCategory, type: 'INCOME' })}
                      >
                        Receita
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Categoria
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Categorias */}
          <div className="lg:col-span-8">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-500" />
                  Categorias Cadastradas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  {categories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                      <Tag className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Nenhuma categoria cadastrada</p>
                      <p className="text-sm text-gray-400">Adicione uma categoria usando o formulário ao lado</p>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${category.type === 'EXPENSE' ? 'bg-red-500' : 'bg-green-500'}`} />
                          <span className="font-medium text-gray-900">{category.description}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleTypeToggle(category.id, category.type)}
                            variant="ghost"
                            size="sm"
                            className={`${
                              category.type === 'EXPENSE' 
                                ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            }`}
                          >
                            {category.type === 'EXPENSE' ? 'Despesa' : 'Receita'}
                          </Button>
                          <Button
                            onClick={() => handleDelete(category.id)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
