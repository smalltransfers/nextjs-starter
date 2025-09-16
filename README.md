This is a [Small Transfers](https://smalltransfers.com) Next.js starter project (bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)).

See a [live demo](https://nextjs-starter.smalltransfers.com/) of this repository. It uses test Small Transfers keys, so "paid requests" only charge test customers.

## Getting Started

Create a merchant account at [Small Transfers](https://smalltransfers.com) to obtain your publishable and secret keys.

Set the environment variables. For running locally, `cp .env.example .env.local`, then edit `.env.local`.

-   `NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY`: The publishable key for your Small Transfers account.
-   `SMALL_TRANSFERS_SECRET_KEY`: The secret key for your Small Transfers account.
-   `IRON_SESSION_PASSWORD`: The password to encrypt the session cookie. You can generate it with:
    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    ```

Run the development server:

```bash
pnpm install && pnpm dev
# or
npm install && npm run dev
# or
yarn install && yarn dev
# or
bun install && bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

See the following [Small Transfers](https://smalltransfers.com) resources:

-   [Integration Guide](https://smalltransfers.com/merchant/docs/integration-guide)
-   [API Reference](https://smalltransfers.com/merchant/docs/api)

## Deploy on Vercel

The easiest way to deploy this app is to use [Vercel](https://vercel.com/new).
