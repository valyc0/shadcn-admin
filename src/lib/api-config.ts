/**
 * Configurazione centralizzata per l'API
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Ottiene il token di autenticazione dal sessionStorage
 */
export const getAuthToken = (): string | null => {
  return sessionStorage.getItem("token");
};

/**
 * Gestisce la risposta dall'API in modo centralizzato
 */
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Qualcosa è andato storto");
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
  return {};
};

/**
 * Crea gli headers di default per le richieste API
 */
export const createApiHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Wrapper per fetch con configurazione di base
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true
): Promise<any> => {
  // Se API_BASE_URL è vuoto, usa percorsi relativi (endpoint già contiene /api)
  const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...createApiHeaders(includeAuth),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  return handleApiResponse(response);
};
