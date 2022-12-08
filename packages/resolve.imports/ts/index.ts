export function resolve(pkg: any, entry: string, options?: { conditions?: string[], extensions?: string[] }) {
  if (!pkg.imports) return undefined
  if (!entry.startsWith('#')) return undefined

  const matched = pkg.imports[entry]
  if (matched) {
    return lookupReplacer(pkg.imports[entry], options?.conditions)
  }

  for (const key in pkg.imports) {
    const keyParts = key.split('*')
    if (keyParts.length !== 2) continue

    const [prefix, suffix] = keyParts
    if (entry.startsWith(prefix)) {
      const replacer = lookupReplacer(pkg.imports[key], options?.conditions?.slice())

      if (!replacer) continue

      const [rp, rs] = replacer.split('*')
      return `${rp}${entry.slice(prefix.length, -suffix.length)}${rs}`
    }
  }

  return undefined
}

type ImportMap = string | { [key in string]: ImportMap }

function lookupReplacer(map: ImportMap, conditions?: string[]): string | undefined {
  if (typeof map === 'string') return map
  if (conditions) {
    const condition = conditions.shift()
    return condition && map[condition] ? lookupReplacer(map[condition], conditions) : undefined
  }
  return map.default as any
}
