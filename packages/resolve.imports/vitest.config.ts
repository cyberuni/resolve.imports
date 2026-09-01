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
			// The level the suite already meets. Raise these rather than lower them.
			thresholds: { lines: 97, functions: 100, branches: 82, statements: 97 }
		}
	}
})
