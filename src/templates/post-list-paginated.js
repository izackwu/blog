import Layout from "../components/layout"
import Main from "../components/main"
import Pagination from "../components/pagination"
import PostList from "../components/postlist"
import React from "react"
import Seo from "../components/layout/seo"
import Sidebar from "../components/sidebar"
import { graphql } from "gatsby"

const BlogIndex = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.edges
  const { totalPage, currentPage } = pageContext
  return (
    <Layout>
      <Sidebar />
      <Main>
        <PostList posts={posts} />
        <Pagination
          prevLink={
            currentPage !== 1 &&
            (currentPage === 2 ? "/" : "/page/" + (currentPage - 1))
          }
          nextLink={currentPage !== totalPage && "/page/" + (currentPage + 1)}
          currentText={`Page ${currentPage}`}
        />
      </Main>
    </Layout>
  )
}

export default BlogIndex

export const Head = ({ pageContext }) => {
  const { totalPage, currentPage } = pageContext
  const description =
    currentPage > 1
      ? `本站文章列表：第 ${currentPage} 页，共 ${totalPage} 页。`
      : ""
  return <Seo title="Posts" description={description} />
}

export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!, $dateFormat: String) {
    allMarkdownRemark(
      sort: { fields: { date: DESC } }
      filter: { frontmatter: { layout: { ne: "page" } } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
          fields {
            date(formatString: $dateFormat)
            slug
          }
          frontmatter {
            title
            description
            image
          }
        }
      }
    }
  }
`
