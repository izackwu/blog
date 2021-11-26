import React from "react"
import * as styles from "./page.module.scss"

const Page = ({ title, image, children, nopadding }) => {
  return (
    <div>
      <header>
        {image && (
          <div
            className={styles["header__image"]}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        )}
        <h1 className={styles["header__title"]}>{title}</h1>
      </header>
      <section
        className={styles["content"]}
        style={
          nopadding && {
            paddingRight: 0,
            paddingLeft: 0,
          }
        }
      >
        {children}
      </section>
    </div>
  )
}

export default Page
