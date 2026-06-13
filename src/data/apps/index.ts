import type { AppConfig } from '../types';
import { vaultcdnConfig } from './vaultcdn/config';

export const apps: Record<string, AppConfig> = {
  vaultcdn: vaultcdnConfig,
};

export const defaultAppSlug = 'vaultcdn';

export function getApp(slug: string): AppConfig | undefined {
  return apps[slug];
}

export function getAppSlugs(): string[] {
  return Object.keys(apps);
}

export function isValidApp(slug: string): boolean {
  return slug in apps;
}
