import { writeFile } from 'node:fs/promises'
import { defineConfig } from 'tsdown'

// Two configs, one per format, each with its own `outDir` — this is what the two
// `tsc --project tsconfig.{cjs,esm}.json` passes used to do.
//
// `unbundle` keeps the per-module output shape tsc emitted, so the published file
// list does not move. `outExtensions` keeps `.js` / `.d.ts`; without it tsdown emits
// `.mjs` / `.d.mts`, which would change every published path.
export default defineConfig([
	{
		entry: ['ts/index.ts'],
		format: 'esm',
		outDir: 'esm',
		unbundle: true,
		dts: true,
		sourcemap: false,
		outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
		clean: true
	},
	{
		entry: ['ts/index.ts'],
		format: 'cjs',
		outDir: 'cjs',
		unbundle: true,
		dts: false,
		sourcemap: false,
		outExtensions: () => ({ js: '.js' }),
		clean: true,
		hooks: {
			// A `"type": "module"` package needs this or Node parses the CJS output as
			// ESM. `copy` cannot write it: its `to` is treated as a directory.
			'build:done': async () => {
				await writeFile('cjs/package.json', `${JSON.stringify({ type: 'commonjs' }, null, '\t')}\n`)
			}
		}
	}
])
