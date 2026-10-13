let lastRecordId = Date.now()

export function createRecordId() {
  lastRecordId += 1
  return lastRecordId
}

export function currentDateTime() {
  return new Date().toLocaleString()
}
