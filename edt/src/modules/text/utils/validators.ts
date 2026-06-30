import formatXml from 'xml-formatter'

export function formatXmlText(input: string): string {
  return formatXml(input, {
    indentation: '  ',
    collapseContent: true,
    lineSeparator: '\n'
  })
}

// Common XML error patterns → Chinese explanation
function translateXmlError(errorText: string): string {
  if (!errorText) return ''
  const e = errorText.toLowerCase()

  if (e.includes('unclosed token') || e.includes('expected token'))
    return '标签未正确闭合，请检查是否有未关闭的标签'
  if (e.includes('not well-formed') || e.includes('malformed'))
    return 'XML 格式异常，请检查标签嵌套是否正确'
  if (e.includes('invalid character') || e.includes('invalid char'))
    return '包含非法字符，请检查特殊字符是否需要转义（如 &lt; &amp;）'
  if (e.includes('mismatched tag') || e.includes('open tag') || e.includes('close tag'))
    return '开始标签与结束标签不匹配'
  if (e.includes('unknown entity') || e.includes('entityref'))
    return '使用了未知的实体引用，& 后必须跟已知实体名或 # 编码'
  if (e.includes('no element found') || e.includes('empty document'))
    return 'XML 内容为空，文档中至少需要一个根元素'
  if (e.includes('space required') || e.includes('required'))
    return '标签属性格式不正确，属性之间需要空格分隔'
  if (e.includes('root'))
    return 'XML 文档必须有且只有一个根元素'
  if (e.includes('attribute') || e.includes('attr'))
    return '属性定义格式错误，属性值需要用引号包裹'
  if (e.includes('version') || e.includes('encoding'))
    return 'XML 声明（&lt;?xml ?&gt;）格式错误'
  if (e.includes('doctype') || e.includes('dtd'))
    return '文档类型声明（DOCTYPE）格式错误'
  if (e.includes('tag') || e.includes('element'))
    return '标签命名不符合 XML 规范'
  if (e.includes('parse') || e.includes('syntax'))
    return 'XML 语法错误'

  // Fallback: extract relevant part from the error
  const colonIdx = errorText.indexOf(':')
  const msg = colonIdx > 0 ? errorText.substring(colonIdx + 1).trim() : errorText
  return `XML 解析错误: ${msg}`
}

export function validateXml(input: string): { valid: boolean; error?: string; cn?: string } {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'application/xml')
    const errors = doc.querySelectorAll('parsererror')
    if (errors.length > 0) {
      const enMsg = errors[0].textContent || 'XML parse error'
      return { valid: false, error: enMsg, cn: translateXmlError(enMsg) }
    }
    return { valid: true }
  } catch (e) {
    const enMsg = (e as Error).message
    return { valid: false, error: enMsg, cn: translateXmlError(enMsg) }
  }
}
