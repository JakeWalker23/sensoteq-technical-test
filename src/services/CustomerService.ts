import { db, Executor } from '../db/kysely.js';
import { deleteCustomerGdpr} from '../models/CustomerModel.js'
import { CreateCustomerSchema } from '../validators/Customer.js';
import { HTTPError } from '../utils/Errors.js';

import { StoreModel } from '../models/StoreModel.js';
import { CityModel } from '../models/CityModel.js';
import { AddressModel } from '../models/AddressModel.js';
import { CustomerModel } from '../models/CustomerModel.js';

import { type CreateCustomerPayload } from '../interfaces/db/Customer.js';

export async function removeCustomerGdpr(customerId: number): Promise<boolean> {
  return deleteCustomerGdpr(customerId)
}

export async function createCustomerWithAddress(payload: CreateCustomerPayload, exec: Executor = db) {
  return exec.transaction().execute(async (trx) => {
    const [storeOk, cityOk] = await Promise.all([
      StoreModel.exists(trx, payload.store_id),
      CityModel.exists(trx, payload.city_id),
    ])
    
    if (!storeOk) throw new HTTPError(400, `store_id ${payload.store_id} does not exist`)
    if (!cityOk) throw new HTTPError(400, `city_id ${payload.city_id} does not exist`)

    const address_id = await AddressModel.create(trx, {
      address: payload.address,
      address2: payload.address2,
      district: payload.district,
      city_id: payload.city_id,
      postal_code: payload.postal_code,
      phone: payload.phone,
    })

    const customer = await CustomerModel.create(trx, {
      store_id: payload.store_id,
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      address_id,
    })

    return {
      customer_id: customer.customer_id,
      address_id: customer.address_id,
      store_id: customer.store_id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      activebool: customer.activebool,
      create_date: customer.create_date.toISOString(),
    }
  })
}