import type { Generated } from 'kysely';

export interface Store {
  store_id: Generated<number>;
  manager_staff_id: number; // FK -> staff.staff_id (exists in dvdrental)
  address_id: number;       // FK -> address.address_id
  last_update: Generated<Date>;
}