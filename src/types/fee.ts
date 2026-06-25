export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'online'

export interface FeeCategory {
  id: string
  name: string
  description?: string
  defaultAmount: number
}

export interface FeeStructure {
  id: string
  categoryId: string
  categoryName: string
  classId?: string
  studentId?: string
  amount: number
  dueDate: string
}

export interface Payment {
  id: string
  studentId: string
  studentName: string
  amount: number
  method: PaymentMethod
  date: string
  notes?: string
  createdAt: string
}

export interface StudentFeeSummary {
  studentId: string
  studentName: string
  rollNumber: string
  className: string
  totalDue: number
  totalPaid: number
  balance: number
  lastPaymentDate?: string
  isOverdue: boolean
}
