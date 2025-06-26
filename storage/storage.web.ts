const storage = {
  getItem: (key: string): Promise<string | null> => {
    try {
      return Promise.resolve(window.localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string): Promise<void> => {
    try {
      window.localStorage.setItem(key, value);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
  removeItem: (key: string): Promise<void> => {
    try {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
  clear: (): Promise<void> => {
    try {
        window.localStorage.clear();
        return Promise.resolve();
    } catch {
        return Promise.resolve();
    }
  }
};

export default storage; 