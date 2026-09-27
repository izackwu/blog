import { FaRegCalendarAlt } from "react-icons/fa"
import React from "react"
import * as styles from "./page.module.scss"

const Page = ({ title, image, date, children, nopadding }) => {
  return (
    <div>
      <header>
        {image && (
          <div
            className={styles["header__image"]}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        )}
        <div className={styles["header__info"]}>
          <h1 className={styles["header__info__title"]}>{title}</h1>
          {date && (
            <span className={styles["header__info__date"]}>
              <FaRegCalendarAlt className={styles["icon"]} />
              最后更新于 {date}
            </span>
          )}
        </div>
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
