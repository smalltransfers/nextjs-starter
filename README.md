This is a [Small Transfers](https://smalltransfers.com) Next.js starter project. (See also the [Small Transfers AI Starter](https://github.com/smalltransfers/ai-starter).)

It was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), and uses [shadcn/ui](https://ui.shadcn.com/) for UI, [iron-session](https://github.com/vvo/iron-session) for session management, and [Zustand](https://github.com/pmndrs/zustand) for client state management.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js = 22.x](https://img.shields.io/badge/Node.js-22.x-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Live demo](https://img.shields.io/badge/demo-live-00C851.svg)](https://nextjs-starter.smalltransfers.com/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsmalltransfers%2Fnextjs-starter&env=NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY,SMALL_TRANSFERS_SECRET_KEY,IRON_SESSION_PASSWORD&envDescription=Click%20%22Learn%20More%22%20for%20how%20to%20specify%20the%20above%20environment%20variables.&envLink=https%3A%2F%2Fgithub.com%2Fsmalltransfers%2Fnextjs-starter%2Fblob%2Fmain%2FREADME.md&project-name=my-small-transfers-project&repository-name=my-small-transfers-project)

## Getting Started

Create a merchant account at [Small Transfers](https://smalltransfers.com) to obtain your publishable and secret keys.

Set the environment variables. For running locally, `cp .env.example .env.local`, then edit `.env.local`.

- `NEXT_PUBLIC_SMALL_TRANSFERS_BASE_URL`: The base URL for your Small Transfers API calls. Defaults to `https://test.smalltransfers.com`. If deploying live, set to `https://smalltransfers.com`.
- `NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY`: The publishable key for your Small Transfers account.
- `SMALL_TRANSFERS_SECRET_KEY`: The secret key for your Small Transfers account.
- `IRON_SESSION_PASSWORD`: The password to encrypt the session cookie. You can generate it with:
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

- [Integration Guide](https://smalltransfers.com/merchant/docs/integration-guide)
- [API Reference](https://smalltransfers.com/merchant/docs/api)

## Contributing

Contributions are welcome! Feel free to submit a pull request.
