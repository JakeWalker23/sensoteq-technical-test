import type { Executor } from '../db/kysely.js'


export const RentalModel = {
    async reassignCustomer(exec: Executor, fromCustomerId: number, toCustomerId: number): Promise<number> {
      const result = await exec
        .updateTable('rental')
        .set({ customer_id: toCustomerId })
        .where('customer_id', '=', fromCustomerId)
        .executeTakeFirst()
      // Kysely returns { numUpdatedRows?: bigint }, normalize to number
      const n = (result as any).numUpdatedRows ?? 0n
      return Number(n)
    },
  }