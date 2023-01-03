/**
 * Implementation of `PATTERN_KEY_COMPARE`
 *
 * @see https://nodejs.org/api/esm.html#esm_resolver_algorithm_specification
 */
export function patternKeyCompare(keyA: string, keyB: string) {
  const iA = keyA.indexOf('*')
  const iB = keyB.indexOf('*')
  assert(iA !== -1, `'${keyA}' does not contain '*'`)
  assert(iB !== -1, `'${keyB}' does not contain '*'`)
  assert(keyA.lastIndexOf('*') === iA, `'${keyA}' has more than one '*'`)
  assert(keyB.lastIndexOf('*') === iB, `'${keyB}' has more than one '*'`)
  const baseLengthA = iA + 1
  const baseLengthB = iB + 1
  if (baseLengthA > baseLengthB) return -1
  if (baseLengthA < baseLengthB) return 1
  return keyA.length > keyB.length ? -1 : keyA.length < keyB.length ? 1 : 0
}

function assert(condition: boolean, message?: string) {
  if (!condition) throw new Error(message)
}
