import { client } from '@/lib/sanity';
import { setServerClient, loadQuery } from '@/sanity/loader';

const token =
  process.env.SANITY_API_READ_TOKEN ??
  process.env.SANITY_READ_TOKEN ??
  undefined;

setServerClient(client.withConfig({ token, useCdn: false }));

export { loadQuery };
