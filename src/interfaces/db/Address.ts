import type { Generated } from 'kysely';

export interface Address {
  address_id: Generated<number>;
  address: string;
  address2: string | null;
  district: string;
  city_id: number;           // FK -> city.city_id
  postal_code: string | null;
  phone: string | null;
  last_update: Generated<Date>;
}