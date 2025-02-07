interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

interface SignupData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    state: string;
    medicalSpecialty: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class AuthService {
    private static instance: AuthService;
    private token: string | null = null;

    private constructor() {
        this.token = localStorage.getItem('token');
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
        const url = `${API_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'An error occurred');
            }

            return data;
        } catch (error) {
            throw error instanceof Error ? error : new Error('Network error');
        }
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const data = await this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (credentials.rememberMe) {
            localStorage.setItem('token', data.token);
        } else {
            sessionStorage.setItem('token', data.token);
        }

        this.token = data.token;
        return data;
    }

    async signup(userData: SignupData): Promise<AuthResponse> {
        const data = await this.request<AuthResponse>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        localStorage.setItem('token', data.token);
        this.token = data.token;
        return data;
    }

    async resetPassword(email: string): Promise<{ message: string }> {
        return this.request<{ message: string }>('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async logout(): Promise<void> {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        this.token = null;
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    getToken(): string | null {
        return this.token;
    }
}

export const authService = AuthService.getInstance();