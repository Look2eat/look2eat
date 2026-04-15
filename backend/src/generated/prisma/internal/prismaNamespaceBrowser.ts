import * as runtime from "@prisma/client/runtime/index-browser"

export type * from '../models'
export type * from './prismaNamespace'

export const Decimal = runtime.Decimal

export const NullTypes = {
  DbNull: runtime.NullTypes.DbNull as (new (secret: never) => typeof runtime.DbNull),
  JsonNull: runtime.NullTypes.JsonNull as (new (secret: never) => typeof runtime.JsonNull),
  AnyNull: runtime.NullTypes.AnyNull as (new (secret: never) => typeof runtime.AnyNull),
}

export const DbNull = runtime.DbNull

export const JsonNull = runtime.JsonNull

export const AnyNull = runtime.AnyNull

export const ModelName = {
  Brand: 'Brand',
  AdminUser: 'AdminUser',
  Outlet: 'Outlet'
} as const

export type ModelName = (typeof ModelName)[keyof typeof ModelName]

export const TransactionIsolationLevel = runtime.makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
} as const)

export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]

export const BrandScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  email: 'email',
  phoneNumber: 'phoneNumber',
  logoUrl: 'logoUrl',
  primaryColor: 'primaryColor',
  bannerImageUrl: 'bannerImageUrl',
  description: 'description',
  termsText: 'termsText',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
} as const

export type BrandScalarFieldEnum = (typeof BrandScalarFieldEnum)[keyof typeof BrandScalarFieldEnum]

export const AdminUserScalarFieldEnum = {
  id: 'id',
  brandId: 'brandId',
  name: 'name',
  email: 'email',
  phoneNumber: 'phoneNumber',
  passwordHash: 'passwordHash',
  role: 'role',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
} as const

export type AdminUserScalarFieldEnum = (typeof AdminUserScalarFieldEnum)[keyof typeof AdminUserScalarFieldEnum]

export const OutletScalarFieldEnum = {
  id: 'id',
  brandId: 'brandId',
  name: 'name',
  address: 'address',
  phoneNumber: 'phoneNumber',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
} as const

export type OutletScalarFieldEnum = (typeof OutletScalarFieldEnum)[keyof typeof OutletScalarFieldEnum]

export const SortOrder = {
  asc: 'asc',
  desc: 'desc'
} as const

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]

export const QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
} as const

export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]

export const NullsOrder = {
  first: 'first',
  last: 'last'
} as const

export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]

