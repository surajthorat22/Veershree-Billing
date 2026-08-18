import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Storage {
  read<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota or private-mode failures should not break bill entry.
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage access errors.
    }
  }
}
