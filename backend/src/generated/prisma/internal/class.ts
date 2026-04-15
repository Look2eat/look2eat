import * as runtime from "@prisma/client/runtime/client"
import type * as Prisma from "./prismaNamespace"

const config: runtime.GetPrismaClientConfig = {
  "previewFeatures": [],
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = \"prisma-client\"\n  output   = \"../src/generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel Brand {\n  id             String  @id @default(uuid())\n  name           String\n  slug           String  @unique\n  email          String\n  phoneNumber    String\n  logoUrl        String?\n  primaryColor   String?\n  bannerImageUrl String?\n  description    String?\n  termsText      String?\n  isActive       Boolean @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  users   AdminUser[]\n  outlets Outlet[]\n}\n\nmodel AdminUser {\n  id           String  @id @default(uuid())\n  brandId      String\n  name         String\n  email        String\n  phoneNumber  String\n  passwordHash String\n  role         Role\n  isActive     Boolean @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  brand Brand @relation(fields: [brandId], references: [id])\n\n  @@unique([brandId, email])\n}\n\nmodel Outlet {\n  id          String  @id @default(uuid())\n  brandId     String\n  name        String\n  address     String?\n  phoneNumber String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  brand Brand @relation(fields: [brandId], references: [id])\n}\n\nenum Role {\n  OWNER\n  OUTLET_MANAGER\n  CASHIER\n}\n",
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"Brand\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phoneNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logoUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"primaryColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bannerImageUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"termsText\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"users\",\"kind\":\"object\",\"type\":\"AdminUser\",\"relationName\":\"AdminUserToBrand\"},{\"name\":\"outlets\",\"kind\":\"object\",\"type\":\"Outlet\",\"relationName\":\"BrandToOutlet\"}],\"dbName\":null},\"AdminUser\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"brandId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phoneNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"passwordHash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"Role\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"brand\",\"kind\":\"object\",\"type\":\"Brand\",\"relationName\":\"AdminUserToBrand\"}],\"dbName\":null},\"Outlet\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"brandId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phoneNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"brand\",\"kind\":\"object\",\"type\":\"Brand\",\"relationName\":\"BrandToOutlet\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
config.parameterizationSchema = {
  strings: JSON.parse("[\"where\",\"orderBy\",\"cursor\",\"brand\",\"users\",\"outlets\",\"_count\",\"Brand.findUnique\",\"Brand.findUniqueOrThrow\",\"Brand.findFirst\",\"Brand.findFirstOrThrow\",\"Brand.findMany\",\"data\",\"Brand.createOne\",\"Brand.createMany\",\"Brand.createManyAndReturn\",\"Brand.updateOne\",\"Brand.updateMany\",\"Brand.updateManyAndReturn\",\"create\",\"update\",\"Brand.upsertOne\",\"Brand.deleteOne\",\"Brand.deleteMany\",\"having\",\"_min\",\"_max\",\"Brand.groupBy\",\"Brand.aggregate\",\"AdminUser.findUnique\",\"AdminUser.findUniqueOrThrow\",\"AdminUser.findFirst\",\"AdminUser.findFirstOrThrow\",\"AdminUser.findMany\",\"AdminUser.createOne\",\"AdminUser.createMany\",\"AdminUser.createManyAndReturn\",\"AdminUser.updateOne\",\"AdminUser.updateMany\",\"AdminUser.updateManyAndReturn\",\"AdminUser.upsertOne\",\"AdminUser.deleteOne\",\"AdminUser.deleteMany\",\"AdminUser.groupBy\",\"AdminUser.aggregate\",\"Outlet.findUnique\",\"Outlet.findUniqueOrThrow\",\"Outlet.findFirst\",\"Outlet.findFirstOrThrow\",\"Outlet.findMany\",\"Outlet.createOne\",\"Outlet.createMany\",\"Outlet.createManyAndReturn\",\"Outlet.updateOne\",\"Outlet.updateMany\",\"Outlet.updateManyAndReturn\",\"Outlet.upsertOne\",\"Outlet.deleteOne\",\"Outlet.deleteMany\",\"Outlet.groupBy\",\"Outlet.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"brandId\",\"name\",\"address\",\"phoneNumber\",\"createdAt\",\"updatedAt\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"email\",\"passwordHash\",\"Role\",\"role\",\"isActive\",\"slug\",\"logoUrl\",\"primaryColor\",\"bannerImageUrl\",\"description\",\"termsText\",\"every\",\"some\",\"none\",\"brandId_email\",\"is\",\"isNot\",\"connectOrCreate\",\"upsert\",\"createMany\",\"set\",\"disconnect\",\"delete\",\"connect\",\"updateMany\",\"deleteMany\"]"),
  graph: "rQEaMBIEAABpACAFAABqACA9AABkADA-AAAOABA_AABkADBAAQAAAAFCAQBlACFEAQBlACFFQABoACFGQABoACFSAQBlACFWIABnACFXAQAAAAFYAQBmACFZAQBmACFaAQBmACFbAQBmACFcAQBmACEBAAAAAQAgDgMAAGwAID0AAG4AMD4AAAMAED8AAG4AMEABAGUAIUEBAGUAIUIBAGUAIUQBAGUAIUVAAGgAIUZAAGgAIVIBAGUAIVMBAGUAIVUAAG9VIlYgAGcAIQEDAAChAQAgDwMAAGwAID0AAG4AMD4AAAMAED8AAG4AMEABAAAAAUEBAGUAIUIBAGUAIUQBAGUAIUVAAGgAIUZAAGgAIVIBAGUAIVMBAGUAIVUAAG9VIlYgAGcAIWAAAG0AIAMAAAADACABAAAEADACAAAFACALAwAAbAAgPQAAawAwPgAABwAQPwAAawAwQAEAZQAhQQEAZQAhQgEAZQAhQwEAZgAhRAEAZgAhRUAAaAAhRkAAaAAhAwMAAKEBACBDAABwACBEAABwACALAwAAbAAgPQAAawAwPgAABwAQPwAAawAwQAEAAAABQQEAZQAhQgEAZQAhQwEAZgAhRAEAZgAhRUAAaAAhRkAAaAAhAwAAAAcAIAEAAAgAMAIAAAkAIAEAAAADACABAAAABwAgAQAAAAEAIBIEAABpACAFAABqACA9AABkADA-AAAOABA_AABkADBAAQBlACFCAQBlACFEAQBlACFFQABoACFGQABoACFSAQBlACFWIABnACFXAQBlACFYAQBmACFZAQBmACFaAQBmACFbAQBmACFcAQBmACEHBAAAnwEAIAUAAKABACBYAABwACBZAABwACBaAABwACBbAABwACBcAABwACADAAAADgAgAQAADwAwAgAAAQAgAwAAAA4AIAEAAA8AMAIAAAEAIAMAAAAOACABAAAPADACAAABACAPBAAAnQEAIAUAAJ4BACBAAQAAAAFCAQAAAAFEAQAAAAFFQAAAAAFGQAAAAAFSAQAAAAFWIAAAAAFXAQAAAAFYAQAAAAFZAQAAAAFaAQAAAAFbAQAAAAFcAQAAAAEBDAAAEwAgDUABAAAAAUIBAAAAAUQBAAAAAUVAAAAAAUZAAAAAAVIBAAAAAVYgAAAAAVcBAAAAAVgBAAAAAVkBAAAAAVoBAAAAAVsBAAAAAVwBAAAAAQEMAAAVADABDAAAFQAwDwQAAIMBACAFAACEAQAgQAEAdAAhQgEAdAAhRAEAdAAhRUAAdgAhRkAAdgAhUgEAdAAhViAAfQAhVwEAdAAhWAEAdQAhWQEAdQAhWgEAdQAhWwEAdQAhXAEAdQAhAgAAAAEAIAwAABgAIA1AAQB0ACFCAQB0ACFEAQB0ACFFQAB2ACFGQAB2ACFSAQB0ACFWIAB9ACFXAQB0ACFYAQB1ACFZAQB1ACFaAQB1ACFbAQB1ACFcAQB1ACECAAAADgAgDAAAGgAgAgAAAA4AIAwAABoAIAMAAAABACATAAATACAUAAAYACABAAAAAQAgAQAAAA4AIAgGAACAAQAgGQAAggEAIBoAAIEBACBYAABwACBZAABwACBaAABwACBbAABwACBcAABwACAQPQAAYwAwPgAAIQAQPwAAYwAwQAEAUQAhQgEAUQAhRAEAUQAhRUAAUwAhRkAAUwAhUgEAUQAhViAAXgAhVwEAUQAhWAEAUgAhWQEAUgAhWgEAUgAhWwEAUgAhXAEAUgAhAwAAAA4AIAEAACAAMBgAACEAIAMAAAAOACABAAAPADACAAABACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAsDAAB_ACBAAQAAAAFBAQAAAAFCAQAAAAFEAQAAAAFFQAAAAAFGQAAAAAFSAQAAAAFTAQAAAAFVAAAAVQJWIAAAAAEBDAAAKQAgCkABAAAAAUEBAAAAAUIBAAAAAUQBAAAAAUVAAAAAAUZAAAAAAVIBAAAAAVMBAAAAAVUAAABVAlYgAAAAAQEMAAArADABDAAAKwAwCwMAAH4AIEABAHQAIUEBAHQAIUIBAHQAIUQBAHQAIUVAAHYAIUZAAHYAIVIBAHQAIVMBAHQAIVUAAHxVIlYgAH0AIQIAAAAFACAMAAAuACAKQAEAdAAhQQEAdAAhQgEAdAAhRAEAdAAhRUAAdgAhRkAAdgAhUgEAdAAhUwEAdAAhVQAAfFUiViAAfQAhAgAAAAMAIAwAADAAIAIAAAADACAMAAAwACADAAAABQAgEwAAKQAgFAAALgAgAQAAAAUAIAEAAAADACADBgAAeQAgGQAAewAgGgAAegAgDT0AAFwAMD4AADcAED8AAFwAMEABAFEAIUEBAFEAIUIBAFEAIUQBAFEAIUVAAFMAIUZAAFMAIVIBAFEAIVMBAFEAIVUAAF1VIlYgAF4AIQMAAAADACABAAA2ADAYAAA3ACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAIAwAAeAAgQAEAAAABQQEAAAABQgEAAAABQwEAAAABRAEAAAABRUAAAAABRkAAAAABAQwAAD8AIAdAAQAAAAFBAQAAAAFCAQAAAAFDAQAAAAFEAQAAAAFFQAAAAAFGQAAAAAEBDAAAQQAwAQwAAEEAMAgDAAB3ACBAAQB0ACFBAQB0ACFCAQB0ACFDAQB1ACFEAQB1ACFFQAB2ACFGQAB2ACECAAAACQAgDAAARAAgB0ABAHQAIUEBAHQAIUIBAHQAIUMBAHUAIUQBAHUAIUVAAHYAIUZAAHYAIQIAAAAHACAMAABGACACAAAABwAgDAAARgAgAwAAAAkAIBMAAD8AIBQAAEQAIAEAAAAJACABAAAABwAgBQYAAHEAIBkAAHMAIBoAAHIAIEMAAHAAIEQAAHAAIAo9AABQADA-AABNABA_AABQADBAAQBRACFBAQBRACFCAQBRACFDAQBSACFEAQBSACFFQABTACFGQABTACEDAAAABwAgAQAATAAwGAAATQAgAwAAAAcAIAEAAAgAMAIAAAkAIAo9AABQADA-AABNABA_AABQADBAAQBRACFBAQBRACFCAQBRACFDAQBSACFEAQBSACFFQABTACFGQABTACEOBgAAVQAgGQAAWwAgGgAAWwAgRwEAAAABSAEAAAAESQEAAAAESgEAAAABSwEAAAABTAEAAAABTQEAAAABTgEAWgAhTwEAAAABUAEAAAABUQEAAAABDgYAAFgAIBkAAFkAIBoAAFkAIEcBAAAAAUgBAAAABUkBAAAABUoBAAAAAUsBAAAAAUwBAAAAAU0BAAAAAU4BAFcAIU8BAAAAAVABAAAAAVEBAAAAAQsGAABVACAZAABWACAaAABWACBHQAAAAAFIQAAAAARJQAAAAARKQAAAAAFLQAAAAAFMQAAAAAFNQAAAAAFOQABUACELBgAAVQAgGQAAVgAgGgAAVgAgR0AAAAABSEAAAAAESUAAAAAESkAAAAABS0AAAAABTEAAAAABTUAAAAABTkAAVAAhCEcCAAAAAUgCAAAABEkCAAAABEoCAAAAAUsCAAAAAUwCAAAAAU0CAAAAAU4CAFUAIQhHQAAAAAFIQAAAAARJQAAAAARKQAAAAAFLQAAAAAFMQAAAAAFNQAAAAAFOQABWACEOBgAAWAAgGQAAWQAgGgAAWQAgRwEAAAABSAEAAAAFSQEAAAAFSgEAAAABSwEAAAABTAEAAAABTQEAAAABTgEAVwAhTwEAAAABUAEAAAABUQEAAAABCEcCAAAAAUgCAAAABUkCAAAABUoCAAAAAUsCAAAAAUwCAAAAAU0CAAAAAU4CAFgAIQtHAQAAAAFIAQAAAAVJAQAAAAVKAQAAAAFLAQAAAAFMAQAAAAFNAQAAAAFOAQBZACFPAQAAAAFQAQAAAAFRAQAAAAEOBgAAVQAgGQAAWwAgGgAAWwAgRwEAAAABSAEAAAAESQEAAAAESgEAAAABSwEAAAABTAEAAAABTQEAAAABTgEAWgAhTwEAAAABUAEAAAABUQEAAAABC0cBAAAAAUgBAAAABEkBAAAABEoBAAAAAUsBAAAAAUwBAAAAAU0BAAAAAU4BAFsAIU8BAAAAAVABAAAAAVEBAAAAAQ09AABcADA-AAA3ABA_AABcADBAAQBRACFBAQBRACFCAQBRACFEAQBRACFFQABTACFGQABTACFSAQBRACFTAQBRACFVAABdVSJWIABeACEHBgAAVQAgGQAAYgAgGgAAYgAgRwAAAFUCSAAAAFUISQAAAFUITgAAYVUiBQYAAFUAIBkAAGAAIBoAAGAAIEcgAAAAAU4gAF8AIQUGAABVACAZAABgACAaAABgACBHIAAAAAFOIABfACECRyAAAAABTiAAYAAhBwYAAFUAIBkAAGIAIBoAAGIAIEcAAABVAkgAAABVCEkAAABVCE4AAGFVIgRHAAAAVQJIAAAAVQhJAAAAVQhOAABiVSIQPQAAYwAwPgAAIQAQPwAAYwAwQAEAUQAhQgEAUQAhRAEAUQAhRUAAUwAhRkAAUwAhUgEAUQAhViAAXgAhVwEAUQAhWAEAUgAhWQEAUgAhWgEAUgAhWwEAUgAhXAEAUgAhEgQAAGkAIAUAAGoAID0AAGQAMD4AAA4AED8AAGQAMEABAGUAIUIBAGUAIUQBAGUAIUVAAGgAIUZAAGgAIVIBAGUAIVYgAGcAIVcBAGUAIVgBAGYAIVkBAGYAIVoBAGYAIVsBAGYAIVwBAGYAIQtHAQAAAAFIAQAAAARJAQAAAARKAQAAAAFLAQAAAAFMAQAAAAFNAQAAAAFOAQBbACFPAQAAAAFQAQAAAAFRAQAAAAELRwEAAAABSAEAAAAFSQEAAAAFSgEAAAABSwEAAAABTAEAAAABTQEAAAABTgEAWQAhTwEAAAABUAEAAAABUQEAAAABAkcgAAAAAU4gAGAAIQhHQAAAAAFIQAAAAARJQAAAAARKQAAAAAFLQAAAAAFMQAAAAAFNQAAAAAFOQABWACEDXQAAAwAgXgAAAwAgXwAAAwAgA10AAAcAIF4AAAcAIF8AAAcAIAsDAABsACA9AABrADA-AAAHABA_AABrADBAAQBlACFBAQBlACFCAQBlACFDAQBmACFEAQBmACFFQABoACFGQABoACEUBAAAaQAgBQAAagAgPQAAZAAwPgAADgAQPwAAZAAwQAEAZQAhQgEAZQAhRAEAZQAhRUAAaAAhRkAAaAAhUgEAZQAhViAAZwAhVwEAZQAhWAEAZgAhWQEAZgAhWgEAZgAhWwEAZgAhXAEAZgAhYQAADgAgYgAADgAgAkEBAAAAAVIBAAAAAQ4DAABsACA9AABuADA-AAADABA_AABuADBAAQBlACFBAQBlACFCAQBlACFEAQBlACFFQABoACFGQABoACFSAQBlACFTAQBlACFVAABvVSJWIABnACEERwAAAFUCSAAAAFUISQAAAFUITgAAYlUiAAAAAAFmAQAAAAEBZgEAAAABAWZAAAAAAQUTAACpAQAgFAAArAEAIGMAAKoBACBkAACrAQAgaQAAAQAgAxMAAKkBACBjAACqAQAgaQAAAQAgAAAAAWYAAABVAgFmIAAAAAEFEwAApAEAIBQAAKcBACBjAAClAQAgZAAApgEAIGkAAAEAIAMTAACkAQAgYwAApQEAIGkAAAEAIAAAAAsTAACRAQAwFAAAlgEAMGMAAJIBADBkAACTAQAwZQAAlAEAIGYAAJUBADBnAACVAQAwaAAAlQEAMGkAAJUBADBqAACXAQAwawAAmAEAMAsTAACFAQAwFAAAigEAMGMAAIYBADBkAACHAQAwZQAAiAEAIGYAAIkBADBnAACJAQAwaAAAiQEAMGkAAIkBADBqAACLAQAwawAAjAEAMAZAAQAAAAFCAQAAAAFDAQAAAAFEAQAAAAFFQAAAAAFGQAAAAAECAAAACQAgEwAAkAEAIAMAAAAJACATAACQAQAgFAAAjwEAIAEMAACjAQAwCwMAAGwAID0AAGsAMD4AAAcAED8AAGsAMEABAAAAAUEBAGUAIUIBAGUAIUMBAGYAIUQBAGYAIUVAAGgAIUZAAGgAIQIAAAAJACAMAACPAQAgAgAAAI0BACAMAACOAQAgCj0AAIwBADA-AACNAQAQPwAAjAEAMEABAGUAIUEBAGUAIUIBAGUAIUMBAGYAIUQBAGYAIUVAAGgAIUZAAGgAIQo9AACMAQAwPgAAjQEAED8AAIwBADBAAQBlACFBAQBlACFCAQBlACFDAQBmACFEAQBmACFFQABoACFGQABoACEGQAEAdAAhQgEAdAAhQwEAdQAhRAEAdQAhRUAAdgAhRkAAdgAhBkABAHQAIUIBAHQAIUMBAHUAIUQBAHUAIUVAAHYAIUZAAHYAIQZAAQAAAAFCAQAAAAFDAQAAAAFEAQAAAAFFQAAAAAFGQAAAAAEJQAEAAAABQgEAAAABRAEAAAABRUAAAAABRkAAAAABUgEAAAABUwEAAAABVQAAAFUCViAAAAABAgAAAAUAIBMAAJwBACADAAAABQAgEwAAnAEAIBQAAJsBACABDAAAogEAMA8DAABsACA9AABuADA-AAADABA_AABuADBAAQAAAAFBAQBlACFCAQBlACFEAQBlACFFQABoACFGQABoACFSAQBlACFTAQBlACFVAABvVSJWIABnACFgAABtACACAAAABQAgDAAAmwEAIAIAAACZAQAgDAAAmgEAIA09AACYAQAwPgAAmQEAED8AAJgBADBAAQBlACFBAQBlACFCAQBlACFEAQBlACFFQABoACFGQABoACFSAQBlACFTAQBlACFVAABvVSJWIABnACENPQAAmAEAMD4AAJkBABA_AACYAQAwQAEAZQAhQQEAZQAhQgEAZQAhRAEAZQAhRUAAaAAhRkAAaAAhUgEAZQAhUwEAZQAhVQAAb1UiViAAZwAhCUABAHQAIUIBAHQAIUQBAHQAIUVAAHYAIUZAAHYAIVIBAHQAIVMBAHQAIVUAAHxVIlYgAH0AIQlAAQB0ACFCAQB0ACFEAQB0ACFFQAB2ACFGQAB2ACFSAQB0ACFTAQB0ACFVAAB8VSJWIAB9ACEJQAEAAAABQgEAAAABRAEAAAABRUAAAAABRkAAAAABUgEAAAABUwEAAAABVQAAAFUCViAAAAABBBMAAJEBADBjAACSAQAwZQAAlAEAIGkAAJUBADAEEwAAhQEAMGMAAIYBADBlAACIAQAgaQAAiQEAMAAABwQAAJ8BACAFAACgAQAgWAAAcAAgWQAAcAAgWgAAcAAgWwAAcAAgXAAAcAAgCUABAAAAAUIBAAAAAUQBAAAAAUVAAAAAAUZAAAAAAVIBAAAAAVMBAAAAAVUAAABVAlYgAAAAAQZAAQAAAAFCAQAAAAFDAQAAAAFEAQAAAAFFQAAAAAFGQAAAAAEOBQAAngEAIEABAAAAAUIBAAAAAUQBAAAAAUVAAAAAAUZAAAAAAVIBAAAAAVYgAAAAAVcBAAAAAVgBAAAAAVkBAAAAAVoBAAAAAVsBAAAAAVwBAAAAAQIAAAABACATAACkAQAgAwAAAA4AIBMAAKQBACAUAACoAQAgEAAAAA4AIAUAAIQBACAMAACoAQAgQAEAdAAhQgEAdAAhRAEAdAAhRUAAdgAhRkAAdgAhUgEAdAAhViAAfQAhVwEAdAAhWAEAdQAhWQEAdQAhWgEAdQAhWwEAdQAhXAEAdQAhDgUAAIQBACBAAQB0ACFCAQB0ACFEAQB0ACFFQAB2ACFGQAB2ACFSAQB0ACFWIAB9ACFXAQB0ACFYAQB1ACFZAQB1ACFaAQB1ACFbAQB1ACFcAQB1ACEOBAAAnQEAIEABAAAAAUIBAAAAAUQBAAAAAUVAAAAAAUZAAAAAAVIBAAAAAVYgAAAAAVcBAAAAAVgBAAAAAVkBAAAAAVoBAAAAAVsBAAAAAVwBAAAAAQIAAAABACATAACpAQAgAwAAAA4AIBMAAKkBACAUAACtAQAgEAAAAA4AIAQAAIMBACAMAACtAQAgQAEAdAAhQgEAdAAhRAEAdAAhRUAAdgAhRkAAdgAhUgEAdAAhViAAfQAhVwEAdAAhWAEAdQAhWQEAdQAhWgEAdQAhWwEAdQAhXAEAdQAhDgQAAIMBACBAAQB0ACFCAQB0ACFEAQB0ACFFQAB2ACFGQAB2ACFSAQB0ACFWIAB9ACFXAQB0ACFYAQB1ACFZAQB1ACFaAQB1ACFbAQB1ACFcAQB1ACEDBAYCBQoDBgAEAQMAAQEDAAECBAsABQwAAAAAAwYACRkAChoACwAAAAMGAAkZAAoaAAsBAwABAQMAAQMGABAZABEaABIAAAADBgAQGQARGgASAQMAAQEDAAEDBgAXGQAYGgAZAAAAAwYAFxkAGBoAGQcCAQgNAQkQAQoRAQsSAQ0UAQ4WBQ8XBhAZAREbBRIcBxUdARYeARcfBRsiCBwjDB0kAh4lAh8mAiAnAiEoAiIqAiMsBSQtDSUvAiYxBScyDigzAik0Aio1BSs4Dyw5Ey06Ay47Ay88AzA9AzE-AzJAAzNCBTRDFDVFAzZHBTdIFThJAzlKAzpLBTtOFjxPGg"
}

async function decodeBase64AsWasm(wasmBase64: string): Promise<WebAssembly.Module> {
  const { Buffer } = await import('node:buffer')
  const wasmArray = Buffer.from(wasmBase64, 'base64')
  return new WebAssembly.Module(wasmArray)
}

config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),

  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js")
    return await decodeBase64AsWasm(wasm)
  },

  importName: "./query_compiler_fast_bg.js"
}

export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> =
  'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never

export interface PrismaClientConstructor {

  new <
    Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
    LogOpts extends LogOptions<Options> = LogOptions<Options>,
    OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends { omit: infer U } ? U : Prisma.PrismaClientOptions['omit'],
    ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs
  >(options: Prisma.Subset<Options, Prisma.PrismaClientOptions> ): PrismaClient<LogOpts, OmitOpts, ExtArgs>
}

export interface PrismaClient<
  in LogOpts extends Prisma.LogLevel = never,
  in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined,
  in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

  $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  $connect(): runtime.Types.Utils.JsPromise<void>;

  $disconnect(): runtime.Types.Utils.JsPromise<void>;

  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): runtime.Types.Utils.JsPromise<R>

  $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
    extArgs: ExtArgs
  }>>

  get brand(): Prisma.BrandDelegate<ExtArgs, { omit: OmitOpts }>;

  get adminUser(): Prisma.AdminUserDelegate<ExtArgs, { omit: OmitOpts }>;

  get outlet(): Prisma.OutletDelegate<ExtArgs, { omit: OmitOpts }>;
}

export function getPrismaClientClass(): PrismaClientConstructor {
  return runtime.getPrismaClient(config) as unknown as PrismaClientConstructor
}
