import groq, { defineQuery } from 'groq';
import { complexImageStub } from '@/sanity/queries/stubs/complex-image';
import { navLinkStub } from '@/sanity/queries/stubs/nav-link';
import { socialLinkStub } from '@/sanity/queries/stubs/social-link';

export const FOOTER_QUERY = defineQuery(groq`
  *[_type == "footer"][0]{
    _id,
    _type,
    logo{${complexImageStub}},
    mainNav[]{${navLinkStub}},
    secondaryNav[]{${navLinkStub}},
    socials[]{${socialLinkStub}}
  }
`);
