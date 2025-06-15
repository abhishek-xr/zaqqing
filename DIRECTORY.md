smart-order-mvp/
├── Dockerfile
├── docker-compose.yml
├── .env
├── next.config.js
├── tsconfig.json
├── package.json
├── prisma/
│   ├── schema.prisma
│   └── seed/
│       └── index.ts
├── scripts/
│   └── loadProducts.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   ├── orders/
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── components/
│   │       ├── OrderForm.tsx
│   │       ├── OrderReviewTable.tsx
│   │       └── PDFViewer.tsx
│   ├── server/
│   │   ├── routers/
│   │   │   ├── order.ts
│   │   │   └── product.ts
│   │   └── utils/
│   │       ├── emailParser.ts
│   │       ├── validateOrder.ts
│   │       └── pdfFiller.ts


import FuzzySet = require("fuzzyset"); 