import axios, { 
  AxiosInstance, 
  InternalAxiosRequestConfig,
  AxiosResponse, 
  AxiosError 
} from 'axios';

// Usar a variável de ambiente ou fallback para localhost em desenvolvimento
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fincontrolback-n4bs.onrender.com';

// Garantir que a URL tenha o protocolo correto
const getBaseURL = () => {
  if (API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')) {
    return API_BASE_URL;
  }
  return `https://${API_BASE_URL}`;
};

// Log para depuração da URL base
console.log('API_BASE_URL:', getBaseURL());

const axiosClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
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
const processRequestData = (data: any): any => {
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
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Construir a URL completa manualmente
    const baseURL = getBaseURL();
    const url = config.url || '';
    
    // Se a URL não começar com http, adicionar a baseURL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      config.url = `${baseURL}${url}`;
    }
    
    // Log para depuração de requisições
    console.log('Request URL:', config.url);
    console.log('Base URL:', baseURL);
    console.log('URL Path:', url);
    
    // Não adicionar token para rotas públicas ou rotas de autenticação
    if (!config.url?.includes('/auth/login') && 
        !config.url?.includes('/auth/register') && 
        !config.url?.includes('/auth/reset-password')) {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Adiciona o prefixo Bearer ao token apenas se ele ainda não tiver
        const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        config.headers.set('Authorization', bearerToken);
        console.log('Token enviado:', bearerToken); // Log para debug
      }
    }
    
    // Processa os dados antes de enviar para o servidor
    if (config.data) {
      config.data = processRequestData(config.data);
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);
    
    // Tratamento específico para erro de timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout error: A requisição demorou muito para responder');
      error.message = 'A conexão com o servidor demorou muito. Tente novamente mais tarde.';
    }
    
    if (error.response?.status === 401) {
      // Verifica se não é uma rota pública ou de autenticação
      if (!error.config?.url?.includes('/auth/login') && 
          !error.config?.url?.includes('/auth/register') && 
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