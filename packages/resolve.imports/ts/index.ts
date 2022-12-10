export type ResolveOptions = {
  /**
   * Array of conditions to resolve
   */
  conditions?: string[]
}

/**
 * Resolve an import specifier based on package.json#imports.
 *
 * @param pkg contents of package.json
 * @param entry import specifier
 * @return resolved specifier or undefined if not found
 */
export function resolve(pkg: any, entry: string, options?: ResolveOptions) {
  if (!pkg.imports) return undefined
  if (!entry.startsWith('#')) return undefined

  const matched = pkg.imports[entry]
  if (matched) {
    return lookupReplacer(matched, options?.conditions?.slice())
  }

  for (const key in pkg.imports) {
    const keyParts = key.split('*')

    const [prefix, suffix] = keyParts
    if (entry.startsWith(prefix)) {
      const replacer = lookupReplacer(pkg.imports[key], options?.conditions?.slice())

      if (replacer) return Array.isArray(replacer) ? replacer.map(replacePattern) : replacePattern(replacer)
    }

    function replacePattern(replacer: string) {
      const toKeep = suffix ? entry.slice(prefix.length, -suffix.length) : entry.slice(prefix.length)
      return replacer.replace(/\*/g, toKeep)
    }
  }

  return undefined
}

type ImportMap = string | { [key in string]: ImportMap }

function lookupReplacer(map: ImportMap, conditions?: string[]): string | string[] | undefined {
  if (typeof map === 'string' || Array.isArray(map)) return map
  if (conditions) {
    for (const condition of conditions) {
      if (map[condition]) return lookupReplacer(map[condition], conditions)
    }
  }
  return map.default as any
}
