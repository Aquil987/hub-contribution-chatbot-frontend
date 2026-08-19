# SoftAge ROBO2 Support Frontend

Responsive React + Vite chat interface for the FastAPI `POST /api/support/chat` endpoint.

## Structure

```text
src/
├── components/   Reusable presentational chat components
├── config/       Validated runtime build configuration
├── hooks/        Conversation state and orchestration
├── services/     Backend API client and error normalization
├── styles/       Global tokens and responsive chat styling
├── test/         Shared test setup
└── utils/        Locale and identifier helpers
```

## Local development

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

The default `.env.example` uses Vite's development proxy. Start FastAPI on the URL configured by
`VITE_DEV_PROXY_TARGET`, then open `http://127.0.0.1:5173`.

## Environment configuration

```dotenv
VITE_API_BASE_URL=
VITE_API_TIMEOUT_MS=20000
VITE_DEV_PROXY_TARGET=http://127.0.0.1:8000
VITE_SHOW_SUGGESTED_QUESTIONS=false
```

- Development with proxy: leave `VITE_API_BASE_URL` empty.
- Staging/production: set `VITE_API_BASE_URL` to the approved API origin at build time.
- Suggested questions remain implemented but hidden unless `VITE_SHOW_SUGGESTED_QUESTIONS=true`.
- Never put `OPENAI_API_KEY`, credentials, tokens, or private values in a `VITE_*` variable. Vite
  embeds those variables in the browser bundle.

Use `.env.development`, `.env.staging`, and `.env.production` in your deployment pipeline as needed.
Only the non-secret `.env.example` belongs in source control.

## Quality checks

```powershell
npm run lint
npm test
npm run build
```

The backend should allow only approved frontend origins through CORS. The frontend never adds an
`Access-Control-Allow-Origin` header; that is a server response policy.
