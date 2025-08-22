export interface Film {
    film_id: number
    title: string
    description: string | null
    rental_rate: number
  }
  
  export interface Category {
    category_id: number
    name: string
  }
  
  export interface FilmCategory {
    film_id: number
    category_id: number
  }
  
  export interface Database {
    film: Film
    category: Category
    film_category: FilmCategory
  }
  