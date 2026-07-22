export const ctaLinkStub = `
  type,
  label,
  source,
  staticLink->{
    _id,
    _type,
    title,
    type,
    url
  },
  internalLink->{
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
`;
