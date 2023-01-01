export type ResolveOptions = {
  /**
   * Array of conditions to resolve.
   */
  conditions?: string[]
}

/**
 * Resolve an import specifier based on the `imports` field in `package.json`.
 *
 * @param pjson contents of package.json
 * @param specifier import specifier
 * @return resolved specifier or undefined if not found
 * @see https://nodejs.org/api/packages.html#subpath-imports
 */
export function resolve(pjson: any, specifier: string, options?: ResolveOptions) {
  if (!pjson.imports) return undefined
  if (!specifier.startsWith('#')) return undefined
  if (specifier === '#' || specifier === '#/') return undefined

  const matched = pjson.imports[specifier]
  if (matched) {
    return noRecursive(lookupReplacer(matched, options?.conditions?.slice()))
  }

  const expansionKeys = sortExpensionKeys(Object.keys(pjson.imports))
  for (const key of expansionKeys) {
    const keyParts = key.split('*')

    const [prefix, suffix] = keyParts
    if (specifier.startsWith(prefix)) {
      const replacer = lookupReplacer(pjson.imports[key], options?.conditions?.slice())

      if (replacer) return noRecursive(
        Array.isArray(replacer) ? replacer.map(replacePattern) : replacePattern(replacer)
      )
    }

    function replacePattern(replacer: string) {
      const toKeep = suffix ? specifier.slice(prefix.length, -suffix.length) : specifier.slice(prefix.length)
      return replacer.replace(/\*/g, toKeep)
    }
  }

  return undefined
}

type ImportMap = string | { [key: string]: ImportMap }

function lookupReplacer(map: ImportMap, conditions?: string[]): string | string[] | undefined {
  if (typeof map === 'string' || Array.isArray(map)) return map
  if (conditions) {
    for (const condition of conditions) {
      if (map[condition]) return lookupReplacer(map[condition], conditions)
    }
  }
  return map.default as string | undefined
}

function noRecursive(value: string | string[] | undefined): string | string[] | undefined {
  if (Array.isArray(value)) return value.map(noRecursive) as string[]
  return value?.startsWith('#') ? undefined : value
}

function sortExpensionKeys(keys: string[]) {
  return keys.sort(patternKeyCompare)
}

/**
 * `PATTERN_KEY_COMPARE`
 * @see https://nodejs.org/api/esm.html#esm_resolver_algorithm_specification
 */
export function patternKeyCompare(a: string, b: string) {
  const iA = a.indexOf('*')
  const iB = b.indexOf('*')
  const baseLengthA = iA === -1 ? a.length : iA + 1
  const baseLengthB = iB === -1 ? b.length : iB + 1
  if (baseLengthA > baseLengthB) return -1
  if (baseLengthA < baseLengthB) return 1
  if (iA === -1) return 1
  if (iB === -1) return -1
  return a.length > b.length ? -1 : a.length < b.length ? 1 : 0
}
