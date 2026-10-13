import { useEffect, useState } from 'react'
import './App.css'
import type { Enquiry, Product } from './Types'
import Customers from './pages/Customers'
import Enquiries, { StatusBadge } from './pages/Enquiries'
import Inventory from './pages/Inventory'
import Orders, { type Order } from './pages/Order'
import Products from './pages/Products'
import type { Customer } from './pages/Customers'
import { localDateOffset } from './Utils'

export type InventoryTransaction = {
  id: number
  productName: string
  sku: string
  type: 'Stock In' | 'Stock Out'
  quantity: number
  reason: string
  date: string
}

type Section = 'Overview' | 'Enquiries' | 'Products' | 'Inventory' | 'Orders' | 'Customers'

const starterProducts: Product[] = [
  { id: 101, name: 'Komatsu PC30MR-5 Mini Excavator', sku: 'KOM-PC30MR5', price: 128000, stock: 3, threshold: 2 },
  { id: 102, name: 'Kubota U55-4 Mini Excavator', sku: 'KUB-U55-4', price: 186000, stock: 2, threshold: 2 },
  { id: 103, name: 'JLG 450AJ Articulating Boom Lift', sku: 'JLG-450AJ', price: 298000, stock: 1, threshold: 2 },
  { id: 104, name: 'Atlas Copco XAS 88 Compressor', sku: 'ATC-XAS88', price: 38500, stock: 7, threshold: 3 },
  { id: 105, name: 'Husqvarna K770 Cut-off Saw', sku: 'HUS-K770', price: 4650, stock: 12, threshold: 4 },
]

const starterCustomers: Customer[] = [
  { id: 201, name: 'Farid Rahman', company: 'Bina Teguh Construction Sdn Bhd', email: 'farid@binateguh.example', phone: '+60 12-345 6789' },
  { id: 202, name: 'Mei Ling Tan', company: 'Maju Infra Works Sdn Bhd', email: 'meiling@majuinfra.example', phone: '+60 16-234 5678' },
  { id: 203, name: 'Arun Kumar', company: 'Eastline Engineering Sdn Bhd', email: 'arun@eastline.example', phone: '+60 19-876 5432' },
]

const starterEnquiries: Enquiry[] = [
  { id: 301, customerName: 'Farid Rahman', companyName: 'Bina Teguh Construction Sdn Bhd', email: 'farid@binateguh.example', phone: '+60 12-345 6789', equipmentCategory: 'Excavators', productModel: 'Komatsu PC30MR-5', quantity: 1, deliveryLocation: 'Shah Alam, Selangor', requirements: 'Rubber tracks preferred. Please include transport and a 3-year service package in the quotation.', dateReceived: localDateOffset(-2), status: 'New', assignedSalesperson: 'Aina Zulkifli', nextFollowUpDate: localDateOffset(0) },
  { id: 302, customerName: 'Mei Ling Tan', companyName: 'Maju Infra Works Sdn Bhd', email: 'meiling@majuinfra.example', phone: '+60 16-234 5678', equipmentCategory: 'Access Equipment', productModel: 'JLG 450AJ', quantity: 2, deliveryLocation: 'Johor Bahru, Johor', requirements: 'For a commercial building project. Need delivery by end of November and operator training.', dateReceived: localDateOffset(-5), status: 'Quotation Pending', assignedSalesperson: 'Daniel Lim', nextFollowUpDate: localDateOffset(1) },
  { id: 303, customerName: 'Arun Kumar', companyName: 'Eastline Engineering Sdn Bhd', email: 'arun@eastline.example', phone: '+60 19-876 5432', equipmentCategory: 'Air Compressors', productModel: 'Atlas Copco XAS 88', quantity: 3, deliveryLocation: 'Kuantan, Pahang', requirements: 'Please confirm operating hours, warranty coverage and scheduled maintenance options.', dateReceived: localDateOffset(-8), status: 'Quotation Sent', assignedSalesperson: 'Aina Zulkifli', nextFollowUpDate: localDateOffset(-1) },
  { id: 304, customerName: 'Nurul Huda Ismail', companyName: 'Cekap Precast Industries Sdn Bhd', email: 'nurul@cekaprecast.example', phone: '+60 13-555 0142', equipmentCategory: 'Concrete Equipment', productModel: 'Concrete batching plant, 60 m³/hr', quantity: 1, deliveryLocation: 'Batu Pahat, Johor', requirements: 'Looking for installation, commissioning and a preventive maintenance proposal.', dateReceived: localDateOffset(-1), status: 'Contacted', assignedSalesperson: 'Daniel Lim', nextFollowUpDate: localDateOffset(3) },
  { id: 305, customerName: 'Jason Wong', companyName: 'Northport Facilities Sdn Bhd', email: 'jason@northport.example', phone: '+60 17-440 2266', equipmentCategory: 'Generators', productModel: '100 kVA silent diesel generator', quantity: 2, deliveryLocation: 'Port Klang, Selangor', requirements: 'Indoor installation. Please advise on ATS compatibility and after-sales support.', dateReceived: localDateOffset(-12), status: 'Won', assignedSalesperson: 'Aina Zulkifli', nextFollowUpDate: '' },
  { id: 306, customerName: 'Siti Aminah', companyName: 'Seri Murni Landscaping Sdn Bhd', email: 'siti@serimurni.example', phone: '+60 11-2020 8831', equipmentCategory: 'Excavators', productModel: 'Kubota U55-4', quantity: 1, deliveryLocation: 'Ipoh, Perak', requirements: 'Interested in available units and finance options for a small landscaping team.', dateReceived: localDateOffset(-4), status: 'Lost', assignedSalesperson: 'Daniel Lim', nextFollowUpDate: '' },
]

