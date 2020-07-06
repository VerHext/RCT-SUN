export interface ConfigItem {
  address: string;
  description: string;
  request?: boolean;
  round?: boolean;
  precision?: number;
  floatOptions?: string;
  dbFloat?: boolean;
}

export interface ClientConfig {
  host: string;
  port: number;
  refresh: number;
}

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}
