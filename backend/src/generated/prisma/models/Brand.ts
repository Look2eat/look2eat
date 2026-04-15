import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"

export type BrandModel = runtime.Types.Result.DefaultSelection<Prisma.$BrandPayload>

export type AggregateBrand = {
  _count: BrandCountAggregateOutputType | null
  _min: BrandMinAggregateOutputType | null
  _max: BrandMaxAggregateOutputType | null
}

export type BrandMinAggregateOutputType = {
  id: string | null
  name: string | null
  slug: string | null
  email: string | null
  phoneNumber: string | null
  logoUrl: string | null
  primaryColor: string | null
  bannerImageUrl: string | null
  description: string | null
  termsText: string | null
  isActive: boolean | null
  createdAt: Date | null
  updatedAt: Date | null
}

export type BrandMaxAggregateOutputType = {
  id: string | null
  name: string | null
  slug: string | null
  email: string | null
  phoneNumber: string | null
  logoUrl: string | null
  primaryColor: string | null
  bannerImageUrl: string | null
  description: string | null
  termsText: string | null
  isActive: boolean | null
  createdAt: Date | null
  updatedAt: Date | null
}

export type BrandCountAggregateOutputType = {
  id: number
  name: number
  slug: number
  email: number
  phoneNumber: number
  logoUrl: number
  primaryColor: number
  bannerImageUrl: number
  description: number
  termsText: number
  isActive: number
  createdAt: number
  updatedAt: number
  _all: number
}

export type BrandMinAggregateInputType = {
  id?: true
  name?: true
  slug?: true
  email?: true
  phoneNumber?: true
  logoUrl?: true
  primaryColor?: true
  bannerImageUrl?: true
  description?: true
  termsText?: true
  isActive?: true
  createdAt?: true
  updatedAt?: true
}

export type BrandMaxAggregateInputType = {
  id?: true
  name?: true
  slug?: true
  email?: true
  phoneNumber?: true
  logoUrl?: true
  primaryColor?: true
  bannerImageUrl?: true
  description?: true
  termsText?: true
  isActive?: true
  createdAt?: true
  updatedAt?: true
}

export type BrandCountAggregateInputType = {
  id?: true
  name?: true
  slug?: true
  email?: true
  phoneNumber?: true
  logoUrl?: true
  primaryColor?: true
  bannerImageUrl?: true
  description?: true
  termsText?: true
  isActive?: true
  createdAt?: true
  updatedAt?: true
  _all?: true
}

export type BrandAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  where?: Prisma.BrandWhereInput

  orderBy?: Prisma.BrandOrderByWithRelationInput | Prisma.BrandOrderByWithRelationInput[]

  cursor?: Prisma.BrandWhereUniqueInput

  take?: number

  skip?: number

  _count?: true | BrandCountAggregateInputType

  _min?: BrandMinAggregateInputType

  _max?: BrandMaxAggregateInputType
}

export type GetBrandAggregateType<T extends BrandAggregateArgs> = {
      [P in keyof T & keyof AggregateBrand]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateBrand[P]>
    : Prisma.GetScalarType<T[P], AggregateBrand[P]>
}

export type BrandGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.BrandWhereInput
  orderBy?: Prisma.BrandOrderByWithAggregationInput | Prisma.BrandOrderByWithAggregationInput[]
  by: Prisma.BrandScalarFieldEnum[] | Prisma.BrandScalarFieldEnum
  having?: Prisma.BrandScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: BrandCountAggregateInputType | true
  _min?: BrandMinAggregateInputType
  _max?: BrandMaxAggregateInputType
}

export type BrandGroupByOutputType = {
  id: string
  name: string
  slug: string
  email: string
  phoneNumber: string
  logoUrl: string | null
  primaryColor: string | null
  bannerImageUrl: string | null
  description: string | null
  termsText: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count: BrandCountAggregateOutputType | null
  _min: BrandMinAggregateOutputType | null
  _max: BrandMaxAggregateOutputType | null
}

type GetBrandGroupByPayload<T extends BrandGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<BrandGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof BrandGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], BrandGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], BrandGroupByOutputType[P]>
      }
    >
  >

