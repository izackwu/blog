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
      telegram: "wzstack",
      twitter: "_zackwu",
      youtube: "",
      keybase: "zackwu",
      mastodon: "zackwu@mas.to",
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
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-118116525-1`,
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
                  sort: { order: DESC, fields: [fields___date] },
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
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Quicksand`, `Noto Serif SC`],
        display: "swap",
      },
    },
    {
      resolve: `gatsby-plugin-gitalk`,
      options: {
        config: {
          clientID: "541b66df2ca4fba90b0c",
          clientSecret: "157f686855f29762873e8ce11e056f7397c58209",
          repo: "blog",
          owner: "izackwu",
          admin: ["izackwu"],
          pagerDirection: "first",
          createIssueManually: true,
          distractionFreeMode: false,
          enableHotKey: true,
          // fix CORS errors
          proxy:
            "https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token",
        },
      },
    },
    "gatsby-redirect-from",
    "gatsby-plugin-meta-redirect", // make sure this is always the last one
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
