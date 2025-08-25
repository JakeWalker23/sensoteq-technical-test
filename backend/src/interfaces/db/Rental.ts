export interface Rental {
    rental_id: number
    rental_date: Date
    inventory_id: number
    customer_id: number
    return_date: Date | null
    staff_id: number
    last_update: Date
  }