export type BrandWhereInput = {
  AND?: Prisma.BrandWhereInput | Prisma.BrandWhereInput[]
  OR?: Prisma.BrandWhereInput[]
  NOT?: Prisma.BrandWhereInput | Prisma.BrandWhereInput[]
  id?: Prisma.StringFilter<"Brand"> | string
  name?: Prisma.StringFilter<"Brand"> | string
  slug?: Prisma.StringFilter<"Brand"> | string
  email?: Prisma.StringFilter<"Brand"> | string
  phoneNumber?: Prisma.StringFilter<"Brand"> | string
  logoUrl?: Prisma.StringNullableFilter<"Brand"> | string | null
  primaryColor?: Prisma.StringNullableFilter<"Brand"> | string | null
  bannerImageUrl?: Prisma.StringNullableFilter<"Brand"> | string | null
  description?: Prisma.StringNullableFilter<"Brand"> | string | null
  termsText?: Prisma.StringNullableFilter<"Brand"> | string | null
  isActive?: Prisma.BoolFilter<"Brand"> | boolean
  createdAt?: Prisma.DateTimeFilter<"Brand"> | Date | string
  updatedAt?: Prisma.DateTimeFilter<"Brand"> | Date | string
  users?: Prisma.AdminUserListRelationFilter
  outlets?: Prisma.OutletListRelationFilter
}

export type BrandOrderByWithRelationInput = {
  id?: Prisma.SortOrder
  name?: Prisma.SortOrder
  slug?: Prisma.SortOrder
  email?: Prisma.SortOrder
  phoneNumber?: Prisma.SortOrder
  logoUrl?: Prisma.SortOrderInput | Prisma.SortOrder
  primaryColor?: Prisma.SortOrderInput | Prisma.SortOrder
  bannerImageUrl?: Prisma.SortOrderInput | Prisma.SortOrder
  description?: Prisma.SortOrderInput | Prisma.SortOrder
  termsText?: Prisma.SortOrderInput | Prisma.SortOrder
  isActive?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
  users?: Prisma.AdminUserOrderByRelationAggregateInput
  outlets?: Prisma.OutletOrderByRelationAggregateInput
}

export type BrandWhereUniqueInput = Prisma.AtLeast<{
  id?: string
  slug?: string
  AND?: Prisma.BrandWhereInput | Prisma.BrandWhereInput[]
  OR?: Prisma.BrandWhereInput[]
  NOT?: Prisma.BrandWhereInput | Prisma.BrandWhereInput[]
  name?: Prisma.StringFilter<"Brand"> | string
  email?: Prisma.StringFilter<"Brand"> | string
  phoneNumber?: Prisma.StringFilter<"Brand"> | string
  logoUrl?: Prisma.StringNullableFilter<"Brand"> | string | null
  primaryColor?: Prisma.StringNullableFilter<"Brand"> | string | null
  bannerImageUrl?: Prisma.StringNullableFilter<"Brand"> | string | null
  description?: Prisma.StringNullableFilter<"Brand"> | string | null
  termsText?: Prisma.StringNullableFilter<"Brand"> | string | null
  isActive?: Prisma.BoolFilter<"Brand"> | boolean
  createdAt?: Prisma.DateTimeFilter<"Brand"> | Date | string
  updatedAt?: Prisma.DateTimeFilter<"Brand"> | Date | string
  users?: Prisma.AdminUserListRelationFilter
  outlets?: Prisma.OutletListRelationFilter
}, "id" | "slug">

export type BrandOrderByWithAggregationInput = {
  id?: Prisma.SortOrder
  name?: Prisma.SortOrder
  slug?: Prisma.SortOrder
  email?: Prisma.SortOrder
  phoneNumber?: Prisma.SortOrder
  logoUrl?: Prisma.SortOrderInput | Prisma.SortOrder
  primaryColor?: Prisma.SortOrderInput | Prisma.SortOrder
  bannerImageUrl?: Prisma.SortOrderInput | Prisma.SortOrder
  description?: Prisma.SortOrderInput | Prisma.SortOrder
  termsText?: Prisma.SortOrderInput | Prisma.SortOrder
  isActive?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
  _count?: Prisma.BrandCountOrderByAggregateInput
  _max?: Prisma.BrandMaxOrderByAggregateInput
  _min?: Prisma.BrandMinOrderByAggregateInput
}

