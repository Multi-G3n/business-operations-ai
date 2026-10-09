import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Product } from '../Types'
import type { Customer } from './Customers'
import type { InventoryTransaction } from '../App'

export type Order = {
  id: number
  customer: string
  product: string
  productId: number
  quantity: number
  total: number
  status: 'Pending' | 'Completed' | 'Cancelled'
  paymentStatus: 'Paid' | 'Unpaid'
}

type OrderProps = {
  products: Product[]
  setProducts: Dispatch<SetStateAction<Product[]>>
  customers: Customer[]
  orders: Order[]
  setOrders: Dispatch<SetStateAction<Order[]>>
  setTransactions: Dispatch<
    SetStateAction<InventoryTransaction[]>
  >
}

function Orders({
  products,
  setProducts,
  customers,
  orders,
  setOrders,
  setTransactions,
}: OrderProps) {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [newOrder, setNewOrder] = useState({
    customer: '',
    productId: '',
    quantity: '1',
    paymentStatus: 'Unpaid',
  })

  const selectedProduct = products.find(
    (product) =>
      product.id === Number(newOrder.productId)
  )

  const orderTotal = selectedProduct
    ? selectedProduct.price *
      Number(newOrder.quantity || 0)
    : 0

  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.product}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  function createOrder() {
    if (
      !newOrder.customer ||
      !newOrder.productId ||
      !newOrder.quantity
    ) {
      alert('Please fill in all fields.')
      return
    }

    const quantity = Number(newOrder.quantity)

    if (quantity <= 0) {
      alert('Quantity must be greater than 0.')
      return
    }

    const product = products.find(
      (item) =>
        item.id === Number(newOrder.productId)
    )

    if (!product) {
      alert('Product not found.')
      return
    }

    if (quantity > product.stock) {
      alert(
        `Not enough stock. Available stock: ${product.stock}`
      )
      return
    }

    const order: Order = {
      id: Date.now(),
      customer: newOrder.customer,
      product: product.name,
      productId: product.id,
      quantity,
      total: product.price * quantity,
      status: 'Pending',
      paymentStatus:
        newOrder.paymentStatus as 'Paid' | 'Unpaid',
    }

    setOrders((previousOrders) => [
      order,
      ...previousOrders,
    ])

    setProducts((previousProducts) =>
      previousProducts.map((item) =>
        item.id === product.id
          ? {
              ...item,
              stock: item.stock - quantity,
            }
          : item
      )
    )

    setTransactions((previousTransactions) => [
      {
        id: Date.now(),
        productName: product.name,
        sku: product.sku,
        type: 'Stock Out',
        quantity,
        reason: `Order #${order.id}`,
        date: new Date().toLocaleString(),
      },
      ...previousTransactions,
    ])

    setNewOrder({
      customer: '',
      productId: '',
      quantity: '1',
      paymentStatus: 'Unpaid',
    })

    setShowForm(false)

    alert('Order created successfully.')
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Orders</h1>
          <p>
            Manage customer orders and payments
          </p>
        </div>

        <button
          className="profile-button"
          onClick={() => setShowForm(true)}
        >
          + Create Order
        </button>
      </div>

      <div className="panel">

        {showForm && (
          <div
            style={{
              marginBottom: '24px',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e5e9ef',
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Create Order
            </h2>

            {/* Customer */}
            <select
              value={newOrder.customer}
              onChange={(e) =>
                setNewOrder({
                  ...newOrder,
                  customer: e.target.value,
                })
              }
              style={{
                width: '100%',
                padding: '11px',
                marginBottom: '12px',
                border: '1px solid #dce1e8',
                borderRadius: '8px',
              }}
            >
              <option value="">
                Select customer
              </option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.company}
                >
                  {customer.company} — {customer.name}
                </option>
              ))}
            </select>

            {/* Product */}
            <select
              value={newOrder.productId}
              onChange={(e) =>
                setNewOrder({
                  ...newOrder,
                  productId: e.target.value,
                })
              }
              style={{
                width: '100%',
                padding: '11px',
                marginBottom: '12px',
                border: '1px solid #dce1e8',
                borderRadius: '8px',
              }}
            >
              <option value="">
                Select product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} — RM{' '}
                  {product.price.toLocaleString()} (
                  {product.stock} in stock)
                </option>
              ))}
            </select>

            {/* Quantity */}
            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={newOrder.quantity}
              onChange={(e) =>
                setNewOrder({
                  ...newOrder,
                  quantity: e.target.value,
                })
              }
            />

            {/* Payment Status */}
            <select
              value={newOrder.paymentStatus}
              onChange={(e) =>
                setNewOrder({
                  ...newOrder,
                  paymentStatus: e.target.value,
                })
              }
              style={{
                width: '100%',
                padding: '11px',
                marginBottom: '12px',
                border: '1px solid #dce1e8',
                borderRadius: '8px',
              }}
            >
              <option value="Unpaid">
                Unpaid
              </option>

              <option value="Paid">
                Paid
              </option>
            </select>

            {/* Order Total */}
            <div
              style={{
                padding: '15px',
                marginBottom: '15px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e9ef',
              }}
            >
              <strong>Order Total</strong>

              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  marginTop: '5px',
                }}
              >
                RM {orderTotal.toLocaleString()}
              </div>
            </div>

            {/* Create */}
            <button
              className="ai-button"
              onClick={createOrder}
            >
              Create Order
            </button>

            {/* Cancel */}
            <button
              className="profile-button"
              onClick={() => setShowForm(false)}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #dce1e8',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          />
        </div>

        {/* Orders Table */}
        <div className="table">

          <div className="table-row table-header">
            <span>Order</span>
            <span>Customer</span>
            <span>Product</span>
            <span>Total</span>
            <span>Status</span>
            <span>Payment</span>
          </div>

          {filteredOrders.map((order) => (
            <div
              className="table-row"
              key={order.id}
            >
              <span>
                #{order.id}
              </span>

              <span>
                {order.customer}
              </span>

              <span>
                {order.product}
                <br />
                <small>
                  Qty: {order.quantity}
                </small>
              </span>

              <span>
                RM {order.total.toLocaleString()}
              </span>

              <span>
                {order.status === 'Completed' ? (
                  <span className="status completed">
                    Completed
                  </span>
                ) : (
                  <span className="status pending">
                    {order.status}
                  </span>
                )}
              </span>

              <span>
                {order.paymentStatus === 'Paid' ? (
                  <span className="status completed">
                    Paid
                  </span>
                ) : (
                  <span className="status pending">
                    Unpaid
                  </span>
                )}
              </span>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div
              style={{
                padding: '30px',
                textAlign: 'center',
              }}
            >
              No orders found.
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Orders