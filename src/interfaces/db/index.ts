// Keep your existing imports
import type { Film } from './Film.js';
import type { Category } from './Category.js';
import type { FilmCategory } from './FilmCategory.js';
import type { Customer } from './Customer.js';
import type { Address } from './Address.js';
import type { Rental } from './Rental.js';
import type { Payment } from './Payment.js';
import type { Language } from './Language.js';

// New
import type { Store } from './Store.js';
import type { City } from './City.js';
import type { Country } from './Country.js';

export interface Database {
  film: Film;
  category: Category;
  film_category: FilmCategory;
  customer: Customer;
  address: Address;
  rental: Rental;
  payment: Payment;

  // Added for the POST /customers flow
  store: Store;
  city: City;
  country: Country;

  language: Language;
}