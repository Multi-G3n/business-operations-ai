
import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Product } from '../Types'

type ProductsProps = {
  products: Product[]
  setProducts: Dispatch<SetStateAction<Product[]>>
}

function Products({
  products,
  setProducts,
}: ProductsProps) {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
  })

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.sku}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  function deleteProduct(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmed) return

    setProducts(
      products.filter((product) => product.id !== id)
    )
  }

  function editProduct(id: number) {
    const product = products.find(
      (item) => item.id === id
    )

    if (!product) return

    setNewProduct({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      stock: String(product.stock),
    })

    setEditingProductId(product.id)
    setShowForm(true)
  }

  function addProduct() {
    const name = newProduct.name.trim()
    const sku = newProduct.sku.trim()
    const price = Number(newProduct.price)
    const stock = Number(newProduct.stock)

    if (!name || !sku || newProduct.price === '' || newProduct.stock === '') {
      alert('Please fill in all fields.')
      return
    }

    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      alert('Price must be zero or more, and stock must be a whole number zero or more.')
      return
    }

    if (editingProductId !== null) {
      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product.id === editingProductId
            ? { ...product, name, sku, price, stock }
            : product
        )
      )
    } else {
      const product: Product = {
        id: Date.now(),
        name,
        sku,
        price,
        stock,
        threshold: 3,
      }

      setProducts((previousProducts) => [...previousProducts, product])
    }

    resetForm()
  }

  function resetForm() {
    setNewProduct({
      name: '',
      sku: '',
      price: '',
      stock: '',
    })
    setEditingProductId(null)
    setShowForm(false)
  }

  return (
    <div>

      <div className="topbar">

        <div>
          <h1>Products</h1>
          <p>
            Manage your products and stock information
          </p>
        </div>

        <button
          className="profile-button"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Add Product
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
              {editingProductId === null ? 'Add Product' : 'Edit Product'}
            </h2>

            <input
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="SKU"
              value={newProduct.sku}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  sku: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Stock quantity"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  stock: e.target.value,
                })
              }
            />

            <div style={{ marginTop: '15px' }}>

              <button
                className="ai-button"
                onClick={addProduct}
              >
                {editingProductId === null ? 'Add Product' : 'Save Changes'}
              </button>

              <button
                className="profile-button"
                onClick={resetForm}
                style={{ marginLeft: '10px' }}
              >
                Cancel
              </button>

            </div>

          </div>
        )}

        <div style={{ marginBottom: '20px' }}>

          <input
            type="text"
            placeholder="Search products..."
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

        <div className="table">

          <div className="table-row table-header">
            <span>Product</span>
            <span>SKU</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Actions</span>
          </div>

          {filteredProducts.map((product) => (
            <div
              className="table-row"
              key={product.id}
            >

              <span>
                {product.name}
              </span>

              <span>
                {product.sku}
              </span>

              <span>
                RM {product.price.toLocaleString()}
              </span>

              <span>
                {product.stock <= product.threshold ? (
                  <span className="status pending">
                    Low Stock ({product.stock})
                  </span>
                ) : (
                  <span className="status completed">
                    {product.stock}
                  </span>
                )}
              </span>

              <span>

                <button
                  className="profile-button"
                  onClick={() =>
                    editProduct(product.id)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteProduct(product.id)
                  }
                >
                  Delete
                </button>

              </span>

            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div
              style={{
                padding: '30px',
                textAlign: 'center',
              }}
            >
              No products found.
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default Products
