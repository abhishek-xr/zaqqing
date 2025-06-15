# Database Design (Prisma Schema)

```prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  orders        Order[]
  createdAt     DateTime @default(now())
}

model Product {
  id            String   @id @default(cuid())
  sku           String   @unique
  name          String
  moq           Int
  stock         Int
  priceCents    Int
}

model Order {
  id              String       @id @default(cuid())
  customerName    String
  deliveryDate    DateTime
  deliveryAddress String
  items           OrderItem[]
  user            User?        @relation(fields: [userId], references: [id])
  userId          String?
  status          OrderStatus  @default(PENDING)
  createdAt       DateTime     @default(now())
}

model OrderItem {
  id          String   @id @default(cuid())
  order       Order    @relation(fields: [orderId], references: [id])
  orderId     String
  product     Product  @relation(fields: [productId], references: [id])
  productId   String
  qty         Int
  valid       Boolean
  issues      String[] // e.g. ["MOQ not met"]
  suggestions String[]
  confidence  Float
}

enum OrderStatus {
  PENDING
  VALIDATED
  REVIEWED
  COMPLETED
}
