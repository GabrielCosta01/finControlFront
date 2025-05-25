import axios from 'axios';

// Usar a variável de ambiente ou fallback para localhost em desenvolvimento
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fincontrolback-n4bs.onrender.com';

// Log para depuração da URL base
console.log('API_BASE_URL:', API_BASE_URL);

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Adicionar timeout de 10 segundos para evitar longas esperas
  timeout: 10000,
});

/**
 * Função para processar dados antes de enviar para o servidor
 * - Converte strings vazias em campos de data para null
 * - Processa recursivamente objetos aninhados
 */
const processRequestData = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  // Se for um array, processa cada item
  if (Array.isArray(data)) {
    return data.map(item => processRequestData(item));
  }
  
  // Cria uma cópia do objeto para não modificar o original
  const processedData = { ...data };
  
  // Lista de campos que são datas
  const dateFields = ['due_date', 'paid_date', 'received_date', 'created_date', 'updated_date'];
  
  // Processa cada campo do objeto
  Object.keys(processedData).forEach(key => {
    const value = processedData[key];
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      processedData[key] = processRequestData(value);
    } 
    else if (Array.isArray(value)) {
      processedData[key] = value.map(item => processRequestData(item));
    }
    else if (value === '' && dateFields.includes(key)) {
      processedData[key] = null;
    }
  });
  
  return processedData;
};

axiosClient.interceptors.request.use(
  (config) => {
    // Log para depuração de requisições
    console.log('Request URL:', `${config.baseURL}${config.url}`);
    
    // Não adicionar token para rotas públicas ou rotas de autenticação
    if (!config.url.includes('/public/') && 
        !config.url.includes('/auth/reset-password')) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Processa os dados antes de enviar para o servidor
    if (config.data) {
      config.data = processRequestData(config.data);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Tratamento específico para erro de timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout error: A requisição demorou muito para responder');
      error.message = 'A conexão com o servidor demorou muito. Tente novamente mais tarde.';
    }
    
    if (error.response?.status === 401) {
      // Verifica se não é uma rota pública ou de autenticação
      if (!error.config?.url?.includes('/public/') && 
          !error.config?.url?.includes('/auth/reset-password')) {
        localStorage.removeItem('authToken');
        
        const currentPath = window.location.pathname;
        // Não redirecionar para login se já estiver em uma tela de autenticação
        if (currentPath !== '/' && 
            !currentPath.startsWith('/register') && 
            !currentPath.startsWith('/reset-password')) {
          localStorage.setItem('redirectAfterLogin', currentPath);
          window.location.href = '/';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient; 