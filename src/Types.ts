export type Product = {
  id: number
  name: string
  sku: string
  price: number
  stock: number
  threshold: number
}

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Quotation Pending'
  | 'Quotation Sent'
  | 'Won'
  | 'Lost'

export type Enquiry = {
  id: number
  customerName: string
  companyName: string
  email: string
  phone: string
  equipmentCategory: string
  productModel: string
  quantity: number
  deliveryLocation: string
  requirements: string
  dateReceived: string
  status: LeadStatus
  assignedSalesperson: string
  nextFollowUpDate: string
}
