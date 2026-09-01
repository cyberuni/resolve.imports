import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		// The repo names its non-unit suites `*.accept.ts` / `*.integrate.ts`, which
		// vitest's default `include` does not match.
		include: ['ts/**/*.{test,spec,accept,integrate,system,unit}.ts'],
		coverage: {
			provider: 'v8',
			include: ['ts/**/*.ts'],
			exclude: ['ts/**/testutils/**', 'ts/**/*.{test,spec,accept,integrate,system,unit}.ts'],
			reporter: [
				'text',
				// Repo-relative paths. Without `projectRoot` the lcov names files
				// `ts/index.ts`, which both packages produce — codecov collapses them
				// into one entry and reports a coverage number that is not real.
				['lcovonly', { projectRoot: '../..' }]
			],
			thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 }
		}
	}
})