export type BrandScalarWhereWithAggregatesInput = {
  AND?: Prisma.BrandScalarWhereWithAggregatesInput | Prisma.BrandScalarWhereWithAggregatesInput[]
  OR?: Prisma.BrandScalarWhereWithAggregatesInput[]
  NOT?: Prisma.BrandScalarWhereWithAggregatesInput | Prisma.BrandScalarWhereWithAggregatesInput[]
  id?: Prisma.StringWithAggregatesFilter<"Brand"> | string
  name?: Prisma.StringWithAggregatesFilter<"Brand"> | string
  slug?: Prisma.StringWithAggregatesFilter<"Brand"> | string
  email?: Prisma.StringWithAggregatesFilter<"Brand"> | string
  phoneNumber?: Prisma.StringWithAggregatesFilter<"Brand"> | string
  logoUrl?: Prisma.StringNullableWithAggregatesFilter<"Brand"> | string | null
  primaryColor?: Prisma.StringNullableWithAggregatesFilter<"Brand"> | string | null
  bannerImageUrl?: Prisma.StringNullableWithAggregatesFilter<"Brand"> | string | null
  description?: Prisma.StringNullableWithAggregatesFilter<"Brand"> | string | null
  termsText?: Prisma.StringNullableWithAggregatesFilter<"Brand"> | string | null
  isActive?: Prisma.BoolWithAggregatesFilter<"Brand"> | boolean
  createdAt?: Prisma.DateTimeWithAggregatesFilter<"Brand"> | Date | string
  updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Brand"> | Date | string
}

export type BrandCreateInput = {
  id?: string
  name: string
  slug: string
  email: string
  phoneNumber: string
  logoUrl?: string | null
  primaryColor?: string | null
  bannerImageUrl?: string | null
  description?: string | null
  termsText?: string | null
  isActive?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
  users?: Prisma.AdminUserCreateNestedManyWithoutBrandInput
  outlets?: Prisma.OutletCreateNestedManyWithoutBrandInput
}

export type BrandUncheckedCreateInput = {
  id?: string
  name: string
  slug: string
  email: string
  phoneNumber: string
  logoUrl?: string | null
  primaryColor?: string | null
  bannerImageUrl?: string | null
  description?: string | null
  termsText?: string | null
  isActive?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
  users?: Prisma.AdminUserUncheckedCreateNestedManyWithoutBrandInput
  outlets?: Prisma.OutletUncheckedCreateNestedManyWithoutBrandInput
}

export type BrandUpdateInput = {
  id?: Prisma.StringFieldUpdateOperationsInput | string
  name?: Prisma.StringFieldUpdateOperationsInput | string
  slug?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  phoneNumber?: Prisma.StringFieldUpdateOperationsInput | string
  logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  primaryColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  bannerImageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  termsText?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  users?: Prisma.AdminUserUpdateManyWithoutBrandNestedInput
  outlets?: Prisma.OutletUpdateManyWithoutBrandNestedInput
}

export type BrandUncheckedUpdateInput = {
  id?: Prisma.StringFieldUpdateOperationsInput | string
  name?: Prisma.StringFieldUpdateOperationsInput | string
  slug?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  phoneNumber?: Prisma.StringFieldUpdateOperationsInput | string
  logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  primaryColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  bannerImageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  termsText?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  users?: Prisma.AdminUserUncheckedUpdateManyWithoutBrandNestedInput
  outlets?: Prisma.OutletUncheckedUpdateManyWithoutBrandNestedInput
}

