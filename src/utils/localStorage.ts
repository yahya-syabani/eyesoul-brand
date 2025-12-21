export type StorageResult<T> =
  | { ok: true; value: T }
  | { ok: false; value: null; error: unknown };

const isBrowser = () => typeof window !== 'undefined';

export const safeStorageGet = (key: string): StorageResult<string> => {
  try {
    if (!isBrowser()) return { ok: false, value: null, error: new Error('Not in browser') };
    const value = window.localStorage.getItem(key);
    if (value === null) return { ok: false, value: null, error: null };
    return { ok: true, value };
  } catch (error) {
    return { ok: false, value: null, error };
  }
};

export const safeStorageSet = (key: string, value: string): StorageResult<true> => {
  try {
    if (!isBrowser()) return { ok: false, value: null, error: new Error('Not in browser') };
    window.localStorage.setItem(key, value);
    return { ok: true, value: true };
  } catch (error) {
    return { ok: false, value: null, error };
  }
};

export const safeStorageRemove = (key: string): StorageResult<true> => {
  try {
    if (!isBrowser()) return { ok: false, value: null, error: new Error('Not in browser') };
    window.localStorage.removeItem(key);
    return { ok: true, value: true };
  } catch (error) {
    return { ok: false, value: null, error };
  }
};

export const safeJsonParse = <T>(raw: string): StorageResult<T> => {
  try {
    return { ok: true, value: JSON.parse(raw) as T };
  } catch (error) {
    return { ok: false, value: null, error };
  }
};

export const safeJsonStringify = (value: unknown): StorageResult<string> => {
  try {
    return { ok: true, value: JSON.stringify(value) };
  } catch (error) {
    return { ok: false, value: null, error };
  }
};


