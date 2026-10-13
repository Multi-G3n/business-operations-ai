let lastRecordId = Date.now()

export function createRecordId() {
  lastRecordId += 1
  return lastRecordId
}

export function currentDateTime() {
  return new Date().toLocaleString()
}

export function localDateOffset(days = 0) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
