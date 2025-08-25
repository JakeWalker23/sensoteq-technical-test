import type { Executor } from '../db/kysely.js';

export const StoreModel = {
  async exists(exec: Executor, store_id: number): Promise<boolean> {
    const hit = await exec.selectFrom('store').select('store_id').where('store_id', '=', store_id).executeTakeFirst();
    return !!hit;
  },
};