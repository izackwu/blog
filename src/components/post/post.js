import { FaRegCalendarAlt, FaTags } from "react-icons/fa"

import { Link } from "gatsby"
import React, { useEffect, useRef } from "react"
import * as styles from "./post.module.scss"

const _ = require("lodash")

// Third-party embed scripts allowed to run inside post content, matched against
// the resolved src. Nothing else in a post's HTML is ever executed.
const ALLOWED_EMBED_SCRIPTS = ["https://strava-embeds.com/embed.js"]

const Post = ({ post }) => {
  const contentRef = useRef(null)

  // Post HTML is injected with dangerouslySetInnerHTML, and the browser never
  // runs <script> tags added that way. Embeds pasted into a post only work if we
  // re-create their scripts, so we do that for the allowlisted ones — copying
  // nothing but src, so no inline code or event-handler attribute comes along.
  useEffect(() => {
    contentRef.current?.querySelectorAll("script[src]").forEach(original => {
      if (!ALLOWED_EMBED_SCRIPTS.includes(original.src)) return
      const script = document.createElement("script")
      script.src = original.src
      original.replaceWith(script)
    })
  }, [post.html])

  return (
    <article>
      <header>
        {post.frontmatter.image && (
          <div
            className={styles["header__image"]}
            style={{ backgroundImage: `url(${post.frontmatter.image})` }}
          ></div>
        )}
        <div className={styles["header__info"]}>
          <h1 className={styles["header__info__title"]}>
            {post.frontmatter.title}
          </h1>
          <span className={styles["header__info__date"]}>
            <FaRegCalendarAlt className={styles["icon"]} />
            {post.fields.date}
          </span>
          {post.frontmatter.tags && (
            <span className={styles["header__info__tags"]}>
              <FaTags className={styles["icon"]} />
              <ol>
                {post.frontmatter.tags.map(tag => (
                  <li key={tag}>
                    <Link to={`/tags/${_.kebabCase(tag)}/`}>{tag}</Link>
                  </li>
                ))}
              </ol>
            </span>
          )}
        </div>
      </header>
      <section
        ref={contentRef}
        className={styles["content"]}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  )
}

export default Post
