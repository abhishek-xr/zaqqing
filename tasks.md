# Tasks.md

## **Objective**
Build a functional MVP within **1 hour 15 minutes** to meet customer requirements. Focus on parsing emails, validating orders, and merging them into a sales order. Prioritize functional features only.

---

## **Tasks Breakdown**

### **1. Core Parsing & Validation**
#### **1.1 Email Parsing** ✅ **(Completed)**
- **File**: `src/server/utils/emailParser.ts`
- **Tasks**:
  - Parse raw email text to extract:
    - SKUs
    - Quantities
    - Delivery details
  - Handle ambiguous requests with fuzzy matching (e.g., partial SKU matches).
  - Flag missing quantities or invalid SKUs.

#### **1.2 Order Validation** ✅ **(Completed)**
- **File**: `src/server/utils/validateOrder.ts`
- **Tasks**:
  - Check if SKUs exist in the product catalog.
  - Validate minimum order quantity (MOQ).
  - Check stock availability.
  - Flag issues:
    - Missing SKU
    - MOQ not met
    - Out of stock
  - Suggest alternatives for invalid SKUs or insufficient stock.

---

### **2. Database Setup**
#### **2.1 Product Catalog** ✅ **(Completed)**
- **File**: `prisma/schema.prisma`
- **Tasks**:
  - Seed the database with 500 products using `scripts/loadProducts.ts`.
  - Ensure `productCode`, `minOrderQty`, `stock`, and `priceCents` are populated.

#### **2.2 Order Models** ✅ **(Completed)**
- **File**: `prisma/schema.prisma`
- **Tasks**:
  - Ensure `Order` and `OrderItem` models support:
    - Merging multiple orders into one.
    - Tracking validation issues and suggestions.

---

### **3. API Development**
#### **3.1 Order API** ✅ **(Completed)**
- **File**: `src/server/routers/order.ts`
- **Tasks**:
  - Create endpoints:
    - `POST /api/orders/validate`: Validate parsed orders.
    - `POST /api/orders/merge`: Merge multiple orders into one.
    - `GET /api/orders`: Fetch all orders for review.

#### **3.2 Product API** ✅ **(Completed)**
- **File**: `src/server/routers/product.ts`
- **Tasks**:
  - Create endpoint:
    - `GET /api/products`: Fetch product catalog for validation.

---

### **4. UI Development**
#### **4.1 Sales Order Entry Form** ⬜ **(Pending)**
- **File**: `src/app/components/OrderForm.tsx`
- **Tasks**:
  - Build a form to:
    - Input raw email text.
    - Trigger parsing and validation.
    - Display validation results (issues, suggestions).

#### **4.2 Order Review Table** ⬜ **(Pending)**
- **File**: `src/app/components/OrderReviewTable.tsx`
- **Tasks**:
  - Display parsed and validated orders in a table.
  - Allow manual edits for flagged issues.

#### **4.3 Merge Orders** ⬜ **(Pending)**
- **File**: `src/app/orders/new/page.tsx`
- **Tasks**:
  - Add functionality to merge multiple orders into one.

---

### **5. Bonus Features (If Time Permits)**
#### **5.1 JSON Output** ⬜ **(Pending)**
- **File**: `src/server/utils/validateOrder.ts`
- **Tasks**:
  - Output validated orders as structured JSON.

#### **5.2 PDF Generation** ⬜ **(Pending)**
- **File**: `src/server/utils/pdfFiller.ts`
- **Tasks**:
  - Auto-fill a sales order PDF template with validated order data.

#### **5.3 Operator Agent** ⬜ **(Pending)**
- **File**: `src/app/components/PDFViewer.tsx`
- **Tasks**:
  - Add a UI component to simulate an operator reviewing and approving orders.

---

## **Execution Plan**
### **Time Allocation**
1. **Core Parsing & Validation**: ✅ **(Completed)**
2. **Database Setup**: ✅ **(Completed)**
3. **API Development**: ✅ **(Completed)**
4. **UI Development**: 15 minutes
   - Sales order form: 10 minutes
   - Order review table: 5 minutes
5. **Bonus Features**: 5 minutes (if time permits)

---

## **Deliverables**
- ✅ Functional email parser and order validator.
- ✅ Database seeded with 500 products.
- ✅ API endpoints for order validation and merging.
- ⬜ UI for sales order entry and review.
- *(Bonus)* JSON output, PDF generation, and operator agent.