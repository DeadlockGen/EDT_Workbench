// JSON formatting & validation

export function formatJson(input: string, indent: number = 2): string {
  const obj = JSON.parse(input)
  return JSON.stringify(obj, null, indent)
}

export function compressJson(input: string): string {
  const obj = JSON.parse(input)
  return JSON.stringify(obj)
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input)
    return { valid: true }
  } catch (e) {
    return { valid: false, error: (e as Error).message }
  }
}
