import { graphql, useStaticQuery } from "gatsby"
import React from "react"

const Seo = ({ description, lang, title, socialImage }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            image
            social {
              twitter
            }
            language
            siteUrl
          }
        }
      }
    `
  )
  const metaDescription = description || site.siteMetadata.description
  const metaImage = new URL(
    socialImage || site.siteMetadata.image,
    site.siteMetadata.siteUrl
  ).toString()
  const language = lang || site.siteMetadata.language

  return (
    <>
      <html lang={language} />
      <title>{`${title} | ${site.siteMetadata.title}`}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={metaImage} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={site.siteMetadata.social.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </>
  )
}

export default Seo
