import { useEffect, useState } from 'react'
import './App.css'
import type { Enquiry, Product } from './Types'
import Customers from './pages/Customers'
import Enquiries, { StatusBadge } from './pages/Enquiries'
import Inventory from './pages/Inventory'
import Orders, { type Order } from './pages/Order'
import Products from './pages/Products'
import type { Customer } from './pages/Customers'

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

const today = new Date()
const dateOffset = (days: number) => {
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

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
  { id: 301, customerName: 'Farid Rahman', companyName: 'Bina Teguh Construction Sdn Bhd', email: 'farid@binateguh.example', phone: '+60 12-345 6789', equipmentCategory: 'Excavators', productModel: 'Komatsu PC30MR-5', quantity: 1, deliveryLocation: 'Shah Alam, Selangor', requirements: 'Rubber tracks preferred. Please include transport and a 3-year service package in the quotation.', dateReceived: dateOffset(-2), status: 'New', assignedSalesperson: 'Aina Zulkifli', nextFollowUpDate: dateOffset(0) },
  { id: 302, customerName: 'Mei Ling Tan', companyName: 'Maju Infra Works Sdn Bhd', email: 'meiling@majuinfra.example', phone: '+60 16-234 5678', equipmentCategory: 'Access Equipment', productModel: 'JLG 450AJ', quantity: 2, deliveryLocation: 'Johor Bahru, Johor', requirements: 'For a commercial building project. Need delivery by end of November and operator training.', dateReceived: dateOffset(-5), status: 'Quotation Pending', assignedSalesperson: 'Daniel Lim', nextFollowUpDate: dateOffset(1) },
  { id: 303, customerName: 'Arun Kumar', companyName: 'Eastline Engineering Sdn Bhd', email: 'arun@eastline.example', phone: '+60 19-876 5432', equipmentCategory: 'Air Compressors', productModel: 'Atlas Copco XAS 88', quantity: 3, deliveryLocation: 'Kuantan, Pahang', requirements: 'Please confirm operating hours, warranty coverage and scheduled maintenance options.', dateReceived: dateOffset(-8), status: 'Quotation Sent', assignedSalesperson: 'Aina Zulkifli', nextFollowUpDate: dateOffset(-1) },
  { id: 304, customerName: 'Nurul Huda Ismail', companyName: 'Cekap Precast Industries Sdn Bhd', email: 'nurul@cekaprecast.example', phone: '+60 13-555 0142', equipmentCategory: 'Concrete Equipment', productModel: 'Concrete batching plant, 60 m³/hr', quantity: 1, deliveryLocation: 'Batu Pahat, Johor', requirements: 'Looking for installation, commissioning and a preventive maintenance proposal.', dateReceived: dateOffset(-1), status: 'Contacted', assignedSalesperson: 'Daniel Lim', nextFollowUpDate: dateOffset(3) },
  { id: 305, customerName: 'Jason Wong', companyName: 'Northport Facilities Sdn Bhd', email: 'jason@northport.example', phone: '+60 17-440 2266', equipmentCategory: 'Generators', productModel: '100 kVA silent diesel generator', quantity: 2, deliveryLocation: 'Port Klang, Selangor', requirements: 'Indoor installation. Please advise on ATS compatibility and after-sales support.', dateReceived: dateOffset(-12), status: 'Won', assignedSalesperson: 'Aina Zulkifli', nextFollowUpDate: '' },
  { id: 306, customerName: 'Siti Aminah', companyName: 'Seri Murni Landscaping Sdn Bhd', email: 'siti@serimurni.example', phone: '+60 11-2020 8831', equipmentCategory: 'Excavators', productModel: 'Kubota U55-4', quantity: 1, deliveryLocation: 'Ipoh, Perak', requirements: 'Interested in available units and finance options for a small landscaping team.', dateReceived: dateOffset(-4), status: 'Lost', assignedSalesperson: 'Daniel Lim', nextFollowUpDate: '' },
]

const starterTransactions: InventoryTransaction[] = [
  { id: 401, productName: 'Atlas Copco XAS 88 Compressor', sku: 'ATC-XAS88', type: 'Stock In', quantity: 2, reason: 'Demo stock received', date: new Date().toLocaleString() },
]

function loadDemoData<T,>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) as T : fallback
  } catch {
    return fallback
  }
}

const sections: Section[] = ['Overview', 'Enquiries', 'Products', 'Inventory', 'Orders', 'Customers']

function App() {
  const [section, setSection] = useState<Section>('Enquiries')
  const [products, setProducts] = useState(() => loadDemoData('business-operations.products', starterProducts))
  const [customers, setCustomers] = useState(() => loadDemoData('business-operations.customers', starterCustomers))
  const [orders, setOrders] = useState(() => loadDemoData<Order[]>('business-operations.orders', []))
  const [transactions, setTransactions] = useState(() => loadDemoData('business-operations.transactions', starterTransactions))
  const [enquiries, setEnquiries] = useState(() => loadDemoData('business-operations.enquiries', starterEnquiries))

  useEffect(() => { window.localStorage.setItem('business-operations.products', JSON.stringify(products)) }, [products])
  useEffect(() => { window.localStorage.setItem('business-operations.customers', JSON.stringify(customers)) }, [customers])
  useEffect(() => { window.localStorage.setItem('business-operations.orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => { window.localStorage.setItem('business-operations.transactions', JSON.stringify(transactions)) }, [transactions])
  useEffect(() => { window.localStorage.setItem('business-operations.enquiries', JSON.stringify(enquiries)) }, [enquiries])

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
        <div className="page-content">{content}</div>
        <footer className="app-footer">EquipFlow demo <span>•</span> Built for Malaysian equipment distributors</footer>
      </main>
    </div>
  )
}

function Overview({ enquiries, products, orders, onNavigate }: { enquiries: Enquiry[]; products: Product[]; orders: Order[]; onNavigate: (section: Section) => void }) {
  const newLeads = enquiries.filter((item) => item.status === 'New').length
  const due = enquiries.filter((item) => item.nextFollowUpDate && item.nextFollowUpDate <= dateOffset(0) && !['Won', 'Lost'].includes(item.status)).length
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
