import { useState } from 'react'
import './App.css'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import Orders from './pages/Order'
import Customers from './pages/Customers'
import type { Product } from './Types'
import type { Customer } from './pages/Customers'
import type { Order } from './pages/Order'

export type InventoryTransaction = {
  id: number
  productName: string
  sku: string
  type: 'Stock In' | 'Stock Out'
  quantity: number
  reason: string
  date: string
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Ice Cube Machine K40',
      sku: 'K40',
      price: 8500,
      stock: 12,
      threshold: 3,
    },
    {
      id: 2,
      name: 'Ice Cube Machine K60',
      sku: 'K60',
      price: 10500,
      stock: 5,
      threshold: 3,
    },
    {
      id: 3,
      name: 'Ice Cube Machine K125',
      sku: 'K125',
      price: 14500,
      stock: 2,
      threshold: 3,
    },
  ])

  const [transactions, setTransactions] = useState<
    InventoryTransaction[]
  >([])

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Ahmad',
      company: 'ABC Cafe',
      email: 'ahmad@abccafe.com',
      phone: '012-3456789',
    },
    {
      id: 2,
      name: 'John',
      company: 'XYZ Restaurant',
      email: 'john@xyzrestaurant.com',
      phone: '013-9876543',
    },
  ])

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1001,
      customer: 'ABC Cafe',
      product: 'Ice Cube Machine K40',
      productId: 1,
      quantity: 1,
      total: 8500,
      status: 'Pending',
      paymentStatus: 'Unpaid',
    },
    {
      id: 1002,
      customer: 'XYZ Restaurant',
      product: 'Ice Cube Machine K60',
      productId: 2,
      quantity: 2,
      total: 21000,
      status: 'Completed',
      paymentStatus: 'Paid',
    },
  ])

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <span>BO</span>

          <div>
            <strong>Business</strong>
            <small>Operations AI</small>
          </div>
        </div>

        <nav className="nav">

          <button
            className={`nav-item ${
              currentPage === 'dashboard' ? 'active' : ''
            }`}
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={`nav-item ${
              currentPage === 'products' ? 'active' : ''
            }`}
            onClick={() => setCurrentPage('products')}
          >
            Products
          </button>

          <button
            className={`nav-item ${
              currentPage === 'inventory' ? 'active' : ''
            }`}
            onClick={() => setCurrentPage('inventory')}
          >
            Inventory
          </button>

          <button
            className={`nav-item ${
              currentPage === 'orders' ? 'active' : ''
            }`}
            onClick={() => setCurrentPage('orders')}
          >
            Orders
          </button>

          <button
            className={`nav-item ${
              currentPage === 'customers' ? 'active' : ''
            }`}
            onClick={() => setCurrentPage('customers')}
          >
            Customers
          </button>

          <button
            className={`nav-item ${
              currentPage === 'ai-assistant'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setCurrentPage('ai-assistant')
            }
          >
            AI Assistant
          </button>

        </nav>

        <div className="sidebar-bottom">
          <div className="user">

            <div className="avatar">
              AD
            </div>

            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>

          </div>
        </div>

      </aside>

      {/* Main content */}
      <main className="main">

        {currentPage === 'products' ? (

          <Products
            products={products}
            setProducts={setProducts}
          />

        ) : currentPage === 'inventory' ? (

          <Inventory
            products={products}
            setProducts={setProducts}
            transactions={transactions}
            setTransactions={setTransactions}
          />

        ) : currentPage === 'orders' ? (

          <Orders
            products={products}
            setProducts={setProducts}
            customers={customers}
            orders={orders}
            setOrders={setOrders}
            setTransactions={setTransactions}
          />

        ) : currentPage === 'customers' ? (

          <Customers
            customers={customers}
            setCustomers={setCustomers}
          />

        ) : (

          <div className="dashboard">

            <header className="topbar">

              <div>
                <h1>Dashboard</h1>
                <p>
                  Overview of your business operations
                </p>
              </div>

              <button className="profile-button">
                Admin
              </button>

            </header>

            <section className="stats-grid">

              <div className="stat-card">
                <span>Total Sales</span>
                <strong>RM 12,450</strong>
                <small>This month</small>
              </div>

              <div className="stat-card">
                <span>Total Orders</span>
                <strong>38</strong>
                <small>This month</small>
              </div>

              <div className="stat-card">
                <span>Low Stock</span>
                <strong>5</strong>
                <small>
                  Products need attention
                </small>
              </div>

              <div className="stat-card">
                <span>Unpaid Orders</span>
                <strong>7</strong>
                <small>
                  Requires follow-up
                </small>
              </div>

            </section>

            <section className="dashboard-grid">

              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h2>Recent Orders</h2>
                    <p>
                      Latest business transactions
                    </p>
                  </div>

                </div>

                <p>
                  No recent orders yet.
                </p>

              </div>

              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h2>AI Assistant</h2>
                    <p>
                      Ask about your business data
                    </p>
                  </div>

                </div>

                <div className="ai-box">

                  <div className="ai-icon">
                    AI
                  </div>

                  <div>
                    <strong>
                      Business Operations AI
                    </strong>

                    <p>
                      Ask questions about products,
                      inventory, orders and customers.
                    </p>
                  </div>

                </div>

                <button className="ai-button">
                  Open AI Assistant
                </button>

              </div>

            </section>

          </div>

        )}

      </main>

    </div>
  )
}

export default App