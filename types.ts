
export enum UserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED'
}

export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  EXPIRING = 'EXPIRING',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED'
}

export enum SignalType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum SignalStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  licenseKey: string;
  expiry: string;
  lastLogin: string;
}

export interface License {
  key: string;
  user: string;
  issuedAt: string;
  expiresAt: string;
  status: LicenseStatus;
}

export interface TradingSignal {
  id: string;
  pair: string;
  type: SignalType;
  entry: number;
  tp: number;
  sl: number;
  status: SignalStatus;
  timestamp: string;
}

export interface SecurityLog {
  id: string;
  event: string;
  ip: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
}
