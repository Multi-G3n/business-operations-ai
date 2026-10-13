import { useMemo, useState } from 'react'
import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { Enquiry, LeadStatus } from '../Types'
import { createRecordId } from '../Utils'

type EnquiriesProps = {
  enquiries: Enquiry[]
  setEnquiries: Dispatch<SetStateAction<Enquiry[]>>
}

type EnquiryForm = Omit<Enquiry, 'id' | 'quantity'> & { quantity: string }

const statuses: LeadStatus[] = ['New', 'Contacted', 'Quotation Pending', 'Quotation Sent', 'Won', 'Lost']
const categories = ['Access Equipment', 'Air Compressors', 'Concrete Equipment', 'Excavators', 'Generators', 'Material Handling', 'Other']
const salespeople = ['Aina Zulkifli', 'Daniel Lim', 'Farah Ismail']
const blankForm: EnquiryForm = {
  customerName: '', companyName: '', email: '', phone: '', equipmentCategory: '', productModel: '', quantity: '1',
  deliveryLocation: '', requirements: '', dateReceived: localDate(), status: 'New', assignedSalesperson: '', nextFollowUpDate: '',
}

function localDate() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function formatDate(value: string) {
  if (!value) return 'Not scheduled'
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Enquiries({ enquiries, setEnquiries }: EnquiriesProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [dialog, setDialog] = useState<'form' | 'view' | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [form, setForm] = useState<EnquiryForm>(blankForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const today = localDate()
  const dueCount = enquiries.filter((item) => item.nextFollowUpDate && item.nextFollowUpDate <= today && !['Won', 'Lost'].includes(item.status)).length
  const filtered = useMemo(() => enquiries.filter((item) => {
    const term = search.trim().toLowerCase()
    const matchesSearch = !term || [item.customerName, item.companyName, item.email, item.phone, item.productModel, item.equipmentCategory, item.assignedSalesperson].some((value) => value.toLowerCase().includes(term))
    return matchesSearch && (statusFilter === 'All statuses' || item.status === statusFilter) && (categoryFilter === 'All categories' || item.equipmentCategory === categoryFilter)
  }), [enquiries, search, statusFilter, categoryFilter])

  function openCreate() {
    setForm({ ...blankForm, dateReceived: localDate() })
    setEditingId(null)
    setErrors({})
    setDialog('form')
  }

  function openEdit(item: Enquiry) {
    setForm({ ...item, quantity: String(item.quantity) })
    setEditingId(item.id)
    setErrors({})
    setDialog('form')
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    const required: (keyof EnquiryForm)[] = ['customerName', 'companyName', 'email', 'phone', 'equipmentCategory', 'productModel', 'quantity', 'deliveryLocation', 'dateReceived', 'assignedSalesperson']
    for (const key of required) if (!String(form[key]).trim()) nextErrors[key] = 'This field is required.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    const quantity = Number(form.quantity)
    if (form.quantity && (!Number.isInteger(quantity) || quantity < 1)) nextErrors.quantity = 'Enter a whole number greater than zero.'
    if (form.nextFollowUpDate && form.nextFollowUpDate < form.dateReceived) nextErrors.nextFollowUpDate = 'Follow-up cannot be before the date received.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const record: Enquiry = { ...form, id: editingId ?? createRecordId(), quantity }
    setEnquiries((previous) => editingId === null ? [record, ...previous] : previous.map((item) => item.id === editingId ? record : item))
    setDialog(null)
  }

  function deleteEnquiry(item: Enquiry) {
    if (!window.confirm(`Delete the enquiry from ${item.companyName}? This cannot be undone.`)) return
    setEnquiries((previous) => previous.filter((record) => record.id !== item.id))
    setDialog(null)
    setSelected(null)
  }

  return <section className="enquiries-page">
    <div className="page-intro"><div><p className="eyebrow">SALES PIPELINE</p><h2>Enquiry management</h2><p>Keep customer requests organized and follow-ups on track.</p></div><button className="primary-button" onClick={openCreate}>＋ Add enquiry</button></div>

    <div className="metric-grid enquiry-metrics">
      <MetricCard label="Total enquiries" value={enquiries.length} detail="All customer requests" tone="blue" icon="▤" />
      <MetricCard label="New enquiries" value={enquiries.filter((item) => item.status === 'New').length} detail="Awaiting first contact" tone="purple" icon="✳" />
      <MetricCard label="Follow-ups due" value={dueCount} detail="Due today or overdue" tone="amber" icon="◷" />
      <MetricCard label="Quotations pending" value={enquiries.filter((item) => item.status === 'Quotation Pending').length} detail="Being prepared for customers" tone="green" icon="▧" />
    </div>

    <section className="panel enquiry-list-panel">
      <div className="panel-heading list-heading"><div><h3>All enquiries <span className="inline-count">{filtered.length}</span></h3><p>Search and filter your sales pipeline</p></div></div>
      <div className="enquiry-toolbar">
        <label className="search-control"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer, company, product…" aria-label="Search enquiries" /></label>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by lead status"><option>All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by equipment category"><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>
      </div>

      {filtered.length === 0 ? <div className="empty-state"><span className="empty-icon">⌕</span><h3>{enquiries.length ? 'No matching enquiries' : 'No enquiries yet'}</h3><p>{enquiries.length ? 'Try changing your search or filters.' : 'Add your first customer enquiry to start tracking follow-ups.'}</p>{!enquiries.length && <button className="primary-button" onClick={openCreate}>＋ Add enquiry</button>}</div> : <div className="table-scroll"><table className="enquiry-table"><thead><tr><th>Customer</th><th>Equipment</th><th>Received</th><th>Follow-up</th><th>Salesperson</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}>
        <td><button className="customer-cell" onClick={() => { setSelected(item); setDialog('view') }}><span className="company-avatar">{item.companyName.slice(0, 1)}</span><span><strong>{item.customerName}</strong><small>{item.companyName}</small></span></button></td>
        <td><strong className="equipment-name">{item.productModel}</strong><small className="cell-secondary">{item.equipmentCategory} · Qty {item.quantity}</small></td>
        <td>{formatDate(item.dateReceived)}</td><td className={item.nextFollowUpDate && item.nextFollowUpDate <= today && !['Won', 'Lost'].includes(item.status) ? 'due-cell' : ''}>{formatDate(item.nextFollowUpDate)}</td>
        <td>{item.assignedSalesperson}</td><td><StatusBadge status={item.status} /></td>
        <td><div className="row-actions"><button className="icon-button" aria-label={`View ${item.customerName} enquiry`} title="View" onClick={() => { setSelected(item); setDialog('view') }}>↗</button><button className="icon-button" aria-label={`Edit ${item.customerName} enquiry`} title="Edit" onClick={() => openEdit(item)}>✎</button><button className="icon-button danger-icon" aria-label={`Delete ${item.customerName} enquiry`} title="Delete" onClick={() => deleteEnquiry(item)}>×</button></div></td>
      </tr>)}</tbody></table></div>}
    </section>

    {dialog === 'form' && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null) }}><section className="modal-card enquiry-form-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-form-title"><div className="modal-heading"><div><p className="eyebrow">CUSTOMER OPPORTUNITY</p><h2 id="enquiry-form-title">{editingId === null ? 'Add enquiry' : 'Edit enquiry'}</h2><p>Capture the details your sales team needs to follow up.</p></div><button className="icon-button modal-close" aria-label="Close" onClick={() => setDialog(null)}>×</button></div>
      <form onSubmit={submit} noValidate><div className="form-grid">
        <Field label="Customer name" name="customerName" value={form.customerName} error={errors.customerName} onChange={setForm} required />
        <Field label="Company name" name="companyName" value={form.companyName} error={errors.companyName} onChange={setForm} required />
        <Field label="Email" name="email" type="email" value={form.email} error={errors.email} onChange={setForm} required />
        <Field label="Phone" name="phone" type="tel" value={form.phone} error={errors.phone} onChange={setForm} required />
        <label className="form-field"><span>Equipment category <b>*</b></span><select value={form.equipmentCategory} onChange={(event) => setForm((current) => ({ ...current, equipmentCategory: event.target.value }))}><option value="">Select category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>{errors.equipmentCategory && <small className="field-error">{errors.equipmentCategory}</small>}</label>
        <Field label="Product or model" name="productModel" value={form.productModel} error={errors.productModel} onChange={setForm} required />
        <Field label="Quantity" name="quantity" type="number" value={form.quantity} error={errors.quantity} onChange={setForm} required min="1" />
        <Field label="Delivery location" name="deliveryLocation" value={form.deliveryLocation} error={errors.deliveryLocation} onChange={setForm} required placeholder="City, state" />
        <Field label="Date received" name="dateReceived" type="date" value={form.dateReceived} error={errors.dateReceived} onChange={setForm} required />
        <label className="form-field"><span>Lead status <b>*</b></span><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as LeadStatus }))}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label className="form-field"><span>Assigned salesperson <b>*</b></span><select value={form.assignedSalesperson} onChange={(event) => setForm((current) => ({ ...current, assignedSalesperson: event.target.value }))}><option value="">Assign salesperson</option>{salespeople.map((person) => <option key={person}>{person}</option>)}</select>{errors.assignedSalesperson && <small className="field-error">{errors.assignedSalesperson}</small>}</label>
        <Field label="Next follow-up date" name="nextFollowUpDate" type="date" value={form.nextFollowUpDate} error={errors.nextFollowUpDate} onChange={setForm} />
        <label className="form-field form-field-wide"><span>Customer requirements</span><textarea value={form.requirements} onChange={(event) => setForm((current) => ({ ...current, requirements: event.target.value }))} rows={3} placeholder="Delivery timeline, attachments, service needs…" /></label>
      </div><p className="required-note"><b>*</b> Required fields</p><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setDialog(null)}>Cancel</button><button type="submit" className="primary-button">{editingId === null ? 'Create enquiry' : 'Save changes'}</button></div></form>
    </section></div>}

    {dialog === 'view' && selected && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null) }}><section className="modal-card detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="modal-heading"><div><p className="eyebrow">ENQUIRY DETAILS</p><h2 id="detail-title">{selected.companyName}</h2><p>{selected.customerName} · Received {formatDate(selected.dateReceived)}</p></div><button className="icon-button modal-close" aria-label="Close" onClick={() => setDialog(null)}>×</button></div><div className="detail-status"><StatusBadge status={selected.status} /><span>Assigned to {selected.assignedSalesperson}</span></div><div className="detail-grid"><Detail label="Email" value={selected.email} /><Detail label="Phone" value={selected.phone} /><Detail label="Equipment" value={selected.productModel} /><Detail label="Category and quantity" value={`${selected.equipmentCategory} · ${selected.quantity}`} /><Detail label="Delivery location" value={selected.deliveryLocation} /><Detail label="Next follow-up" value={formatDate(selected.nextFollowUpDate)} /><Detail label="Customer requirements" value={selected.requirements || 'No requirements added'} wide /></div><div className="modal-actions"><button className="secondary-button" onClick={() => deleteEnquiry(selected)}>Delete enquiry</button><button className="primary-button" onClick={() => openEdit(selected)}>Edit enquiry</button></div></section></div>}
  </section>
}

function MetricCard({ label, value, detail, tone, icon }: { label: string; value: number; detail: string; tone: string; icon: string }) {
  return <article className="metric-card"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}>{icon}</span></div><strong>{value}</strong><small>{detail}</small></article>
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  const tone = status.toLowerCase().replaceAll(' ', '-')
  return <span className={`status-badge status-${tone}`}><span />{status}</span>
}

type FieldProps = { label: string; name: keyof EnquiryForm; value: string; error?: string; type?: string; placeholder?: string; required?: boolean; min?: string; onChange: Dispatch<SetStateAction<EnquiryForm>> }
function Field({ label, name, value, error, type = 'text', placeholder, required, min, onChange }: FieldProps) {
  return <label className="form-field"><span>{label}{required && <> <b>*</b></>}</span><input type={type} value={value} min={min} placeholder={placeholder} onChange={(event) => onChange((current) => ({ ...current, [name]: event.target.value }))} aria-invalid={Boolean(error)} />{error && <small className="field-error">{error}</small>}</label>
}

function Detail({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return <div className={`detail-item ${wide ? 'detail-wide' : ''}`}><span>{label}</span><strong>{value}</strong></div>
}

export default Enquiries