const starterTransactions: InventoryTransaction[] = [
  { id: 401, productName: 'Atlas Copco XAS 88 Compressor', sku: 'ATC-XAS88', type: 'Stock In', quantity: 2, reason: 'Demo stock received', date: new Date().toLocaleString() },
]

const invalidStorageKeys = new Set<string>()

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function hasStringFields(value: unknown, fields: string[]) {
  return isObject(value) && fields.every((field) => typeof value[field] === 'string')
}

function isCollection<T>(value: unknown, isItem: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(isItem)
}

function isProduct(value: unknown): value is Product {
  return hasStringFields(value, ['name', 'sku']) && isObject(value) && isNumber(value.id) && isNumber(value.price) && isNumber(value.stock) && isNumber(value.threshold)
}

function isCustomer(value: unknown): value is Customer {
  return hasStringFields(value, ['name', 'company', 'email', 'phone']) && isObject(value) && isNumber(value.id)
}

function isOrder(value: unknown): value is Order {
  return hasStringFields(value, ['customer', 'product', 'status', 'paymentStatus']) && isObject(value) && isNumber(value.id) && isNumber(value.productId) && isNumber(value.quantity) && isNumber(value.total) && ['Pending', 'Completed', 'Cancelled'].includes(String(value.status)) && ['Paid', 'Unpaid'].includes(String(value.paymentStatus))
}

function isTransaction(value: unknown): value is InventoryTransaction {
  return hasStringFields(value, ['productName', 'sku', 'type', 'reason', 'date']) && isObject(value) && isNumber(value.id) && isNumber(value.quantity) && ['Stock In', 'Stock Out'].includes(String(value.type))
}

function isEnquiry(value: unknown): value is Enquiry {
  return hasStringFields(value, ['customerName', 'companyName', 'email', 'phone', 'equipmentCategory', 'productModel', 'deliveryLocation', 'requirements', 'dateReceived', 'status', 'assignedSalesperson', 'nextFollowUpDate']) && isObject(value) && isNumber(value.id) && Number.isInteger(value.quantity) && Number(value.quantity) > 0 && ['New', 'Contacted', 'Quotation Pending', 'Quotation Sent', 'Won', 'Lost'].includes(String(value.status))
}

