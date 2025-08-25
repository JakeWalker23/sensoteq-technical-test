export interface Payment {
    payment_id: number
    customer_id: number
    staff_id: number
    rental_id: number | null
    amount: number
    payment_date: Date
  }