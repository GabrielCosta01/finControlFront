import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getCurrentUser, logout } from '@/api/auth';
import { setCurrentUser } from '@/features/userSlice';
import { clearToken } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const { currentUser } = useSelector((state: RootState) => state.users);

  // Carregar dados do usuário quando autenticado
  useEffect(() => {
    let isMounted = true;
    
    const loadUserProfile = async () => {
      if (auth.isAuthenticated && !currentUser) {
        try {
          console.log('useAuth: Carregando perfil do usuário...');
          const userData = await getCurrentUser();
          
          if (isMounted) {
            console.log('useAuth: Perfil carregado:', userData);
            dispatch(setCurrentUser(userData));
          }
        } catch (error: any) {
          console.error('useAuth: Erro ao carregar perfil:', error);
          // Se a resposta for 401 (não autorizado), faz logout
          if (error.response?.status === 401) {
            handleLogout();
          }
        }
      }
    };
    
    loadUserProfile();
    
    return () => {
      isMounted = false;
    };
  }, [auth.isAuthenticated, currentUser, dispatch]);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearToken());
      dispatch(setCurrentUser(null));
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    isAuthenticated: auth.isAuthenticated,
    currentUser,
    logout: handleLogout
  };
} 