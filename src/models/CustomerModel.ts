import { db, Executor } from '../db/kysely.js'
import 'dotenv/config'


export async function deleteCustomerGdpr(customerId: number): Promise<boolean> {
  const anonRaw = process.env.ANON_CUSTOMER_ID
  const anonId = anonRaw ? Number(anonRaw) : NaN

  if (!Number.isInteger(anonId) || anonId <= 0) {
    throw Object.assign(new Error('ANON_CUSTOMER_ID not set or invalid'), { code: 'CONFIG' })
  }
  if (anonId === customerId) {
    throw Object.assign(new Error('ANON_CUSTOMER_ID must differ from customer_id'), { code: 'CONFIG' })
  }

  return db.transaction().execute(async (trx) => {
    // 1) Load target customer's address_id (and verify target exists)
    const target = await trx
      .selectFrom('customer')
      .select(['address_id'])
      .where('customer_id', '=', customerId)
      .executeTakeFirst()

    if (!target) return false
    const addressId = target.address_id as number

    // 2) Verify anon customer exists (fail fast if not)
    const anon = await trx
      .selectFrom('customer')
      .select(['customer_id'])
      .where('customer_id', '=', anonId)
      .executeTakeFirst()
    if (!anon) {
      throw Object.assign(new Error('ANON_CUSTOMER_ID does not exist'), { code: 'CONFIG' })
    }

    await trx
      .updateTable('rental')
      .set({ customer_id: anonId })
      .where('customer_id', '=', customerId)
      .execute()

    // payments -> anon
    await trx
      .updateTable('payment')
      .set({ customer_id: anonId })
      .where('customer_id', '=', customerId)
      .execute()

    // 4) Delete the customer row
    const delRes = await trx
      .deleteFrom('customer')
      .where('customer_id', '=', customerId)
      .executeTakeFirst()

    const deleted = Number(delRes?.numDeletedRows ?? 0)
    if (!deleted) return false

    try {
      await trx.deleteFrom('address').where('address_id', '=', addressId).execute()
    } catch (err: any) {
      if (err?.code === '23503') {
      } else {
        throw err
      }
    }

    return true
  })
}

export interface CreateCustomerRowInput {
  store_id: number;
  first_name: string;
  last_name: string;
  email: string;     // dvdrental allows null; we’re validating at the edge
  address_id: number;
}

export const CustomerModel = {
  async create(exec: Executor, input: CreateCustomerRowInput) {
    const row = await exec
      .insertInto('customer')
      .values({
        store_id: input.store_id,
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        address_id: input.address_id,
      })
      .returning([
        'customer_id',
        'store_id',
        'first_name',
        'last_name',
        'email',
        'address_id',
        'activebool',
        'create_date',
      ])
      .executeTakeFirstOrThrow();

    return {
      ...row,
      create_date: row.create_date instanceof Date ? row.create_date : new Date(row.create_date as any),
    };
  },
};