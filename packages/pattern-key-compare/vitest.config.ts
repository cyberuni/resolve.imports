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
			reporter: ['text', 'lcov'],
			thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 }
		}
	}
})
