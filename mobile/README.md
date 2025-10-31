# Echosystem Mobile

Echosystem is a modular Expo + TypeScript application that connects six calm productivity experiences — Luminote (journaling), Vershine (quotes), Nextra (tasks), Resonary (habits), Ekklesion (faith), and Stellaread (creative reading) — under a shared resonance system.

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Provide Supabase credentials (optional for local prototyping)

   ```bash
   # .env
   EXPO_PUBLIC_SUPABASE_URL=your-instance-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run the app

   ```bash
   npm run start
   ```

## Tests

Run the lightweight Jest suite:

```bash
npm test
```

The tests validate the shared Zustand stores that power the resonance system.

## Architecture Notes

- `src/state`: Zustand stores for theme resonance and cross-module data.
- `src/components`: Purposely small, expressive UI building blocks (tab glow, mode toggles, economy balance, pass modal).
- `src/screens`: Experience modules for welcome/auth, the six HomeTabs (Luminote, Vershine, Nextra, Resonary, Ekklesion, Stellaread), plus drawer settings.
- `src/theme`: Two visual modes (Normal and Lore) with shared spacing/typography.
- `src/lib/supabase`: Client bootstrap for Supabase auth/database integrations.
- `src/hooks/useAccessControl`: Feature gating and AI coin spend utilities keyed off `passType` (guest, account, gamer, flow).

Lore Mode and Normal Mode share logic; the theme switch lives inside `ModeToggle` and is globally persisted with `AsyncStorage`.
