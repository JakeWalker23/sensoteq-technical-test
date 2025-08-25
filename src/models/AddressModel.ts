import type { Executor } from '../db/kysely.js';

export interface CreateAddressInput {
  address: string;
  address2?: string | null | undefined;
  district: string;
  city_id: number;
  postal_code?: string | null | undefined;
  phone?: string | null | undefined;
}

export const AddressModel = {
  async create(exec: Executor, input: CreateAddressInput): Promise<number> {
    const row = await exec
      .insertInto('address')
      .values({
        address: input.address,
        address2: input.address2 ?? null,
        district: input.district,
        city_id: input.city_id,
        postal_code: input.postal_code ?? null,
        phone: input.phone,
      })
      .returning(['address_id'])
      .executeTakeFirstOrThrow();
    return row.address_id;
  },
  
  async deleteIfUnreferenced(exec: Executor, address_id: number): Promise<boolean> {
    // Is any customer still pointing at this address?
    const anyCustomer = await exec
      .selectFrom('customer')
      .select(['customer_id'])
      .where('address_id', '=', address_id)
      .limit(1)
      .executeTakeFirst()
    if (anyCustomer) return false

    await exec.deleteFrom('address').where('address_id', '=', address_id).executeTakeFirst()
    return true
  },
};
