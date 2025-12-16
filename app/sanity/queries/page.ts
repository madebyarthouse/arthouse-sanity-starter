import { defineQuery } from 'groq';

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug,
    meta{
      title,
      description,
      keywords,
      ogImage{
        alt,
        caption,
        width,
        crop,
        hotspot,
        asset->{
          _id,
          url,
          metadata{
            dimensions{width, height, aspectRatio},
            lqip
          }
        }
      },
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
