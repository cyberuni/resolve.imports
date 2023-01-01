/**
 * Implementation of `PATTERN_KEY_COMPARE`
 *
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
