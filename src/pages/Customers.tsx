import { useState } from 'react'
import { createRecordId } from '../Utils'

export type Customer = {
  id: number
  name: string
  company: string
  email: string
  phone: string
}

type CustomersProps = {
  customers: Customer[]
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
}

function Customers({
  customers,
  setCustomers,
}: CustomersProps) {
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  })

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.company} ${customer.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  function addCustomer() {
    if (
      !newCustomer.name ||
      !newCustomer.company ||
      !newCustomer.email ||
      !newCustomer.phone
    ) {
      alert('Please fill in all fields.')
      return
    }

    const customer: Customer = {
      id: createRecordId(),
      name: newCustomer.name,
      company: newCustomer.company,
      email: newCustomer.email,
      phone: newCustomer.phone,
    }

    setCustomers((previousCustomers) => [
      ...previousCustomers,
      customer,
    ])

    setNewCustomer({
      name: '',
      company: '',
      email: '',
      phone: '',
    })

    setShowForm(false)
  }

  function deleteCustomer(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this customer?'
    )

    if (!confirmed) return

    setCustomers((previousCustomers) =>
      previousCustomers.filter(
        (customer) => customer.id !== id
      )
    )
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Customers</h1>
          <p>
            Manage your customers and business contacts
          </p>
        </div>

        <button
          className="profile-button"
          onClick={() => setShowForm(true)}
        >
          + Add Customer
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
              Add Customer
            </h2>

            <input
              type="text"
              placeholder="Contact name"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Company name"
              value={newCustomer.company}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  company: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  email: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  phone: e.target.value,
                })
              }
            />

            <div style={{ marginTop: '15px' }}>
              <button
                className="ai-button"
                onClick={addCustomer}
              >
                Add Customer
              </button>

              <button
                className="profile-button"
                onClick={() => setShowForm(false)}
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
            placeholder="Search customers..."
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
            <span>Contact</span>
            <span>Company</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Actions</span>
          </div>

          {filteredCustomers.map((customer) => (
            <div
              className="table-row"
              key={customer.id}
            >
              <span>{customer.name}</span>

              <span>{customer.company}</span>

              <span>{customer.email}</span>

              <span>{customer.phone}</span>

              <span>
                <button
                  className="delete-button"
                  onClick={() =>
                    deleteCustomer(customer.id)
                  }
                >
                  Delete
                </button>
              </span>
            </div>
          ))}

          {filteredCustomers.length === 0 && (
            <div
              style={{
                padding: '30px',
                textAlign: 'center',
              }}
            >
              No customers found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Customers
