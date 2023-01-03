/**
 * Implementation of `PATTERN_KEY_COMPARE`
 *
 * @see https://nodejs.org/api/esm.html#esm_resolver_algorithm_specification
 */
export function patternKeyCompare(a: string, b: string) {
  const aPatternIndex = a.indexOf('*')
  const bPatternIndex = b.indexOf('*')
  assert(aPatternIndex !== -1, `'${a}' does not contain '*'`)
  assert(bPatternIndex !== -1, `'${b}' does not contain '*'`)
  assert(a.lastIndexOf('*') === aPatternIndex, `'${a}' has more than one '*'`)
  assert(b.lastIndexOf('*') === bPatternIndex, `'${b}' has more than one '*'`)
  const baseLenA = aPatternIndex + 1
  const baseLenB = bPatternIndex + 1
  if (baseLenA > baseLenB) return -1
  if (baseLenB > baseLenA) return 1
  if (a.length > b.length) return -1
  if (b.length > a.length) return 1
  return 0
}

function assert(condition: boolean, message?: string) {
  if (!condition) throw new Error(message)
}
