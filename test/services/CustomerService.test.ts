import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/models/CustomerModel.js', () => ({
  CustomerModel: {
    getWithAddressForUpdate: vi.fn(),
    findTombstoneByStore: vi.fn(),
    createTombstone: vi.fn(),
    delete: vi.fn(),
  },
}))
vi.mock('../../src/models/AddressModel.js', () => ({
  AddressModel: {
    create: vi.fn(),
    deleteIfUnreferenced: vi.fn(),
  },
}))
vi.mock('../../src/models/RentalModel.js', () => ({
  RentalModel: {
    reassignCustomer: vi.fn(),
  },
}))
vi.mock('../../src/models/PaymentModel.js', () => ({
  PaymentModel: {
    reassignCustomer: vi.fn(),
  },
}))

const { CustomerModel } = await import('../../src/models/CustomerModel.js')
const { AddressModel } = await import('../../src/models/AddressModel.js')
const { RentalModel } = await import('../../src/models/RentalModel.js')
const { PaymentModel } = await import('../../src/models/PaymentModel.js')
const { gdprDeleteCustomer } = await import('../../src/services/CustomerService.js')
import { HTTPError } from '../../src/utils/Errors.js'

// A tiny fake executor: trx.execute(cb) calls cb with a mock trx object
function makeExec() {
  const state: { trx?: any } = {}
  const exec: any = {
    transaction() {
      return {
        async execute(cb: (trx: any) => Promise<any>) {
          const trx = { __trx: true }
          state.trx = trx
          return cb(trx)
        },
      }
    },
  }
  return { exec, state }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Customer Service Test Suite', () => {
  it('happy path: creates tombstone, reassigns FKs, deletes customer, deletes address', async () => {
    const { exec, state } = makeExec()

    ;(CustomerModel.getWithAddressForUpdate as any).mockResolvedValue({
      customer_id: 600,
      store_id: 1,
      address_id: 100,
      city_id: 1,
    })
    ;(CustomerModel.findTombstoneByStore as any).mockResolvedValue(undefined)
    ;(AddressModel.create as any).mockResolvedValue(5000) // tombstone address id
    ;(CustomerModel.createTombstone as any).mockResolvedValue({ customer_id: 601 })
    ;(RentalModel.reassignCustomer as any).mockResolvedValue(3)
    ;(PaymentModel.reassignCustomer as any).mockResolvedValue(2)
    ;(CustomerModel.delete as any).mockResolvedValue(undefined)
    ;(AddressModel.deleteIfUnreferenced as any).mockResolvedValue(true)

    const out = await gdprDeleteCustomer(600, exec)

    expect(out).toEqual({
      deleted_customer_id: 600,
      reassigned_to: 601,
      rentals_reassigned: 3,
      payments_reassigned: 2,
      address_deleted: true,
    })

    // all calls happen with the same trx
    const trx = state.trx
    expect(CustomerModel.getWithAddressForUpdate).toHaveBeenCalledWith(trx, 600)
    expect(CustomerModel.findTombstoneByStore).toHaveBeenCalledWith(trx, 1, expect.any(String), expect.any(String))
    expect(AddressModel.create).toHaveBeenCalledWith(trx, expect.objectContaining({ city_id: 1 }))
    expect(CustomerModel.createTombstone).toHaveBeenCalledWith(
      trx,
      expect.objectContaining({ store_id: 1, address_id: 5000 })
    )
    expect(RentalModel.reassignCustomer).toHaveBeenCalledWith(trx, 600, 601)
    expect(PaymentModel.reassignCustomer).toHaveBeenCalledWith(trx, 600, 601)
    expect(CustomerModel.delete).toHaveBeenCalledWith(trx, 600)
    expect(AddressModel.deleteIfUnreferenced).toHaveBeenCalledWith(trx, 100)
  })

  it('reuses existing tombstone (does not create new address/customer)', async () => {
    const { exec, state } = makeExec()

    ;(CustomerModel.getWithAddressForUpdate as any).mockResolvedValue({
      customer_id: 777,
      store_id: 2,
      address_id: 200,
      city_id: 5,
    })
    ;(CustomerModel.findTombstoneByStore as any).mockResolvedValue({ customer_id: 42 })
    ;(RentalModel.reassignCustomer as any).mockResolvedValue(1)
    ;(PaymentModel.reassignCustomer as any).mockResolvedValue(0)
    ;(CustomerModel.delete as any).mockResolvedValue(undefined)
    ;(AddressModel.deleteIfUnreferenced as any).mockResolvedValue(false)

    const out = await gdprDeleteCustomer(777, exec)

    expect(out).toEqual({
      deleted_customer_id: 777,
      reassigned_to: 42,
      rentals_reassigned: 1,
      payments_reassigned: 0,
      address_deleted: false,
    })

    const trx = state.trx
    expect(CustomerModel.findTombstoneByStore).toHaveBeenCalledWith(trx, 2, expect.any(String), expect.any(String))
    expect(AddressModel.create).not.toHaveBeenCalled()
    expect(CustomerModel.createTombstone).not.toHaveBeenCalled()
    expect(RentalModel.reassignCustomer).toHaveBeenCalledWith(trx, 777, 42)
    expect(PaymentModel.reassignCustomer).toHaveBeenCalledWith(trx, 777, 42)
  })

  it('should throw HTTP 404 status when customer not found', async () => {
    const { exec } = makeExec()
    ;(CustomerModel.getWithAddressForUpdate as any).mockResolvedValue(undefined)

    await expect(gdprDeleteCustomer(999, exec)).rejects.toBeInstanceOf(HTTPError)
    await expect(gdprDeleteCustomer(999, exec)).rejects.toMatchObject({ status: 404 })
  })
})
