# Product Requirements Document (PRD)

## 1. Problem Statement
Enterprises receive messy, multi‐threaded customer emails with product orders.  
Manual triaging and validation of SKUs, quantities, and delivery details leads to slow operations and errors.

## 2. Target Users
Sales operations teams at SMEs who need a self‐hosted, local tool to process email orders.

## 3. Key Problems
- Messy, unstructured or multi‐threaded emails  
- Manual SKU existence checks, MOQ enforcement, stock validation  
- Time‑consuming PDF form filling  
- Need for a portable, local deployment (no cloud hosting)

## 4. MVP Scope
1. **Parse** raw email text → extract items, quantities, delivery details  
2. **Validate** each line item against a product catalog (SKU exists, MOQ, stock)  
3. **Output** structured JSON + flag any issues/suggestions  
4. **UI** to review/edit parsed data  
5. *(Bonus)* Auto‑fill a sales order PDF template  
6. **Deliverable**: single Docker image (with Compose) that spins up Next.js, Postgres, and runs migrations, so any teammate can `docker-compose up` locally.

## 5. Success Metrics
- ≥ 90% extraction & validation accuracy  
- End‑to‑end processing < 5 seconds per email  
- User can review & approve within < 1 minute  
- PDF generated without errors  
- Local startup via Docker Compose in < 30 seconds

## 6. Out of Scope
- Direct integration with email providers  
- Advanced AI fallback/substitution logic  
- Cloud deployment or CI/CD pipelines  
