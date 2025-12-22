import groq, { defineQuery } from 'groq';
import { complexImageStub } from '@/sanity/queries/stubs/complex-image';
import { richTextStub } from '@/sanity/queries/stubs/rich-text';

export const HOMEPAGE_QUERY = defineQuery(groq`
  *[_type == "page" && _id == "homepage"][0]{
    _id,
    _type,
    title,
    slug,
    meta{
      title,
      description,
      keywords,
      ogImage{${complexImageStub}},
      visibility
    },
    contentMode,
    richText${richTextStub},
    components[]{
      title,
      body${richTextStub}
    }
  }
`);
