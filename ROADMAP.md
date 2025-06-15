
---

### ROADMAP.md

```markdown
# 2‑Hour MVP Roadmap (Dockerized)

## Hour 1: Core Parsing, Validation & Container Setup
1. **Project Init & Dockerfiles** (15′)  
   - `npx create-t3-app@latest smart-order-mvp --docker`  
   - Add `Dockerfile` for Next.js app  
   - Add `docker-compose.yml` to orchestrate `app` + `postgres`  

2. **Schema & Migrations inside Container** (10′)  
   - Prisma schema (see DATABASE.md)  
   - In `docker-compose`, map migrate script:  
     ```yaml
     command: ["npx", "prisma", "migrate", "deploy"]
     ```  

3. **Catalog Loader Script** (10′)  
   - `/scripts/loadProducts.ts` → `prisma db seed`  
   - Add seeding step to Dockerfile or entrypoint

4. **Email Parser Module** (25′)  
   - `src/server/utils/emailParser.ts`: regex/NLP extraction  
   - Unit‐test with sample `.txt` files

5. **Validation Logic** (10′)  
   - `src/server/utils/validateOrder.ts`: MOQ & stock checks + issue flags

---

## Hour 2: API, UI, PDF & Container Polishing
1. **tRPC Routes** (15′)  
   - `createOrder`, `getOrders`, `reviewOrder` in `src/server/routers/order.ts`  

2. **Review UI** (20′)  
   - `/app/orders/new/page.tsx`: textarea + “Parse & Validate”  
   - Editable table (`OrderReviewTable.tsx`)  

3. **PDF Generation** (15′)  
   - `src/server/utils/pdfFiller.ts` using `pdf-lib`  
   - Endpoint returns PDF buffer  

4. **Docker Compose Polish & Healthchecks** (10′)  
   - Expose ports, env vars in `.env` (DATABASE_URL)  
   - Add healthcheck for Postgres  
   - Ensure `docker-compose up --build` runs migrations & seed automatically  

5. **Final QA** (10′)  
   - `docker-compose up --build` → test parsing + PDF export  
   - Document `README.md` with “`docker-compose up`” steps
