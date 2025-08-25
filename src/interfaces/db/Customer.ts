import type { Generated } from 'kysely';

export interface Customer {
  customer_id: Generated<number>;
  store_id: number;      // FK -> store.store_id
  first_name: string;
  last_name: string;
  email: string | null;  // dvdrental allows null
  address_id: number;    // FK -> address.address_id
  activebool: Generated<boolean>;
  create_date: Generated<Date>;
  last_update: Generated<Date>;
  active: number | null; // dvdrental has this legacy int field too
}

export interface CreateCustomerPayload {
  store_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  address2?: string | undefined;
  district: string;
  city_id: number;
  postal_code?: string | undefined;
}

export interface CreatedCustomerDTO {
  customer_id: number;
  address_id: number;
  store_id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  activebool: boolean;
  create_date: string; // ISO
}