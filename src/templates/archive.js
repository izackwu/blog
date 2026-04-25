import Layout from "../components/layout"
import Main from "../components/main"
import Page from "../components/page"
import PostList from "../components/postlist"
import React from "react"
import Seo from "../components/layout/seo"
import Sidebar from "../components/sidebar"
import { graphql } from "gatsby"

const Archive = ({ data }) => {
  const posts = data.allMarkdownRemark.edges
  return (
    <Layout>
      <Sidebar />
      <Main>
        <Page title="Archive" nopadding>
          <PostList posts={posts} compact />
        </Page>
      </Main>
    </Layout>
  )
}

export default Archive

export const Head = () => (
  <Seo title="Archive" description="本站所有文章，尽在此处，一览无余。" />
)

export const query = graphql`
  query($dateFormat: String) {
    allMarkdownRemark(
      filter: { frontmatter: { layout: { ne: "page" } } }
      sort: { fields: { date: DESC } }
    ) {
      edges {
        node {
          fields {
            date(formatString: $dateFormat)
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
