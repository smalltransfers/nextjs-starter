This is a [Small Transfers](https://smalltransfers.com) Next.js starter project (bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)).

See a [live demo](https://nextjs-starter.smalltransfers.com/) of this repository. It uses test Small Transfers keys, so "paid requests" only charge test customers.

## Getting Started

Set the environment variables.

- `NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY`: The publishable key for the Small Transfers API.
- `SMALL_TRANSFERS_SECRET_KEY`: The secret key for the Small Transfers API.
- `NEXT_PUBLIC_BASE_URL`: The base URL of the application. Must not include a trailing slash. Default: `http://localhost:3000`.
- `IRON_SESSION_PASSWORD`: The password to encrypt the session cookie. Default: `PLACEHOLDER_IRON_SESSION_PASSWORD`.

Run the development server.

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

See the following [Small Transfers](https://smalltransfers.com) resources:

- [Integration Guide](https://smalltransfers.com/merchant/docs/integration-guide)
- [API Reference](https://smalltransfers.com/merchant/docs/api)

## Deploy on Vercel

The easiest way to deploy this app is to use [Vercel](https://vercel.com/new).
