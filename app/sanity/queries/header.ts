import { defineQuery } from 'groq';

export const HEADER_QUERY = defineQuery(`
  *[_type == "header"][0]{
    _id,
    _type,
    logo{
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
    nav[]{
      type,
      title,
      reference->{
        _id,
        _type,
        slug
      },
      externalLink{
        type,
        url,
        email,
        phone,
        "fileUrl": file.asset->url
      }
    }
  }
`);
