import Layout from "../components/layout"
import Main from "../components/main"
import Page from "../components/page"
import PostList from "../components/postlist"
import React from "react"
import Seo from "../components/layout/seo"
import Sidebar from "../components/sidebar"
import { graphql } from "gatsby"

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges } = data.allMarkdownRemark
  const tagHeader = `Tag: ${tag}`

  return (
    <Layout>
      <Sidebar />
      <Main>
        <Page title={tagHeader} nopadding>
          <PostList posts={edges} />
        </Page>
      </Main>
    </Layout>
  )
}

export default Tags

export const Head = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { totalCount } = data.allMarkdownRemark
  return (
    <Seo
      title={`Tag: ${tag}`}
      description={`「${tag}」标签下共有 ${totalCount} 篇文章。`}
    />
  )
}

export const pageQuery = graphql`
  query($tag: String, $dateFormat: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: { date: DESC } }
      filter: { frontmatter: { tags: { in: [$tag] }, layout: { ne: "page" } } }
    ) {
      totalCount
      edges {
        node {
          excerpt
          fields {
            slug
            date(formatString: $dateFormat)
          }
          frontmatter {
            title
            image
            description
          }
        }
      }
    }
  }
`
