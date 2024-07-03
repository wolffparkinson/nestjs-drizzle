import { InjectDrizzle } from '@nestjs-drizzle/core';

export const Drizzle = () => InjectDrizzle();
export const Drizzle2 = () => InjectDrizzle('named_db');
