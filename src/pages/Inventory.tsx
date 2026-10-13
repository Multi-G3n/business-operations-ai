
import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Product } from '../Types'
import type { InventoryTransaction } from '../App'
import { createRecordId, currentDateTime } from '../Utils'

type InventoryProps = {
  products: Product[]
  setProducts: Dispatch<SetStateAction<Product[]>>
  transactions: InventoryTransaction[]
  setTransactions: Dispatch<SetStateAction<InventoryTransaction[]>>
}

function Inventory({
  products,
  setProducts,
  transactions,
  setTransactions,
}: InventoryProps) {
  
  const [search, setSearch] = useState('')
  const [showAdjustment, setShowAdjustment] = useState(false)

  const [adjustment, setAdjustment] = useState({
    productId: '',
    type: 'in',
    quantity: '',
    reason: '',
  })

  const filteredInventory = products.filter((item) =>
    `${item.name} ${item.sku}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  function adjustStock(id: number, amount: number) {
    const product = products.find(
      (item) => item.id === id
    )

    if (!product) return

    if (amount < 0 && product.stock === 0) {
      alert('Stock cannot go below 0.')
      return
    }

    setProducts(
      products.map((item) =>
        item.id === id
          ? {
              ...item,
              stock: Math.max(
                0,
                item.stock + amount
              ),
            }
          : item
      )
    )

    const transaction: InventoryTransaction = {
      id: createRecordId(),
      productName: product.name,
      sku: product.sku,
      type: amount > 0 ? 'Stock In' : 'Stock Out',
      quantity: Math.abs(amount),
      reason: 'Quick adjustment',
      date: currentDateTime(),
    }

    setTransactions(
      (previousTransactions) => [
        transaction,
        ...previousTransactions,
      ]
    )
  }

  function submitAdjustment() {
    if (
      !adjustment.productId ||
      !adjustment.quantity ||
      !adjustment.reason
    ) {
      alert('Please fill in all fields.')
      return
    }

    const quantity = Number(
      adjustment.quantity
    )

    if (quantity <= 0) {
      alert('Quantity must be greater than 0.')
      return
    }

    const selectedProduct = products.find(
      (item) =>
        item.id === Number(
          adjustment.productId
        )
    )

    if (!selectedProduct) {
      alert('Product not found.')
      return
    }

    if (
      adjustment.type === 'out' &&
      quantity > selectedProduct.stock
    ) {
      alert(
        `Cannot remove ${quantity} units. Current stock is ${selectedProduct.stock}.`
      )
      return
    }

    const amount =
      adjustment.type === 'in'
        ? quantity
        : -quantity

    setProducts(
      products.map((item) =>
        item.id === selectedProduct.id
          ? {
              ...item,
              stock: item.stock + amount,
            }
          : item
      )
    )

    const transaction: InventoryTransaction = {
      id: createRecordId(),
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      type:
        adjustment.type === 'in'
          ? 'Stock In'
          : 'Stock Out',
      quantity,
      reason: adjustment.reason,
      date: currentDateTime(),
    }

    setTransactions(
      (previousTransactions) => [
        transaction,
        ...previousTransactions,
      ]
    )

    setAdjustment({
      productId: '',
      type: 'in',
      quantity: '',
      reason: '',
    })

    setShowAdjustment(false)
  }

  return (
    <div>

      <div className="topbar">

        <div>
          <h1>Inventory</h1>
          <p>
            Monitor and adjust product stock
          </p>
        </div>

        <button
          className="profile-button"
          onClick={() =>
            setShowAdjustment(true)
          }
        >
          + Stock Adjustment
        </button>

      </div>

      <div className="panel">

        {showAdjustment && (
          <div
            style={{
              marginBottom: '24px',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '10px',
              border:
                '1px solid #e5e9ef',
            }}
          >

            <h2 style={{ marginTop: 0 }}>
              Stock Adjustment
            </h2>

            <select
              value={adjustment.productId}
              onChange={(e) =>
                setAdjustment({
                  ...adjustment,
                  productId:
                    e.target.value,
                })
              }
              style={{
                width: '100%',
                padding: '11px',
                marginBottom: '12px',
                border:
                  '1px solid #dce1e8',
                borderRadius: '8px',
              }}
            >

              <option value="">
                Select product
              </option>

              {products.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name} ({item.sku})
                </option>
              ))}

            </select>

            <select
              value={adjustment.type}
              onChange={(e) =>
                setAdjustment({
                  ...adjustment,
                  type: e.target.value,
                })
              }
              style={{
                width: '100%',
                padding: '11px',
                marginBottom: '12px',
                border:
                  '1px solid #dce1e8',
                borderRadius: '8px',
              }}
            >

              <option value="in">
                Stock In
              </option>

              <option value="out">
                Stock Out
              </option>

            </select>

            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={adjustment.quantity}
              onChange={(e) =>
                setAdjustment({
                  ...adjustment,
                  quantity:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Reason"
              value={adjustment.reason}
              onChange={(e) =>
                setAdjustment({
                  ...adjustment,
                  reason:
                    e.target.value,
                })
              }
            />

            <div
              style={{
                marginTop: '15px',
              }}
            >

              <button
                className="ai-button"
                onClick={
                  submitAdjustment
                }
              >
                Apply Adjustment
              </button>

              <button
                className="profile-button"
                onClick={() =>
                  setShowAdjustment(false)
                }
                style={{
                  marginLeft: '10px',
                }}
              >
                Cancel
              </button>

            </div>

          </div>
        )}

        <div
          style={{
            marginBottom: '20px',
          }}
        >

          <input
            type="text"
            placeholder="Search inventory..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            style={{
              width: '100%',
              padding: '12px',
              border:
                '1px solid #dce1e8',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          />

        </div>

        <div className="table">

          <div className="table-row table-header">
            <span>Product</span>
            <span>SKU</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filteredInventory.map(
            (item) => (
              <div
                className="table-row"
                key={item.id}
              >

                <span>
                  {item.name}
                </span>

                <span>
                  {item.sku}
                </span>

                <span>
                  {item.stock}
                </span>

                <span>
                  {item.stock <=
                  item.threshold ? (
                    <span className="status pending">
                      Low Stock
                    </span>
                  ) : (
                    <span className="status completed">
                      In Stock
                    </span>
                  )}
                </span>

                <span>

                  <button
                    className="profile-button"
                    onClick={() =>
                      adjustStock(
                        item.id,
                        -1
                      )
                    }
                  >
                    −
                  </button>

                  <button
                    className="profile-button"
                    onClick={() =>
                      adjustStock(
                        item.id,
                        1
                      )
                    }
                    style={{
                      marginLeft: '8px',
                    }}
                  >
                    +
                  </button>

                </span>

              </div>
            )
          )}

          {filteredInventory.length ===
            0 && (
            <div
              style={{
                padding: '30px',
                textAlign: 'center',
              }}
            >
              No inventory found.
            </div>
          )}

        </div>

      </div>

      <div
        className="panel"
        style={{
          marginTop: '24px',
        }}
      >

        <div className="panel-header">

          <div>
            <h2>
              Inventory Transactions
            </h2>

            <p>
              Recent stock adjustments
            </p>
          </div>

        </div>

        {transactions.length === 0 ? (

          <p>
            No inventory transactions yet.
          </p>

        ) : (

          <div className="table">

            <div className="table-row table-header">
              <span>Product</span>
              <span>Type</span>
              <span>Quantity</span>
              <span>Reason</span>
              <span>Date</span>
            </div>

            {transactions.map(
              (transaction) => (
                <div
                  className="table-row"
                  key={transaction.id}
                >

                  <span>
                    {
                      transaction.productName
                    }
                  </span>

                  <span>
                    {
                      transaction.type ===
                      'Stock In' ? (
                        <span className="status completed">
                          Stock In
                        </span>
                      ) : (
                        <span className="status pending">
                          Stock Out
                        </span>
                      )
                    }
                  </span>

                  <span>
                    {
                      transaction.quantity
                    }
                  </span>

                  <span>
                    {
                      transaction.reason
                    }
                  </span>

                  <span>
                    {
                      transaction.date
                    }
                  </span>

                </div>
              )
            )}

          </div>

        )}

      </div>

    </div>
  )
}

export default Inventory
