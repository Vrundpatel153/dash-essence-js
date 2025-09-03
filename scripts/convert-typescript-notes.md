Automated conversion guide (performed by assistant):

1. Delete remaining *.ts / *.tsx after creating .js / .jsx equivalents.
2. Replace all occurrences of React.forwardRef<...>( with React.forwardRef(function Name(
3. Remove interface/type declarations; keep runtime code.
4. Remove type-only imports (e.g., import type {...}).
5. Ensure all internal imports drop explicit .ts/.tsx extensions.
6. Validate build with `npm run dev` and `npm run build`.
