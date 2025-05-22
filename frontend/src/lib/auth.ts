import { getAuth } from '@/api/generated/auth/auth';
import type { LoginRequest } from '@/api/generated/model/loginRequest';
import type { SignupRequest } from '@/api/generated/model/signupRequest';
import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect, useRef, useState } from 'react';

// Types for decoded JWT
interface JwtPayload {
  user_id: string;
  email: string;
  exp: number;
}

export interface User {
  user_id: string;
  email: string;
  exp: number;
}

// Helper to read a named cookie
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()!.split(';').shift()!;
    return cookieValue;
  }
  return null;
}

// Helper to set a cookie
function setCookie(name: string, value: string, expiresInMinutes: number = 15) {
  const date = new Date();
  date.setTime(date.getTime() + expiresInMinutes * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

export function useAuth() {
  const { login: apiLogin, signup: apiSignup, logout: apiLogout } = getAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const initialLoadDone = useRef(false);

  // Load user from token in cookie
  useEffect(() => {
    if (initialLoadDone.current) return;
    
    const loadUser = () => {
      const token = getCookie('access_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        setUser({
          user_id: decoded.user_id,
          email: decoded.email,
          exp: decoded.exp,
        });
      } catch (err) {
        setUser(null);
      }
      
      setLoading(false);
    };
    
    loadUser();
    initialLoadDone.current = true;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const creds: LoginRequest = { email, password };
      const response = await apiLogin(creds);
      
      // Manually set cookies from response
      if (response.access_token) {
        setCookie('access_token', response.access_token, 15); // 15 minutes
      }
      
      if (response.refresh_token) {
        setCookie('refresh_token', response.refresh_token, 7 * 24 * 60); // 7 days
      }
      
      // Set user directly from the token
      if (response.access_token) {
        try {
          const decoded = jwtDecode<JwtPayload>(response.access_token);
          setUser({
            user_id: decoded.user_id,
            email: decoded.email,
            exp: decoded.exp,
          });
        } catch (e) {
          setUser(null);
        }
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [apiLogin]);

  const signup = useCallback(async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const creds: SignupRequest = { email, password };
      await apiSignup(creds);
      await login(email, password);
    } catch (err) {
      setLoading(false);
    }
  }, [apiSignup, login]);

  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      await apiLogout();
    } catch (err) {
      console.error('Logout API call failed:', err);
    }
    
    // Clear cookies manually
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    setUser(null);
    setLoading(false);
  }, [apiLogout]);

  return { 
    user, 
    loading, 
    login, 
    signup, 
    logout
  };
}