function loadDemoData<T,>(key: string, fallback: T, isValid: (value: unknown) => value is T): T {
  try {
    const stored = window.localStorage.getItem(key)
    if (!stored) return fallback
    const parsed: unknown = JSON.parse(stored)
    if (isValid(parsed)) return parsed
    invalidStorageKeys.add(key)
    console.error(`Saved demo data for "${key}" has an unexpected format. Sample data will be used.`)
  } catch (error) {
    invalidStorageKeys.add(key)
    console.error(`Could not read saved demo data for "${key}". Sample data will be used.`, error)
  }
  return fallback
}

function persistDemoData(key: string, value: unknown) {
  if (invalidStorageKeys.has(key)) {
    window.dispatchEvent(new Event('demo-storage-error'))
    return
  }
  window.localStorage.setItem(key, JSON.stringify(value))
}

const sections: Section[] = ['Overview', 'Enquiries', 'Products', 'Inventory', 'Orders', 'Customers']

function App() {
  const [section, setSection] = useState<Section>('Enquiries')
  const [products, setProducts] = useState(() => loadDemoData('business-operations.products', starterProducts, (value): value is Product[] => isCollection(value, isProduct)))
  const [customers, setCustomers] = useState(() => loadDemoData('business-operations.customers', starterCustomers, (value): value is Customer[] => isCollection(value, isCustomer)))
  const [orders, setOrders] = useState(() => loadDemoData<Order[]>('business-operations.orders', [], (value): value is Order[] => isCollection(value, isOrder)))
  const [transactions, setTransactions] = useState(() => loadDemoData('business-operations.transactions', starterTransactions, (value): value is InventoryTransaction[] => isCollection(value, isTransaction)))
  const [enquiries, setEnquiries] = useState(() => loadDemoData('business-operations.enquiries', starterEnquiries, (value): value is Enquiry[] => isCollection(value, isEnquiry)))
  const [persistenceError, setPersistenceError] = useState(false)

  useEffect(() => {
    const reportFailure = () => setPersistenceError(true)
    window.addEventListener('demo-storage-error', reportFailure)
    return () => window.removeEventListener('demo-storage-error', reportFailure)
  }, [])

  useEffect(() => {
    try {
      persistDemoData('business-operations.products', products)
      persistDemoData('business-operations.customers', customers)
      persistDemoData('business-operations.orders', orders)
      persistDemoData('business-operations.transactions', transactions)
      persistDemoData('business-operations.enquiries', enquiries)
    } catch (error) {
      console.error('Could not save demo data in this browser.', error)
      window.dispatchEvent(new Event('demo-storage-error'))
    }
  }, [products, customers, orders, transactions, enquiries])

  const content = section === 'Enquiries' ? <Enquiries enquiries={enquiries} setEnquiries={setEnquiries} />
    : section === 'Products' ? <Products products={products} setProducts={setProducts} />
      : section === 'Inventory' ? <Inventory products={products} setProducts={setProducts} transactions={transactions} setTransactions={setTransactions} />
        : section === 'Orders' ? <Orders products={products} setProducts={setProducts} customers={customers} orders={orders} setOrders={setOrders} setTransactions={setTransactions} />
          : section === 'Customers' ? <Customers customers={customers} setCustomers={setCustomers} />
            : <Overview enquiries={enquiries} products={products} orders={orders} onNavigate={setSection} />

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="app-brand" href="#overview" onClick={(event) => { event.preventDefault(); setSection('Overview') }}>
          <span className="brand-icon">E</span>
          <span>Equip<span>Flow</span><small>BUSINESS OPERATIONS</small></span>
        </a>
        <p className="nav-label">WORKSPACE</p>
        <nav className="main-nav" aria-label="Main navigation">
          {sections.map((item) => <button key={item} className={`nav-link ${section === item ? 'active' : ''}`} onClick={() => setSection(item)} aria-current={section === item ? 'page' : undefined}>
            <span className="nav-symbol" aria-hidden="true">{({ Overview: '⌂', Enquiries: '▤', Products: '▦', Inventory: '▥', Orders: '▧', Customers: '♙' } as Record<Section, string>)[item]}</span>{item}
            {item === 'Enquiries' && <span className="nav-count">{enquiries.length}</span>}
          </button>)}
        </nav>
        <div className="sidebar-note"><span className="demo-indicator" />DEMO WORKSPACE<small>Sample data is saved in this browser.</small></div>
      </aside>
      <main className="main-area">
        <header className="app-topbar"><div><span className="topbar-kicker">EQUIPFLOW / {section.toUpperCase()}</span><h1>{section === 'Overview' ? 'Overview' : section}</h1></div><div className="topbar-user"><span className="avatar">AS</span><span>Aina Zulkifli<small>Sales team</small></span></div></header>
        <div className="page-content">{persistenceError && <p className="storage-warning" role="status">Some saved data could not be read or browser storage is unavailable. Changes may not persist; details are in the browser console.</p>}{content}</div>
        <footer className="app-footer">EquipFlow demo <span>•</span> Built for Malaysian equipment distributors</footer>
      </main>
    </div>
  )
}

