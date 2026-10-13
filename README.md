# EquipFlow Business Operations Demo

A front-end demonstration for Malaysian equipment distributors. It includes an enquiry pipeline with follow-ups, plus product, inventory, transaction history, order and customer screens.

The app uses fictional sample data and saves changes in the current browser with `localStorage`. It does not use a backend, shared database, AI service, email or messaging integration. Use non-sensitive demo information only.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Available scripts

- `npm run dev` starts the development server.
- `npm run lint` checks the code with ESLint.
- `npm run build` runs the TypeScript project checks and creates a production build.
- `npm run preview` serves the production build locally.

## Enquiries

Open **Enquiries** from the left navigation (or the top navigation on a narrow screen). The dashboard shows total and new enquiries, follow-ups due, and quotations pending. Search across customer, company, contact and product details, or filter by status and equipment category. Use **Add enquiry** to create a record; select a customer name to view its details. The row buttons edit or delete an enquiry, and deletion asks for confirmation.

The form requires customer and company names, a valid email, phone, equipment category, product/model, positive whole-number quantity, delivery location, received date and salesperson. Follow-up dates earlier than the received date are rejected.

## Demo data

The first run loads fictional distributor sample records. Enquiries, products, customers, orders and inventory transactions are stored separately in this browser. Clearing the site's local storage resets those records to their sample defaults. Data is not shared between devices or users.
