import Layout from "../components/layout"
import Main from "../components/main"
import Page from "../components/page"
import React from "react"
import Seo from "../components/layout/seo"
import Sidebar from "../components/sidebar"
import Tags from "../components/tags"
import { graphql } from "gatsby"

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
  },
}) => (
  <Layout>
    <Sidebar />
    <Main>
      <Page title="Tags">
        <Tags tags={group} />
      </Page>
    </Main>
  </Layout>
)

export default TagsPage

export const Head = () => (
  <Seo
    title="Tags"
    description="本站文章的所有标签，以及标签所包含的文章数量。"
  />
)

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      limit: 2000
      filter: { frontmatter: { layout: { ne: "page" } } }
    ) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`
