import * as yaml from 'js-yaml'

// Format converters

export function jsonToYaml(input: string): string {
  const obj = JSON.parse(input)
  return yaml.dump(obj, { indent: 2, lineWidth: -1, noRefs: true })
}

export function yamlToJson(input: string): string {
  const obj = yaml.load(input)
  return JSON.stringify(obj, null, 2)
}

export function jsonToXml(input: string): string {
  const obj = JSON.parse(input)
  return objectToXml(obj, 'root')
}

export function xmlToJson(input: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(input, 'application/xml')
  const root = doc.documentElement
  const obj = xmlNodeToObject(root)
  return JSON.stringify(obj, null, 2)
}

function objectToXml(obj: unknown, tagName: string): string {
  if (obj === null || obj === undefined) {
    return `<${tagName}/>`
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => objectToXml(item, tagName)).join('\n')
  }

  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) return `<${tagName}/>`
    const children = entries
      .map(([key, val]) => objectToXml(val, key))
      .join('\n')
    return `<${tagName}>\n${indent(children)}\n</${tagName}>`
  }

  const value = String(obj)
  if (value.includes('<') || value.includes('>') || value.includes('&')) {
    return `<${tagName}><![CDATA[${value}]]></${tagName}>`
  }
  return `<${tagName}>${value}</${tagName}>`
}

function xmlNodeToObject(node: Element): unknown {
  const children = Array.from(node.children)

  if (children.length === 0) {
    const text = node.textContent?.trim() || ''
    const attrs: Record<string, string> = {}
    Array.from(node.attributes).forEach((attr) => {
      attrs[`@${attr.name}`] = attr.value
    })
    if (Object.keys(attrs).length === 0) return text
    return { '#text': text, ...attrs }
  }

  const result: Record<string, unknown> = {}

  Array.from(node.attributes).forEach((attr) => {
    result[`@${attr.name}`] = attr.value
  })

  const childGroups: Record<string, unknown[]> = {}
  for (const child of children) {
    if (!childGroups[child.tagName]) {
      childGroups[child.tagName] = []
    }
    childGroups[child.tagName].push(xmlNodeToObject(child))
  }

  for (const [tagName, items] of Object.entries(childGroups)) {
    result[tagName] = items.length === 1 ? items[0] : items
  }

  return result
}

function indent(text: string): string {
  return text
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')
}
