import { Studio } from 'sanity';

import { Hydrated } from '@/components/features/sanity';
import studio from '@/studio.css?url';

import config from '@root/sanity.config';
import { LinksFunction, MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [
  { title: 'Sanity Studio' },
  { name: 'robots', content: 'noindex' },
];

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: studio }];
};

export default function StudioPage() {
  return (
    <Hydrated>
      <Studio config={config} />
    </Hydrated>
  );
}
