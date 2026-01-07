# Supabase-b2b
1. **Initialize Supabase project**:
```bash
npx supabase init
npx supabase start
```

2. **Run migrations**:
```bash
npx supabase db push
```

3. **Generate TypeScript types**:
```bash
npx supabase gen types typescript --local > src/lib/types/database.types.ts
```

4. **Install dependencies**:
```bash
npm install
```

5. **Configure environment variables** in `.env.local`

6. **Run development server**:
```bash
npm run dev
```
