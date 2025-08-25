import type { Generated } from 'kysely';

export interface Language {
  language_id: Generated<number>;
  name: string;
  last_update: Generated<Date>;
}