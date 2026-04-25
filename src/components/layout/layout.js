import React from "react"
import * as styles from "./layout.module.scss"

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      {children}
    </div>
  )
}

export default Layout
