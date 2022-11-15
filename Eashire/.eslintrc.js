module.exports = {
	env: {
		browser: true,
		node: true,
		commonjs: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:eslint-comments/recommended',
		// should be on last position
		'plugin:prettier/recommended',
		'prettier',
	],
	plugins: ['import'],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	ignorePatterns: ['node_modules/*', 'dist/*'],
	rules: {
		'no-console': 1,
		'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
		'eslint-comments/no-unused-disable': 'error',
		'no-unused-vars': 'off',
		'max-len': [
			'warn',
			{
				code: 120,
				ignoreTrailingComments: true,
				ignoreUrls: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
			},
		],
		'import/no-duplicates': ['error', { considerQueryString: true }],
		'no-async-promise-executor': ['off'],
		'no-promise-executor-return': ['error'],
		'no-template-curly-in-string': ['error'],
		'no-unmodified-loop-condition': ['error'],
		'block-scoped-var': ['error'],
		'no-else-return': ['error', { allowElseIf: false }],
		'no-unneeded-ternary': ['error'],
		'no-useless-catch': ['error'],
		'no-useless-return': ['error'],
		'no-var': ['error'],
		'prefer-const': ['error'],
		'prefer-destructuring': [
			'error',
			{
				array: false,
				object: true,
			},
		],
		'prefer-object-spread': ['error'],
		'prefer-template': ['error'],
		'spaced-comment': ['error', 'always', { line: { exceptions: ['-'] } }],
		'no-case-declarations': ['off'],
		'no-unsafe-optional-chaining': ['off'],
		// https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
		'import/order': [
			'error',
			{
				groups: ['external', 'builtin', 'internal', 'sibling', 'parent', 'index', 'type'],
				warnOnUnassignedImports: true,
				'newlines-between': 'always',
				pathGroupsExcludedImportTypes: ['internal'],
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
			},
		],
	},
}
