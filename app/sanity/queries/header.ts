import groq, { defineQuery } from 'groq';
import { complexImageStub } from '@/sanity/queries/stubs/complex-image';
import { navLinkStub } from '@/sanity/queries/stubs/nav-link';

export const HEADER_QUERY = defineQuery(groq`
  *[_type == "header"][0]{
    _id,
    _type,
    logo{${complexImageStub}},
    nav[]{${navLinkStub}}
  }
`);