export type BrandCreateManyInput = {
  id?: string
  name: string
  slug: string
  email: string
  phoneNumber: string
  logoUrl?: string | null
  primaryColor?: string | null
  bannerImageUrl?: string | null
  description?: string | null
  termsText?: string | null
  isActive?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type BrandUpdateManyMutationInput = {
  id?: Prisma.StringFieldUpdateOperationsInput | string
  name?: Prisma.StringFieldUpdateOperationsInput | string
  slug?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  phoneNumber?: Prisma.StringFieldUpdateOperationsInput | string
  logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  primaryColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  bannerImageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  termsText?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type BrandUncheckedUpdateManyInput = {
  id?: Prisma.StringFieldUpdateOperationsInput | string
  name?: Prisma.StringFieldUpdateOperationsInput | string
  slug?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  phoneNumber?: Prisma.StringFieldUpdateOperationsInput | string
  logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  primaryColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  bannerImageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  termsText?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type BrandCountOrderByAggregateInput = {
  id?: Prisma.SortOrder
  name?: Prisma.SortOrder
  slug?: Prisma.SortOrder
  email?: Prisma.SortOrder
  phoneNumber?: Prisma.SortOrder
  logoUrl?: Prisma.SortOrder
  primaryColor?: Prisma.SortOrder
  bannerImageUrl?: Prisma.SortOrder
  description?: Prisma.SortOrder
  termsText?: Prisma.SortOrder
  isActive?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
}

export type BrandMaxOrderByAggregateInput = {
  id?: Prisma.SortOrder
  name?: Prisma.SortOrder
  slug?: Prisma.SortOrder
  email?: Prisma.SortOrder
  phoneNumber?: Prisma.SortOrder
  logoUrl?: Prisma.SortOrder
  primaryColor?: Prisma.SortOrder
  bannerImageUrl?: Prisma.SortOrder
  description?: Prisma.SortOrder
  termsText?: Prisma.SortOrder
  isActive?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
}

export type BrandMinOrderByAggregateInput = {
  id?: Prisma.SortOrder
  name?: Prisma.SortOrder
  slug?: Prisma.SortOrder
  email?: Prisma.SortOrder
  phoneNumber?: Prisma.SortOrder
  logoUrl?: Prisma.SortOrder
  primaryColor?: Prisma.SortOrder
  bannerImageUrl?: Prisma.SortOrder
  description?: Prisma.SortOrder
  termsText?: Prisma.SortOrder
  isActive?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
}

export type BrandScalarRelationFilter = {
  is?: Prisma.BrandWhereInput
  isNot?: Prisma.BrandWhereInput
}

export type StringFieldUpdateOperationsInput = {
  set?: string
}

export type NullableStringFieldUpdateOperationsInput = {
  set?: string | null
}

export type BoolFieldUpdateOperationsInput = {
  set?: boolean
}

export type DateTimeFieldUpdateOperationsInput = {
  set?: Date | string
}

export type BrandCreateNestedOneWithoutUsersInput = {
  create?: Prisma.XOR<Prisma.BrandCreateWithoutUsersInput, Prisma.BrandUncheckedCreateWithoutUsersInput>
  connectOrCreate?: Prisma.BrandCreateOrConnectWithoutUsersInput
  connect?: Prisma.BrandWhereUniqueInput
}

export type BrandUpdateOneRequiredWithoutUsersNestedInput = {
  create?: Prisma.XOR<Prisma.BrandCreateWithoutUsersInput, Prisma.BrandUncheckedCreateWithoutUsersInput>
  connectOrCreate?: Prisma.BrandCreateOrConnectWithoutUsersInput
  upsert?: Prisma.BrandUpsertWithoutUsersInput
  connect?: Prisma.BrandWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.BrandUpdateToOneWithWhereWithoutUsersInput, Prisma.BrandUpdateWithoutUsersInput>, Prisma.BrandUncheckedUpdateWithoutUsersInput>
}

export type BrandCreateNestedOneWithoutOutletsInput = {
  create?: Prisma.XOR<Prisma.BrandCreateWithoutOutletsInput, Prisma.BrandUncheckedCreateWithoutOutletsInput>
  connectOrCreate?: Prisma.BrandCreateOrConnectWithoutOutletsInput
  connect?: Prisma.BrandWhereUniqueInput
}

export type BrandUpdateOneRequiredWithoutOutletsNestedInput = {
  create?: Prisma.XOR<Prisma.BrandCreateWithoutOutletsInput, Prisma.BrandUncheckedCreateWithoutOutletsInput>
  connectOrCreate?: Prisma.BrandCreateOrConnectWithoutOutletsInput
  upsert?: Prisma.BrandUpsertWithoutOutletsInput
  connect?: Prisma.BrandWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.BrandUpdateToOneWithWhereWithoutOutletsInput, Prisma.BrandUpdateWithoutOutletsInput>, Prisma.BrandUncheckedUpdateWithoutOutletsInput>
}

export type BrandCreateWithoutUsersInput = {
  id?: string
  name: string
  slug: string
  email: string
  phoneNumber: string
  logoUrl?: string | null
  primaryColor?: string | null
  bannerImageUrl?: string | null
  description?: string | null
  termsText?: string | null
  isActive?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
  outlets?: Prisma.OutletCreateNestedManyWithoutBrandInput
}

export type BrandUncheckedCreateWithoutUsersInput = {
  id?: string
  name: string
  slug: string
  email: string
  phoneNumber: string
  logoUrl?: string | null
  primaryColor?: string | null
  bannerImageUrl?: string | null
  description?: string | null
  termsText?: string | null
  isActive?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
  outlets?: Prisma.OutletUncheckedCreateNestedManyWithoutBrandInput
}

export type BrandCreateOrConnectWithoutUsersInput = {
  where: Prisma.BrandWhereUniqueInput
  create: Prisma.XOR<Prisma.BrandCreateWithoutUsersInput, Prisma.BrandUncheckedCreateWithoutUsersInput>
}

export type BrandUpsertWithoutUsersInput = {
  update: Prisma.XOR<Prisma.BrandUpdateWithoutUsersInput, Prisma.BrandUncheckedUpdateWithoutUsersInput>
  create: Prisma.XOR<Prisma.BrandCreateWithoutUsersInput, Prisma.BrandUncheckedCreateWithoutUsersInput>
  where?: Prisma.BrandWhereInput
}

export type BrandUpdateToOneWithWhereWithoutUsersInput = {
  where?: Prisma.BrandWhereInput
  data: Prisma.XOR<Prisma.BrandUpdateWithoutUsersInput, Prisma.BrandUncheckedUpdateWithoutUsersInput>
}

export type BrandUpdateWithoutUsersInput = {
  id?: Prisma.StringFieldUpdateOperationsInput | string
  name?: Prisma.StringFieldUpdateOperationsInput | string
  slug?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  phoneNumber?: Prisma.StringFieldUpdateOperationsInput | string
  logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  primaryColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  bannerImageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  termsText?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  outlets?: Prisma.OutletUpdateManyWithoutBrandNestedInput
}

export type BrandUncheckedUpdateWithoutUsersInput = {
  id?: Prisma.StringFieldUpdateOperationsInput | string
  name?: Prisma.StringFieldUpdateOperationsInput | string
  slug?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  phoneNumber?: Prisma.StringFieldUpdateOperationsInput | string
  logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  primaryColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  bannerImageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  termsText?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  outlets?: Prisma.OutletUncheckedUpdateManyWithoutBrandNestedInput
}

export type BrandCreateWithoutOutletsInput = {
  id?: string
  name: string
  slug: string
  email: string
  phoneNumber: string
  logoUrl?: string | null
  primaryColor?: string | null
  bannerImageUrl?: string | null
  description?: string | null
  termsText?: string | null
  isActive?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
  users?: Prisma.AdminUserCreateNestedManyWithoutBrandInput
}

export type BrandUncheckedCreateWithoutOutletsInput = {
  id?: string
  name: string
  slug: string
  email: string
  phoneNumber: string
  logoUrl?: string | null
  primaryColor?: string | null
  bannerImageUrl?: string | null
  description?: string | null
  termsText?: string | null
  isActive?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
  users?: Prisma.AdminUserUncheckedCreateNestedManyWithoutBrandInput
}

export type BrandCreateOrConnectWithoutOutletsInput = {
  where: Prisma.BrandWhereUniqueInput
  create: Prisma.XOR<Prisma.BrandCreateWithoutOutletsInput, Prisma.BrandUncheckedCreateWithoutOutletsInput>
}

export type BrandUpsertWithoutOutletsInput = {
  update: Prisma.XOR<Prisma.BrandUpdateWithoutOutletsInput, Prisma.BrandUncheckedUpdateWithoutOutletsInput>
  create: Prisma.XOR<Prisma.BrandCreateWithoutOutletsInput, Prisma.BrandUncheckedCreateWithoutOutletsInput>
  where?: Prisma.BrandWhereInput
}

export type BrandUpdateToOneWithWhereWithoutOutletsInput = {
  where?: Prisma.BrandWhereInput
  data: Prisma.XOR<Prisma.BrandUpdateWithoutOutletsInput, Prisma.BrandUncheckedUpdateWithoutOutletsInput>
}

export type BrandUpdateWithoutOutletsInput = {
  id?: Prisma.StringFieldUpdateOperationsInput | string
  name?: Prisma.StringFieldUpdateOperationsInput | string
  slug?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  phoneNumber?: Prisma.StringFieldUpdateOperationsInput | string
  logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  primaryColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  bannerImageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  termsText?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  users?: Prisma.AdminUserUpdateManyWithoutBrandNestedInput
}

export type BrandUncheckedUpdateWithoutOutletsInput = {
  id?: Prisma.StringFieldUpdateOperationsInput | string
  name?: Prisma.StringFieldUpdateOperationsInput | string
  slug?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  phoneNumber?: Prisma.StringFieldUpdateOperationsInput | string
  logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  primaryColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  bannerImageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  termsText?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  users?: Prisma.AdminUserUncheckedUpdateManyWithoutBrandNestedInput
}

export type BrandCountOutputType = {
  users: number
  outlets: number
}

export type BrandCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  users?: boolean | BrandCountOutputTypeCountUsersArgs
  outlets?: boolean | BrandCountOutputTypeCountOutletsArgs
}

export type BrandCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandCountOutputTypeSelect<ExtArgs> | null
}

export type BrandCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.AdminUserWhereInput
}

export type BrandCountOutputTypeCountOutletsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.OutletWhereInput
}

export type BrandSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  id?: boolean
  name?: boolean
  slug?: boolean
  email?: boolean
  phoneNumber?: boolean
  logoUrl?: boolean
  primaryColor?: boolean
  bannerImageUrl?: boolean
  description?: boolean
  termsText?: boolean
  isActive?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  users?: boolean | Prisma.Brand$usersArgs<ExtArgs>
  outlets?: boolean | Prisma.Brand$outletsArgs<ExtArgs>
  _count?: boolean | Prisma.BrandCountOutputTypeDefaultArgs<ExtArgs>
}, ExtArgs["result"]["brand"]>

export type BrandSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  id?: boolean
  name?: boolean
  slug?: boolean
  email?: boolean
  phoneNumber?: boolean
  logoUrl?: boolean
  primaryColor?: boolean
  bannerImageUrl?: boolean
  description?: boolean
  termsText?: boolean
  isActive?: boolean
  createdAt?: boolean
  updatedAt?: boolean
}, ExtArgs["result"]["brand"]>

export type BrandSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  id?: boolean
  name?: boolean
  slug?: boolean
  email?: boolean
  phoneNumber?: boolean
  logoUrl?: boolean
  primaryColor?: boolean
  bannerImageUrl?: boolean
  description?: boolean
  termsText?: boolean
  isActive?: boolean
  createdAt?: boolean
  updatedAt?: boolean
}, ExtArgs["result"]["brand"]>

