import { Inject } from '@nestjs/common';
import { getDrizzleToken } from './utils';

export const InjectDrizzle = (name?: string) => Inject(getDrizzleToken(name));
