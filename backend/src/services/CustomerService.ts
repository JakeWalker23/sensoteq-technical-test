import { db, Executor } from '../db/kysely.js';
import { deleteCustomerGdpr} from '../models/CustomerModel.js'
import { CreateCustomerSchema } from '../validators/Customer.js';
import { HTTPError } from '../utils/Errors.js';

import { StoreModel } from '../models/StoreModel.js';
import { CityModel } from '../models/CityModel.js';
import { AddressModel } from '../models/AddressModel.js';
import { CustomerModel } from '../models/CustomerModel.js';
import { RentalModel } from '../models/RentalModel.js';
import { PaymentModel } from '../models/PaymentModel.js';

import { type CreateCustomerPayload } from '../interfaces/db/Customer.js';

const GDPR_FIRST = 'GDPR'
const GDPR_LAST  = 'Deleted'
const GDPR_PHONE = '000000'
const GDPR_ADDR  = 'REDACTED'
const GDPR_DIST  = 'REDACTED'

export async function gdprDeleteCustomer(customer_id: number, exec: Executor = db) {
  return exec.transaction().execute(async (trx) => {
    // 1) Load target (and lock it)
    const target = await CustomerModel.getWithAddressForUpdate(trx, customer_id)
    if (!target) throw new HTTPError(404, `customer_id ${customer_id} not found`)

    // 2) Get or create tombstone for this store (reuse if exists)
    let tombstone = await CustomerModel.findTombstoneByStore(trx, target.store_id, GDPR_FIRST, GDPR_LAST)
    if (!tombstone) {
      const tombstoneAddressId = await AddressModel.create(trx, {
        address: GDPR_ADDR,
        address2: '',
        district: GDPR_DIST,
        city_id: target.city_id,      // keep same city for integrity
        postal_code: null,
        phone: GDPR_PHONE,            // NOT NULL in dvdrental
      })
      const created = await CustomerModel.createTombstone(trx, {
        store_id: target.store_id,
        first_name: GDPR_FIRST,
        last_name: GDPR_LAST,
        address_id: tombstoneAddressId,
      })
      tombstone = { customer_id: created.customer_id }
    }

    // 3) Reassign FKs (rentals, payments) to tombstone
    const rentalsReassigned  = await RentalModel.reassignCustomer(trx, customer_id, tombstone.customer_id)
    const paymentsReassigned = await PaymentModel.reassignCustomer(trx, customer_id, tombstone.customer_id)

    // 4) Delete real customer
    await CustomerModel.delete(trx, customer_id)

    // 5) Delete original address if no longer referenced
    const addressDeleted = await AddressModel.deleteIfUnreferenced(trx, target.address_id)

    return {
      deleted_customer_id: customer_id,
      reassigned_to: tombstone.customer_id,
      rentals_reassigned: rentalsReassigned,
      payments_reassigned: paymentsReassigned,
      address_deleted: addressDeleted,
    }
  })
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