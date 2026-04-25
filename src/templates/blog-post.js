import Layout from "../components/layout"
import Main from "../components/main"
import MyGitalk from "../components/gitalk"
import Pagination from "../components/pagination"
import Post from "../components/post"
import React from "react"
import Seo from "../components/layout/seo"
import Sidebar from "../components/sidebar"
import { graphql } from "gatsby"

const BlogPostTemplate = ({ data, pageContext }) => {
  const post = data.markdownRemark
  const { previous, next } = pageContext

  return (
    <Layout>
      <Sidebar toc={post.tableOfContents} />
      <Main>
        <Post post={post} />
        <Pagination
          prevLink={previous && previous.fields.slug}
          prevText={previous && "← " + previous.frontmatter.title}
          nextLink={next && next.fields.slug}
          nextText={next && next.frontmatter.title + " →"}
        />
        {!post.frontmatter.noComments && (
          <MyGitalk id={pageContext.gitalkId} title={post.frontmatter.title} />
        )}
      </Main>
    </Layout>
  )
}

export default BlogPostTemplate

export const Head = ({ data }) => {
  const post = data.markdownRemark
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
      socialImage={post.frontmatter.image}
    />
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $dateFormat: String) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      excerpt(pruneLength: 160)
      html
      tableOfContents(absolute: false, maxDepth: 3)
      fields {
        date(formatString: $dateFormat)
      }
      frontmatter {
        title
        description
        tags
        image
        noComments
      }
    }
  }
`
