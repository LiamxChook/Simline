# Simline

Simline is now scaffolded as an Expo / React Native app that recreates the current Flutter flow:

- a short branded welcome screen
- the rugby lineout simulator screen
- formation selection, formation types, playback, reset, and speed controls

## Stack

- Expo SDK 55
- React 19.2
- React Native 0.83
- TypeScript

## Getting Started

1. Install Node.js 20.19 or newer.
2. Enable pnpm through Corepack:

```bash
corepack enable
```

3. Install dependencies:

```bash
pnpm install
```

4. Start the Expo development server:

```bash
pnpm start
```

Useful shortcuts:

- `pnpm android`
- `pnpm ios`
- `pnpm web`

## Project Layout

- `App.tsx` bootstraps the splash-to-home flow
- `src/screens/` contains the welcome and simulator screens
- `src/components/` contains the reusable UI pieces
- `src/constants/` contains colors and simulator presets