export type BrandSelectScalar = {
  id?: boolean
  name?: boolean
  slug?: boolean
  email?: boolean
  phoneNumber?: boolean
  logoUrl?: boolean
  primaryColor?: boolean
  bannerImageUrl?: boolean
  description?: boolean
  termsText?: boolean
  isActive?: boolean
  createdAt?: boolean
  updatedAt?: boolean
}

export type BrandOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "slug" | "email" | "phoneNumber" | "logoUrl" | "primaryColor" | "bannerImageUrl" | "description" | "termsText" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["brand"]>
export type BrandInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  users?: boolean | Prisma.Brand$usersArgs<ExtArgs>
  outlets?: boolean | Prisma.Brand$outletsArgs<ExtArgs>
  _count?: boolean | Prisma.BrandCountOutputTypeDefaultArgs<ExtArgs>
}
export type BrandIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {}
export type BrandIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {}

export type $BrandPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "Brand"
  objects: {
    users: Prisma.$AdminUserPayload<ExtArgs>[]
    outlets: Prisma.$OutletPayload<ExtArgs>[]
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    id: string
    name: string
    slug: string
    email: string
    phoneNumber: string
    logoUrl: string | null
    primaryColor: string | null
    bannerImageUrl: string | null
    description: string | null
    termsText: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["brand"]>
  composites: {}
}

export type BrandGetPayload<S extends boolean | null | undefined | BrandDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BrandPayload, S>

export type BrandCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<BrandFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BrandCountAggregateInputType | true
  }

