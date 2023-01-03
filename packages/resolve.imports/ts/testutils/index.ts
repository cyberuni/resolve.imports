import { ImportMap, ImportsFieldManifest } from '../index.js'

export function manifest(content: {
  imports?: Record<string, ImportMap>
}): ImportsFieldManifest {
  return {
    path: 'path/to/package/',
    base: 'working/dir',
    content
  }
}
