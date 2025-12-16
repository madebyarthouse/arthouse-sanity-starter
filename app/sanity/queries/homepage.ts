import groq, { defineQuery } from 'groq';
import { complexImageStub } from './stubs/complex-image';

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
    richText[]{
      ...,
      markDefs[]{
        ...,
        link->{
          _id,
          _type,
          slug
        }
      }
    },
    components[]{
      title,
      body[]{
        ...,
        markDefs[]{
          ...,
          link->{
            _id,
            _type,
            slug
          }
        }
      }
    }
  }
`);
