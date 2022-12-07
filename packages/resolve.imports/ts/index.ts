export function resolve(pkg: any, entry: string, options?: { conditions?: string[], extensions?: string[] }) {
  if (!pkg.imports) return undefined
  const matched = pkg.imports[entry]
  if (matched) {
    if (typeof matched === 'string') return matched
    if (options?.conditions) {
      for (const condition of options.conditions) {
        if (matched[condition]) return matched[condition]
      }
    }
    return matched.default
  }
  // TODO: support subpath patterns
  return undefined
}
