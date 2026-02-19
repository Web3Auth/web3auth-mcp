---
name: metamask-embedded-node
description: Integrate MetaMask Embedded Wallets (Web3Auth) Node.js SDK for server-side wallet operations. Use when building backend services, AI agents, or server-side custody with Web3Auth, or when the user mentions server-side wallets, backend Web3Auth, or Node.js Web3Auth.
---

# MetaMask Embedded Wallets — Node.js SDK

Integrate MetaMask Embedded Wallets (Web3Auth) in Node.js for server-side wallet operations. Search the docs via MCP, llms.txt, or @docs before writing implementation. Do not guess package names or code—look them up.

---

## Architecture

**Server-side only**: No UI, no browser, no frontend.

**Custom authentication ONLY**: No social login UI—you bring your own JWT from your auth provider.

**Stateless**: Each request reconstructs the key from the JWT. No session storage.

**Built-in EVM provider**: Signer access for EVM chains.

**Built-in Solana provider**: Wallet state for Solana.

**Private key export**: Available for other chains or custom use.

**Niche use case**: AI agents, server-side custody, backend wallet operations, automated transactions.

**Dashboard chain config**: Supported in v10+.

---

## Framework Considerations

### Authentication Requirements
- Custom authentication must be set up on the dashboard with a valid JWKS endpoint.
- The JWT must be issued by YOUR auth provider (Firebase, Auth0, AWS Cognito, custom), not by Web3Auth.
- No social login UI; this SDK assumes you already have a valid JWT.

### Key Derivation
- Same key derivation rules apply: same connection + same client ID + same network = same wallet.
- Session management does not apply—server-side is stateless.

---

## Common Misunderstandings

| Issue | Reality |
|-------|---------|
| Frontend SDK | This is NOT a frontend SDK. It has no UI components or login flow. |
| Social login | Node.js SDK does not support social login. You must have custom auth and provide a JWT. |
| JWKS endpoint | Dashboard must have a valid JWKS endpoint for your auth provider. |
| JWT issuer | Your auth provider issues the JWT; Web3Auth validates it via JWKS. |
| Session persistence | Server-side is stateless. Each request derives the key from the JWT. |
| Use case | Best for AI agents, automated transactions, server-side custody—not for user-facing login flows. |

---

## Patterns

1. **JWT-first**: Obtain JWT from your auth system, pass it to the SDK.
2. **Per-request derivation**: Reconstruct key from JWT on each request; no session storage.
3. **EVM**: Use built-in EVM provider for signing and transactions.
4. **Solana**: Use built-in Solana provider for wallet state.
5. **Other chains**: Export private key for custom chain support.
6. **Dashboard setup**: Configure custom connection with JWKS endpoint before using.

---

## Additional Resources

- Official docs: https://docs.metamask.io/embedded-wallets/sdk/node/
- Dashboard: Custom authentication, JWKS endpoint, chain configuration (v10+).
- Custom auth: Firebase, Auth0, Cognito, or any JWT provider with JWKS.