export interface BrandDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Brand'], meta: { name: 'Brand' } }

  findUnique<T extends BrandFindUniqueArgs>(args: Prisma.SelectSubset<T, BrandFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BrandClient<runtime.Types.Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  findUniqueOrThrow<T extends BrandFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BrandFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BrandClient<runtime.Types.Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  findFirst<T extends BrandFindFirstArgs>(args?: Prisma.SelectSubset<T, BrandFindFirstArgs<ExtArgs>>): Prisma.Prisma__BrandClient<runtime.Types.Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  findFirstOrThrow<T extends BrandFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BrandFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BrandClient<runtime.Types.Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  findMany<T extends BrandFindManyArgs>(args?: Prisma.SelectSubset<T, BrandFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  create<T extends BrandCreateArgs>(args: Prisma.SelectSubset<T, BrandCreateArgs<ExtArgs>>): Prisma.Prisma__BrandClient<runtime.Types.Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  createMany<T extends BrandCreateManyArgs>(args?: Prisma.SelectSubset<T, BrandCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  createManyAndReturn<T extends BrandCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BrandCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

  delete<T extends BrandDeleteArgs>(args: Prisma.SelectSubset<T, BrandDeleteArgs<ExtArgs>>): Prisma.Prisma__BrandClient<runtime.Types.Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  update<T extends BrandUpdateArgs>(args: Prisma.SelectSubset<T, BrandUpdateArgs<ExtArgs>>): Prisma.Prisma__BrandClient<runtime.Types.Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  deleteMany<T extends BrandDeleteManyArgs>(args?: Prisma.SelectSubset<T, BrandDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  updateMany<T extends BrandUpdateManyArgs>(args: Prisma.SelectSubset<T, BrandUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  updateManyAndReturn<T extends BrandUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BrandUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

  upsert<T extends BrandUpsertArgs>(args: Prisma.SelectSubset<T, BrandUpsertArgs<ExtArgs>>): Prisma.Prisma__BrandClient<runtime.Types.Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  count<T extends BrandCountArgs>(
    args?: Prisma.Subset<T, BrandCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], BrandCountAggregateOutputType>
      : number
  >

  aggregate<T extends BrandAggregateArgs>(args: Prisma.Subset<T, BrandAggregateArgs>): Prisma.PrismaPromise<GetBrandAggregateType<T>>

  groupBy<
    T extends BrandGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: BrandGroupByArgs['orderBy'] }
      : { orderBy?: BrandGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, BrandGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBrandGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

readonly fields: BrandFieldRefs;
}

export interface Prisma__BrandClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  users<T extends Prisma.Brand$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Brand$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  outlets<T extends Prisma.Brand$outletsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Brand$outletsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OutletPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>

  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>

  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}

export interface BrandFieldRefs {
  readonly id: Prisma.FieldRef<"Brand", 'String'>
  readonly name: Prisma.FieldRef<"Brand", 'String'>
  readonly slug: Prisma.FieldRef<"Brand", 'String'>
  readonly email: Prisma.FieldRef<"Brand", 'String'>
  readonly phoneNumber: Prisma.FieldRef<"Brand", 'String'>
  readonly logoUrl: Prisma.FieldRef<"Brand", 'String'>
  readonly primaryColor: Prisma.FieldRef<"Brand", 'String'>
  readonly bannerImageUrl: Prisma.FieldRef<"Brand", 'String'>
  readonly description: Prisma.FieldRef<"Brand", 'String'>
  readonly termsText: Prisma.FieldRef<"Brand", 'String'>
  readonly isActive: Prisma.FieldRef<"Brand", 'Boolean'>
  readonly createdAt: Prisma.FieldRef<"Brand", 'DateTime'>
  readonly updatedAt: Prisma.FieldRef<"Brand", 'DateTime'>
}

export type BrandFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandSelect<ExtArgs> | null

  omit?: Prisma.BrandOmit<ExtArgs> | null

  include?: Prisma.BrandInclude<ExtArgs> | null

  where: Prisma.BrandWhereUniqueInput
}

export type BrandFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandSelect<ExtArgs> | null

  omit?: Prisma.BrandOmit<ExtArgs> | null

  include?: Prisma.BrandInclude<ExtArgs> | null

  where: Prisma.BrandWhereUniqueInput
}

export type BrandFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandSelect<ExtArgs> | null

  omit?: Prisma.BrandOmit<ExtArgs> | null

  include?: Prisma.BrandInclude<ExtArgs> | null

  where?: Prisma.BrandWhereInput

  orderBy?: Prisma.BrandOrderByWithRelationInput | Prisma.BrandOrderByWithRelationInput[]

  cursor?: Prisma.BrandWhereUniqueInput

  take?: number

  skip?: number

  distinct?: Prisma.BrandScalarFieldEnum | Prisma.BrandScalarFieldEnum[]
}

export type BrandFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandSelect<ExtArgs> | null

  omit?: Prisma.BrandOmit<ExtArgs> | null

  include?: Prisma.BrandInclude<ExtArgs> | null

  where?: Prisma.BrandWhereInput

  orderBy?: Prisma.BrandOrderByWithRelationInput | Prisma.BrandOrderByWithRelationInput[]

  cursor?: Prisma.BrandWhereUniqueInput

  take?: number

  skip?: number

  distinct?: Prisma.BrandScalarFieldEnum | Prisma.BrandScalarFieldEnum[]
}

