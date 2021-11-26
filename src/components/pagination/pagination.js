import { Link } from "gatsby"
import React from "react"
import * as styles from "./pagination.module.scss"

const Pagination = ({
  prevText,
  prevLink,
  nextText,
  nextLink,
  currentText,
}) => {
  return (
    <nav className={styles["pagination"]}>
      <div>
        {prevLink && (
          <Link to={prevLink} rel="prev">
            {prevText}
          </Link>
        )}
      </div>
      <div>{currentText}</div>
      <div>
        {nextLink && (
          <Link to={nextLink} rel="next">
            {nextText}
          </Link>
        )}
      </div>
    </nav>
  )
}

Pagination.defaultProps = {
  prevText: "← PREV",
  nextText: "NEXT →",
  currentText: "",
}

export default Pagination
