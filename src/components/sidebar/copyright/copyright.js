import React from "react"
import * as styles from "./copyright.module.scss"

const Copyright = ({ contentHTML }) => {
  return (
    <div
      className={styles["copyright"]}
      dangerouslySetInnerHTML={{ __html: contentHTML }}
    />
  )
}

export default Copyright
