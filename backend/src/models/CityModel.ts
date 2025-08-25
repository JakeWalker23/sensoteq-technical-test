import type { Executor } from '../db/kysely.js';

export const CityModel = {
  async exists(exec: Executor, city_id: number): Promise<boolean> {
    const hit = await exec.selectFrom('city').select('city_id').where('city_id', '=', city_id).executeTakeFirst();
    return !!hit;
  },
};