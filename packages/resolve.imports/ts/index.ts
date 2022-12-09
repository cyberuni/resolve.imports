export function resolve(pkg: any, entry: string, options?: { conditions?: string[]; extensions?: string[] }) {
  if (!pkg.imports) return undefined
  if (!entry.startsWith('#')) return undefined

  const matched = pkg.imports[entry]
  if (matched) {
    return lookupReplacer(pkg.imports[entry], options?.conditions)
  }

  for (const key in pkg.imports) {
    const keyParts = key.split('*')
    if (keyParts.length > 2) continue

    const [prefix, suffix] = keyParts
    if (entry.startsWith(prefix)) {
      const replacer = lookupReplacer(pkg.imports[key], options?.conditions?.slice())

      if (!replacer) continue

      return Array.isArray(replacer) ? replacer.map(replacePattern) : replacePattern(replacer)
    }

    function replacePattern(replacer: string) {
      const [rp, rs] = replacer.split('*')
      const toKeep = suffix ? entry.slice(prefix.length, -suffix.length) : entry.slice(prefix.length)
      return `${rp}${toKeep}${rs}`
    }
  }

  return undefined
}

type ImportMap = string | { [key in string]: ImportMap }

function lookupReplacer(map: ImportMap, conditions?: string[]): string | string[] | undefined {
  if (typeof map === 'string' || Array.isArray(map)) return map
  if (conditions) {
    const condition = conditions.shift()
    return condition && map[condition] ? lookupReplacer(map[condition], conditions) : undefined
  }
  return map.default as any
}
