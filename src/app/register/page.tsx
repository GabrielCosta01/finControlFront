'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearUserError } from '@/features/userSlice';
import { AppDispatch, RootState } from '@/store';
import Link from 'next/link';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  salary: number;
}

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Formato de email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter ao menos 6 caracteres').required('Senha é obrigatória'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'As senhas devem coincidir')
    .required('Confirmação de senha é obrigatória'),
  salary: yup.number().min(0, 'Salário não pode ser negativo').required('Salário é obrigatório'),
}).required();

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.users);

  // Limpar erros ao montar ou desmontar o componente
  useEffect(() => {
    dispatch(clearUserError());
    return () => {
      dispatch(clearUserError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // Mostrar o erro detalhado
      console.log('Erro detalhado de registro:', error);
      toast.error(`Erro: ${error}`);
    }
  }, [error]);

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      console.log('Enviando dados de registro:', {...data});
      
      const { confirmPassword, ...userData } = data;
      
      const resultAction = await dispatch(registerUser(userData));
      
      if (registerUser.fulfilled.match(resultAction)) {
        toast.success('Cadastro realizado com sucesso!');
        console.log('Registro bem-sucedido:', resultAction.payload);
        // Redirecionar para login após um breve delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else if (registerUser.rejected.match(resultAction)) {
        // Log adicional para depuração
        console.error('Detalhes do erro no registro:', resultAction.payload);
      }
      // Erro principal já é tratado pelo useEffect que observa o estado error
    } catch (error: any) {
      console.error('Erro inesperado no cadastro:', error);
      toast.error('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center mb-6">Crie sua Conta</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nome Completo</label>
              <input
                type="text"
                id="name"
                {...register('name')}
                placeholder="Seu nome completo"
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                {...register('email')}
                placeholder="seu.email@exemplo.com"
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium mb-1">Senha</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password')}
                placeholder="••••••••"
                className={`w-full border rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
              />
              <span
                className="absolute right-3 top-8 transform cursor-pointer"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>
            
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirmar Senha</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className={`w-full border rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              <span
                className="absolute right-3 top-8 transform cursor-pointer"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            
            <div>
              <label htmlFor="salary" className="block text-sm font-medium mb-1">Salário Mensal</label>
              <input
                type="number"
                id="salary"
                step="0.01"
                {...register('salary')}
                placeholder="0.00"
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.salary ? 'border-red-500' : ''}`}
              />
              {errors.salary && <p className="text-red-600 text-sm mt-1">{errors.salary.message}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Já tem conta?{' '}
            <Link href="/" className="text-blue-600 hover:underline">Faça login</Link>
          </p>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </>
  );
};

export default RegisterPage; 