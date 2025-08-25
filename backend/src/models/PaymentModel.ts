import type { Executor } from '../db/kysely.js'

export const PaymentModel = {
  async reassignCustomer(exec: Executor, fromCustomerId: number, toCustomerId: number): Promise<number> {
    const result = await exec
      .updateTable('payment')
      .set({ customer_id: toCustomerId })
      .where('customer_id', '=', fromCustomerId)
      .executeTakeFirst()
    const n = (result as any).numUpdatedRows ?? 0n
    return Number(n)
  },
}