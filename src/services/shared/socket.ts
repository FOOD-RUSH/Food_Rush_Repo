import { io, Socket } from 'socket.io-client';
import TokenManager from '@/src/services/shared/tokenManager';

class SocketService {
  private static _instance: SocketService;
  private socket: Socket | null = null;

  static get instance() {
    if (!this._instance) this._instance = new SocketService();
    return this._instance;
  }

  private getOriginFromApi(): string | null {
    try {
      const api = process.env.EXPO_PUBLIC_API_URL || '';
      if (!api) return null;
      const url = new URL(api);
      // Use origin (protocol + host)
      return `${url.protocol}//${url.host}`;
    } catch {
      return null;
    }
  }

  async connect(force = false) {
    if (this.socket && this.socket.connected && !force) return;

    const origin = this.getOriginFromApi();
    if (!origin) return;

    const token = await TokenManager.getToken();
    const auth: Record<string, string> = {};
    if (token) auth.token = token;

    if (this.socket) {
      try { this.socket.disconnect(); } catch {}
      this.socket = null;
    }

    this.socket = io(origin, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      auth,
    });

    this.socket.on('connect_error', (err) => {
      console.error('[socket] connect_error', err?.message || err);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected() {
    return !!this.socket?.connected;
  }

  on<T = any>(event: string, handler: (data: T) => void) {
    this.socket?.on(event, handler as any);
  }

  off<T = any>(event: string, handler: (data: T) => void) {
    this.socket?.off(event, handler as any);
  }

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  waitFor<T = any>(event: string, predicate: (data: T) => boolean, timeoutMs = 300000): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.socket?.off(event, listener as any);
        reject(new Error('socket timeout'));
      }, timeoutMs);

      const listener = (data: T) => {
        try {
          if (predicate(data)) {
            clearTimeout(timeout);
            this.socket?.off(event, listener as any);
            resolve(data);
          }
        } catch {}
      };

      this.socket?.on(event, listener as any);
    });
  }
}

export const socketService = SocketService.instance;