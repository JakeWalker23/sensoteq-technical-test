import type { Generated } from 'kysely';

export interface Country {
  country_id: Generated<number>;
  country: string;
  last_update: Generated<Date>;
}