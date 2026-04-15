export const Role = {
  OWNER: 'OWNER',
  OUTLET_MANAGER: 'OUTLET_MANAGER',
  CASHIER: 'CASHIER'
} as const

export type Role = (typeof Role)[keyof typeof Role]
