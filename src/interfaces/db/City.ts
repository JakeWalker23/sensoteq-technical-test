import type { Generated } from 'kysely';

export interface City {
  city_id: Generated<number>;
  city: string;
  country_id: number;       // FK -> country.country_id
  last_update: Generated<Date>;
}