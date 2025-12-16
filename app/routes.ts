import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes';

export default [
  layout('routes/layout.tsx', [
    index('routes/index.tsx'),
    route(':slug', 'routes/page.$slug.tsx'),
  ]),
  route('api/event', 'routes/api.event.ts'),
  route('api/preview-mode/enable', 'routes/api/preview-mode/enable.ts'),
  route('api/preview-mode/disable', 'routes/api/preview-mode/disable.ts'),
  route('js/script', 'routes/js.script.ts'),
  route('studio/*', 'routes/studio.$.tsx'),
] satisfies RouteConfig;
