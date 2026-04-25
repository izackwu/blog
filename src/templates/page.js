import Layout from "../components/layout"
import Main from "../components/main"
import MyGitalk from "../components/gitalk"
import Page from "../components/page"
import React from "react"
import Seo from "../components/layout/seo"
import Sidebar from "../components/sidebar"
import { graphql } from "gatsby"

const PageTemplate = ({ data, pageContext }) => {
  const page = data.markdownRemark

  return (
    <Layout>
      <Sidebar />
      <Main>
        <Page title={page.frontmatter.title} image={page.frontmatter.image}>
          <div dangerouslySetInnerHTML={{ __html: page.html }} />
        </Page>
        {!page.frontmatter.noComments && (
          <MyGitalk id={pageContext.gitalkId} title={page.frontmatter.title} />
        )}
      </Main>
    </Layout>
  )
}

export default PageTemplate

export const Head = ({ data }) => {
  const page = data.markdownRemark
  return (
    <Seo
      title={page.frontmatter.title}
      description={page.frontmatter.description || page.excerpt}
      socialImage={page.frontmatter.image}
    />
  )
}

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(pruneLength: 160)
      frontmatter {
        title
        image
        description
        noComments
      }
    }
  }
`
