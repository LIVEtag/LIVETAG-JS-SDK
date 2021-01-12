# Livetag SKY21 JS SDK

## Branches

- `master` - main branch for development

### Requirements

- Node.js ^14.0.0
- NPM ^6.14.0

## Setup

Install dependencies
```bash
npm install
```
or
```bash
npm ci
```

## Commands
* `npm run dist` - builds the library for production to `dist`, generating `livetag.min.js` file.
* `npm run build` - builds the library for development to `dist`, generating `livetag.js` and `livetag.js.map` files.
* `npm run dev` - builds the library, then keeps rebuilding it whenever the source files change.
