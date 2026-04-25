import Layout from "../components/layout"
import Main from "../components/main"
import Page from "../components/page"
import React from "react"
import Seo from "../components/layout/seo"
import Sidebar from "../components/sidebar"

const NotFoundPage = () => {
  return (
    <Layout>
      <Sidebar />
      <Main>
        <Page title="404: Not Found">
          <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
        </Page>
      </Main>
    </Layout>
  )
}

export default NotFoundPage

export const Head = () => <Seo title="404: Not Found" />
