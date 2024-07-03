import { DEFAULT_PROVIDER, DRIZZLE_PROVIDER_PREFIX } from './drizzle.constants';

export function getDrizzleToken(name?: string) {
  name = name ?? DEFAULT_PROVIDER;
  return `${DRIZZLE_PROVIDER_PREFIX}:${name}`;
}
