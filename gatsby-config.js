module.exports = {
  siteMetadata: {
    title: `无辄的栈`,
    image: "/images/author.webp",
    description: `Zack Wu's Blog`,
    siteUrl: `https://www.zackwu.com`,
    social: {
      douban: "keith1",
      email: "hi@zackwu.com",
      facebook: "",
      github: "izackwu",
      instagram: "",
      linkedin: "izackwu",
      rss: "/feed.xml",
      telegram: "",
      twitter: "_zackwu",
      youtube: "",
      keybase: "",
      mastodon: "",
    },
    sidebarMenu: [
      { url: "/archive/", label: "归档" },
      { url: "/tags/", label: "标签" },
      { url: "/about/", label: "About" },
    ],
    footerHTML: `Powered by <a href="https://www.gatsbyjs.com/">Gatsby</a> and <a href="https://github.com/izackwu/gatsby-starter-breeze">Breeze Theme</a><br/> © 2017 - 2021 <a href="https://github.com/izackwu">Zack Wu</a> All rights reserved.`,
    dateFormat: `YYYY-MM-DD`,
    language: `zh`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `content`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          {
            resolve: `gatsby-remark-classes`,
            options: {
              classMap: {
                table: "table table-hover",
              },
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-plausible`,
      options: {
        domain: `zackwu.com`,
        // this plugin is buggy and would generate an incorrect URL to the plausible JS file
        // you need to do some rewrites on the serve side, like:
        // rewrite /js/index.js /js/plausible.js (for Caddy)
        customDomain: `plausible.zackwu.com`,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  title: edge.node.frontmatter.title,
                  description:
                    edge.node.frontmatter.description || edge.node.excerpt,
                  date: edge.node.fields.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { fields: { date: DESC } },
                  filter: {frontmatter: {layout: {ne: "page"}}},
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields {
                        slug
                        date
                      }
                      frontmatter {
                        title
                        description
                      }
                    }
                  }
                }
              }
            `,
            output: "/feed.xml",
            title: "无辄的栈",
          },
        ],
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `无辄的栈`,
        short_name: `无辄`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#177682`,
        display: `minimal-ui`,
        icon: `static/tree.png`,
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Quicksand`, `Noto Serif SC`],
        display: "swap",
      },
    },
    "gatsby-redirect-from",
    "gatsby-plugin-meta-redirect", // make sure this is always the last one
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
