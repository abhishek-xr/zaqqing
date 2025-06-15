# Smart Order MVP

## **Overview**
Smart Order MVP is a local tool designed to parse unstructured email orders, validate them against a product catalog, and merge them into a structured sales order. It includes APIs for order validation, merging, and product catalog management, along with a database-backed system for tracking orders and products.

---

## **Features**
- **Email Parsing**: Extract SKUs, quantities, and delivery details from raw email text.
- **Order Validation**: Check SKUs against the product catalog, enforce minimum order quantities (MOQ), and validate stock availability.
- **Order Merging**: Combine multiple orders into a single consolidated order.
- **Product Catalog Management**: Load and manage product data from a CSV file.
- **API Endpoints**:
  - `POST /api/orders/validate`: Validate parsed orders.
  - `POST /api/orders/merge`: Merge multiple orders into one.
  - `GET /api/products`: Fetch the product catalog.

---

## **Installation**

### **1. Prerequisites**
- **Node.js** (v16 or later)
- **PostgreSQL** (Ensure it is running locally or accessible remotely)
- **Docker** (Optional, for containerized setup)

### **2. Clone the Repository**
```bash
git clone 
cd smart-order-mvp
```

### **3. Install Dependencies**
```bash
npm install
```

### **4. Configure Environment Variables**
Create a `.env` file in the root directory and set the `DATABASE_URL`:
```
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"
```

### **5. Set Up the Database**
Run the following commands to apply migrations and seed the database:
```bash
npx prisma migrate deploy
npx ts-node scripts/loadProducts.ts
```

### **6. Start the Server**
Run the server locally:
```bash
npx ts-node src/server/index.ts
```
The server will start on `http://localhost:3000`.

---

## **Usage**

### **1. Validate an Order**
Send a `POST` request to `/api/orders/validate` with the email text:
```bash
curl -X POST http://localhost:3000/api/orders/validate \
-H "Content-Type: application/json" \
-d '{
  "emailText": "2 x Desk TRÄNHOLM 19\n5 x Dining FJÄRDAL 292\nShip to: 45 Königstraße, Stuttgart, Germany\nRequested delivery date: July 1, 2025"
}'
```

### **2. Merge Orders**
Send a `POST` request to `/api/orders/merge` with the order IDs:
```bash
curl -X POST http://localhost:3000/api/orders/merge \
-H "Content-Type: application/json" \
-d '{
  "orderIds": ["order-id-1", "order-id-2"],
  "customerName": "John Doe",
  "deliveryDate": "2025-07-01",
  "deliveryAddress": "45 Königstraße, Stuttgart, Germany"
}'
```

### **3. Fetch Product Catalog**
Send a `GET` request to `/api/products`:
```bash
curl -X GET http://localhost:3000/api/products
```

---

## **Docker Setup (Optional)**
To run the project in a containerized environment:
1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
2. Access the server at `http://localhost:3000`.

---

## **Project Structure**
```
smart-order-mvp/
├── prisma/                 # Database schema and migrations
├── scripts/                # Utility scripts (e.g., loadProducts.ts)
├── src/
│   ├── app/                # Frontend components (UI)
│   ├── server/             # Backend logic
│   │   ├── routers/        # API routes
│   │   └── utils/          # Utility functions (e.g., email parsing, validation)
├── .env                    # Environment variables
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## **Contributing**
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description of your changes.

---

## **License**
This project is licensed under the MIT License.
