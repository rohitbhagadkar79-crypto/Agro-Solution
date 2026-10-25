# Patil Agro Solution

**Patil Agro Solution** is an agriculture companion for Indian farmers. It brings crop observations, soil-test records, local weather, farming alerts, and practical next steps together in a mobile-first experience.

The project currently includes an Android-first Expo mobile app, a responsive web companion, and a shared API service.

## Current features

### Mobile app

- Farmer dashboard with weather, active crops, and farming alerts
- Crop and nutrient photo selection from the phone's photo library
- Touch-friendly shortcuts for soil health, weather, crops, reports, and the farming assistant
- Agriculture-inspired interface designed for small screens

### Web companion

- Dashboard, crop and nutrient scan interfaces, soil reports, weather, assistant, crop management, saved reports, alerts, and onboarding screens
- Responsive layouts for mobile and desktop

### API

- Dashboard overview
- Crop list and add-crop endpoint
- Crop health report list
- Soil report list and create endpoint
- Farming alert list
- Shared OpenAPI contract with generated TypeScript client and validation schemas

## Important limitations

This is an early application build. Some displayed agriculture, weather, crop, and report content is demonstration data. Photo selection is available, but a computer-vision model is **not yet connected** to diagnose crop disease or nutrient deficiencies. A live weather provider, production authentication, and durable user-specific storage are also not yet configured.

Do not use demo content as real farming, fertilizer, or pesticide advice. A photo-based visual prediction must not be presented as a laboratory measurement. Confirm nutrient levels with a laboratory soil or plant-tissue test, and follow product labels and local agricultural regulations.

## Technology

- **Mobile:** React Native, Expo, Expo Router, TypeScript
- **Web:** React, Vite, TypeScript, Tailwind CSS
- **API:** Express, TypeScript
- **Contracts and client:** OpenAPI, Orval, Zod, TanStack Query
- **Workspace:** pnpm monorepo

## Repository layout

```text
artifacts/
  patil-agro-mobile/     Expo mobile app
  patil-agro-solution/   Responsive web companion
  api-server/            Shared Express API
lib/
  api-spec/              OpenAPI source contract
  api-client-react/      Generated API client and React Query hooks
  api-zod/               Generated request/response validation
```

## Development

The project is organized as a pnpm workspace. In Replit, start the relevant managed workflow for the mobile app, web companion, or API; those workflows provide the required ports and routing environment.

Install workspace dependencies:

```bash
pnpm install
```

Useful checks:

```bash
pnpm run typecheck
pnpm --filter @workspace/patil-agro-mobile run typecheck
pnpm --filter @workspace/patil-agro-solution run typecheck
pnpm --filter @workspace/api-server run typecheck
```

When changing the API contract, update `lib/api-spec/openapi.yaml` and regenerate the shared client:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## Roadmap

- Add farmer accounts and profile-specific data
- Persist crops, scans, soil reports, and saved reports
- Connect a reliable weather data provider
- Integrate and validate a crop image-analysis model
- Complete Marathi, Hindi, and English coverage across the app

## License

This project is licensed under the MIT License.
