export interface Profile {
  id: string
  pin: string | null
  monthly_budget: number
  updated_at: string
}

export interface Expense {
  id: string
  user_id: string
  amount: number
  category: string
  note: string | null
  created_at: string
}
