import * as dotenv from 'dotenv'; // 👈 ensure it loads from workspace root

import type { ExpoConfig } from '@expo/config';
dotenv.config({ path: '../../.env' });

const defineConfig = (): ExpoConfig => ({
  name: 'DuoTime',
  slug: 'mobile',
  version: '1.0.0',
  userInterfaceStyle: 'automatic',
  extra: {
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    graphqlUrl: process.env.EXPO_PUBLIC_GRAPHQL_URL,
  },
});

export default defineConfig;
