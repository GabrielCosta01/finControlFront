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
import { Plus, Tag, Trash2, RefreshCw, Edit, Check, X } from "lucide-react";
import { Category } from '@/api/entities';
import { toast } from 'react-toastify';

interface CategoryType {
  id: string;
  userId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [newCategory, setNewCategory] = useState({
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await Category.list();
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      toast.error("Não foi possível carregar as categorias. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.description.trim()) {
      toast.warning("Por favor, insira uma descrição para a categoria");
      return;
    }

    try {
      setLoading(true);
      await Category.create(newCategory);
      setNewCategory({
        description: '',
      });
      toast.success("Categoria criada com sucesso!");
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      toast.error("Não foi possível criar a categoria. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) {
      return;
    }
    
    try {
      setLoading(true);
      await Category.delete(id);
      toast.success("Categoria excluída com sucesso!");
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Não foi possível excluir a categoria. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  const startEditing = (category: CategoryType) => {
    setEditingId(category.id);
    setEditDescription(category.description);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditDescription('');
  };

  const saveEditing = async () => {
    if (!editingId || !editDescription.trim()) {
      return;
    }

    try {
      setLoading(true);
      await Category.update(editingId, { description: editDescription });
      toast.success("Categoria atualizada com sucesso!");
      setEditingId(null);
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Não foi possível atualizar a categoria. Tente novamente mais tarde.");
      setLoading(false);
    }
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
              disabled={loading}
              className="text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
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
                      disabled={loading}
                      className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 border-0"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Categoria
                      </>
                    )}
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
                {loading && categories.length === 0 ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-500 animate-spin" />
                    <p className="text-gray-500">Carregando categorias...</p>
                  </div>
                ) : (
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
                          {editingId === category.id ? (
                            <div className="flex-1 flex items-center gap-2">
                              <Input
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                autoFocus
                              />
                              <Button
                                onClick={saveEditing}
                                variant="ghost"
                                size="sm"
                                disabled={loading}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={cancelEditing}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-900">{category.description}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => startEditing(category)}
                                  variant="ghost"
                                  size="sm"
                                  disabled={loading}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDelete(category.id)}
                                  variant="ghost"
                                  size="sm"
                                  disabled={loading}
                                  className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
