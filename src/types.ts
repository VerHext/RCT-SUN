export interface ConfigItem {
  address: string;
  description: string;
  request?: boolean;
  round?: boolean;
  precision?: number;
  floatOptions?: string;
}

export interface ClientConfig {
  host: string;
  port: number;
}
