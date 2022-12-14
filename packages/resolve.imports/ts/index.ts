import { patternKeyCompare } from 'pattern-key-compare'
import { assert, ERR_INVALID_MODULE_SPECIFIER, ERR_PACKAGE_IMPORT_NOT_DEFINED } from './errors.js'

export type ImportsFieldManifest = {
  /**
   * Path to the package. e.g. `/path/to/package/`
   * Used for error handling only.
   */
  path?: string,
  /**
   * The base path where the import is made from.
   * Used for error handling only.
   */
  base?: string,
  /**
   * Content of the package.json.
   */
  content: {
    imports?: Record<string, ImportMap>
  }
}

export type ImportMap = string | Array<ImportMap> | { [key: string]: ImportMap }

export type ResolveOptions = {
  /**
   * Array of conditions to resolve.
   */
  conditions?: string[]
}

/**
 * Resolve an import specifier based on the `imports` field in `package.json`.
 *
 * @param manifest of package.json
 * @param specifier import specifier
 * @return resolved specifier or undefined if not found
 * @see https://nodejs.org/api/packages.html#subpath-imports
 */
export function resolve(manifest: ImportsFieldManifest, specifier: string, options?: ResolveOptions) {
  assert(specifier.startsWith('#'), 'import specifier must start with #')

  if (specifier === '#' || specifier === '#/') throw new ERR_INVALID_MODULE_SPECIFIER(specifier, `is not a valid internal imports specifier name`, manifest.base)

  if (manifest.content.imports) {
    const conditions = new Set(options?.conditions ?? [])
    const matched = manifest.content.imports[specifier]
    if (matched) {
      return noRecursive(resolvePackagePattern(matched, conditions))
    }

    const expansionKeys = getExpensionKeys(Object.keys(manifest.content.imports))
    for (const key of expansionKeys) {
      const keyParts = key.split('*')

      const [prefix, suffix] = keyParts
      if (specifier.startsWith(prefix)) {
        const replacer = resolvePackagePattern(manifest.content.imports[key], conditions)

        if (replacer) return noRecursive(replacePattern(replacer))
      }

      function replacePattern(replacer: string) {
        const toKeep = suffix ? specifier.slice(prefix.length, -suffix.length) : specifier.slice(prefix.length)
        return replacer.replace(/\*/g, toKeep)
      }
    }
  }

  throw new ERR_PACKAGE_IMPORT_NOT_DEFINED(specifier, manifest.path, manifest.base)
}

function resolvePackagePattern(map: ImportMap, conditions: Set<string>): string | undefined {
  if (typeof map === 'string') return map

  if (Array.isArray(map)) {
    for (const item of map) {
      const result = resolvePackagePattern(item, conditions)
      if (result) return result
    }
    return undefined
  }

  for (const key of Object.keys(map)) {
    if (conditions.has(key)) return resolvePackagePattern(map[key], conditions)
  }
  return map.default as string | undefined
}

function noRecursive(value: string | undefined): string | undefined {
  assert(!value?.startsWith('#'), 'recursive imports are not allowed')
  return value
}

function getExpensionKeys(keys: string[]) {
  return keys.filter(k => k.indexOf('*') >= 0).sort(patternKeyCompare)
}
