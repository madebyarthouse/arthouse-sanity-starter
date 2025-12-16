import { defineQuery } from 'groq';

export const FOOTER_QUERY = defineQuery(`
  *[_type == "footer"][0]{
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
    mainNav[]{
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
    },
    secondaryNav[]{
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
    },
    socials[]{platform, url}
  }
`);
