import groq, { defineQuery } from 'groq';

export const SITEMAP_QUERY = defineQuery(groq`
  *[
    _type == "page" &&
    (meta.visibility == "public" || !defined(meta.visibility))
  ]{
    "url": select(
      _id == "homepage" => "/",
      defined(slug.current) => "/" + slug.current,
      null
    ),
    _updatedAt
  }[defined(url)]
`);