function Overview({ enquiries, products, orders, onNavigate }: { enquiries: Enquiry[]; products: Product[]; orders: Order[]; onNavigate: (section: Section) => void }) {
  const newLeads = enquiries.filter((item) => item.status === 'New').length
  const due = enquiries.filter((item) => item.nextFollowUpDate && item.nextFollowUpDate <= localDateOffset() && !['Won', 'Lost'].includes(item.status)).length
  return <section className="overview-page">
    <div className="page-intro"><div><p className="eyebrow">YOUR SALES WORKSPACE</p><h2>Good morning, Aina</h2><p>Here’s what’s happening across your equipment business.</p></div><button className="primary-button" onClick={() => onNavigate('Enquiries')}>＋ View enquiries</button></div>
    <div className="metric-grid">
      <Metric label="Total enquiries" value={enquiries.length} note="Across all lead stages" icon="▤" />
      <Metric label="New enquiries" value={newLeads} note="Ready for first contact" icon="✳" />
      <Metric label="Follow-ups due" value={due} note="Needs attention today" icon="◷" />
      <Metric label="Products in catalogue" value={products.length} note={`${products.filter((item) => item.stock <= item.threshold).length} at low stock`} icon="▦" />
    </div>
    <div className="overview-grid"><section className="panel"><div className="panel-heading"><div><h3>Recent enquiries</h3><p>Your latest customer opportunities</p></div><button className="text-button" onClick={() => onNavigate('Enquiries')}>View all →</button></div>
      {enquiries.slice(0, 4).map((item) => <button className="recent-enquiry" key={item.id} onClick={() => onNavigate('Enquiries')}><span className="company-avatar">{item.companyName.slice(0, 1)}</span><span className="recent-copy"><strong>{item.companyName}</strong><small>{item.productModel} · {item.customerName}</small></span><StatusBadge status={item.status} /></button>)}
    </section><section className="panel overview-side"><div className="panel-heading"><div><h3>Quick overview</h3><p>Operations at a glance</p></div></div><button className="overview-link" onClick={() => onNavigate('Products')}><span>Product catalogue</span><strong>{products.length} items <i>→</i></strong></button><button className="overview-link" onClick={() => onNavigate('Inventory')}><span>Low stock items</span><strong>{products.filter((item) => item.stock <= item.threshold).length} need review <i>→</i></strong></button><button className="overview-link" onClick={() => onNavigate('Orders')}><span>Active orders</span><strong>{orders.filter((item) => item.status === 'Pending').length} pending <i>→</i></strong></button></section></div>
  </section>
}

function Metric({ label, value, note, icon }: { label: string; value: number; note: string; icon: string }) {
  return <article className="metric-card"><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><strong>{value}</strong><small>{note}</small></article>
}

export default App
