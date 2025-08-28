import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('house/:id', 'routes/house.$id.tsx'),
  route('api/preview-mode/enable', 'routes/api/preview-mode/enable.ts'),
  route('api/preview-mode/disable', 'routes/api/preview-mode/disable.ts'),
  route('studio', 'routes/studio.$.tsx'),
] satisfies RouteConfig;
