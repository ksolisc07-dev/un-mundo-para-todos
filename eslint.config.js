// Configuración mínima de ESLint (sin dependencias extra): detecta variables
// no definidas o sin usar y errores comunes.
const browser = Object.fromEntries(
  [
    'window', 'document', 'navigator', 'location', 'localStorage', 'sessionStorage', 'console', 'setTimeout',
    'clearTimeout', 'Node', 'CSS', 'URL', 'Response', 'caches', 'self', 'fetch', 'getComputedStyle', 'AudioContext',
  ].map((g) => [g, 'readonly'])
);
const node = Object.fromEntries(['process', 'console', 'URL', 'setTimeout'].map((g) => [g, 'readonly']));

const rules = {
  'no-undef': 'error',
  'no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_' }],
  'no-unreachable': 'error',
  'no-dupe-keys': 'error',
  'no-duplicate-imports': 'error',
  'no-self-compare': 'error',
  'no-constant-condition': ['error', { checkLoops: false }],
  eqeqeq: 'error',
  'prefer-const': 'error',
  'no-var': 'error',
};

export default [
  { ignores: ['node_modules/**', 'test-results/**', 'playwright-report/**'] },
  { files: ['js/**/*.js', 'sw.js'], languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: browser }, rules },
  {
    files: ['tests/**/*.mjs', 'playwright.config.mjs', 'eslint.config.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: { ...browser, ...node } },
    rules,
  },
];