export type BrandFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandSelect<ExtArgs> | null

  omit?: Prisma.BrandOmit<ExtArgs> | null

  include?: Prisma.BrandInclude<ExtArgs> | null

  where?: Prisma.BrandWhereInput

  orderBy?: Prisma.BrandOrderByWithRelationInput | Prisma.BrandOrderByWithRelationInput[]

  cursor?: Prisma.BrandWhereUniqueInput

  take?: number

  skip?: number

  distinct?: Prisma.BrandScalarFieldEnum | Prisma.BrandScalarFieldEnum[]
}

export type BrandCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandSelect<ExtArgs> | null

  omit?: Prisma.BrandOmit<ExtArgs> | null

  include?: Prisma.BrandInclude<ExtArgs> | null

  data: Prisma.XOR<Prisma.BrandCreateInput, Prisma.BrandUncheckedCreateInput>
}

export type BrandCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  data: Prisma.BrandCreateManyInput | Prisma.BrandCreateManyInput[]
  skipDuplicates?: boolean
}

export type BrandCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandSelectCreateManyAndReturn<ExtArgs> | null

  omit?: Prisma.BrandOmit<ExtArgs> | null

  data: Prisma.BrandCreateManyInput | Prisma.BrandCreateManyInput[]
  skipDuplicates?: boolean
}

export type BrandUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandSelect<ExtArgs> | null

  omit?: Prisma.BrandOmit<ExtArgs> | null

  include?: Prisma.BrandInclude<ExtArgs> | null

  data: Prisma.XOR<Prisma.BrandUpdateInput, Prisma.BrandUncheckedUpdateInput>

  where: Prisma.BrandWhereUniqueInput
}

export type BrandUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  data: Prisma.XOR<Prisma.BrandUpdateManyMutationInput, Prisma.BrandUncheckedUpdateManyInput>

  where?: Prisma.BrandWhereInput

  limit?: number
}

export type BrandUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandSelectUpdateManyAndReturn<ExtArgs> | null

  omit?: Prisma.BrandOmit<ExtArgs> | null

  data: Prisma.XOR<Prisma.BrandUpdateManyMutationInput, Prisma.BrandUncheckedUpdateManyInput>

  where?: Prisma.BrandWhereInput

  limit?: number
}

export type BrandUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandSelect<ExtArgs> | null

  omit?: Prisma.BrandOmit<ExtArgs> | null

  include?: Prisma.BrandInclude<ExtArgs> | null

  where: Prisma.BrandWhereUniqueInput

  create: Prisma.XOR<Prisma.BrandCreateInput, Prisma.BrandUncheckedCreateInput>

  update: Prisma.XOR<Prisma.BrandUpdateInput, Prisma.BrandUncheckedUpdateInput>
}

export type BrandDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandSelect<ExtArgs> | null

  omit?: Prisma.BrandOmit<ExtArgs> | null

  include?: Prisma.BrandInclude<ExtArgs> | null

  where: Prisma.BrandWhereUniqueInput
}

export type BrandDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  where?: Prisma.BrandWhereInput

  limit?: number
}

export type Brand$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.AdminUserSelect<ExtArgs> | null

  omit?: Prisma.AdminUserOmit<ExtArgs> | null

  include?: Prisma.AdminUserInclude<ExtArgs> | null
  where?: Prisma.AdminUserWhereInput
  orderBy?: Prisma.AdminUserOrderByWithRelationInput | Prisma.AdminUserOrderByWithRelationInput[]
  cursor?: Prisma.AdminUserWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.AdminUserScalarFieldEnum | Prisma.AdminUserScalarFieldEnum[]
}

export type Brand$outletsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.OutletSelect<ExtArgs> | null

  omit?: Prisma.OutletOmit<ExtArgs> | null

  include?: Prisma.OutletInclude<ExtArgs> | null
  where?: Prisma.OutletWhereInput
  orderBy?: Prisma.OutletOrderByWithRelationInput | Prisma.OutletOrderByWithRelationInput[]
  cursor?: Prisma.OutletWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.OutletScalarFieldEnum | Prisma.OutletScalarFieldEnum[]
}

export type BrandDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.BrandSelect<ExtArgs> | null

  omit?: Prisma.BrandOmit<ExtArgs> | null

  include?: Prisma.BrandInclude<ExtArgs> | null
}
