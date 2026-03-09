import { makeAutoObservable } from 'mobx';
import { AUTH_CONFIG } from '@/config/constants';

export class AuthStore {
  apiKey = '';

  constructor() {
      makeAutoObservable(this);
      this.apiKey = sessionStorage.getItem(AUTH_CONFIG.STORAGE_KEY) ?? '';
  }

  login(key: string) {
      const trimmed = key.trim();

      if (!trimmed) return;

      this.apiKey = trimmed;
      sessionStorage.setItem(AUTH_CONFIG.STORAGE_KEY, trimmed);
  }

  logout() {
      this.apiKey = '';
      sessionStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
  }

  get isAuthenticated(): boolean {
      return this.apiKey.length > 0;
  }
}

export const authStore = new AuthStore();
