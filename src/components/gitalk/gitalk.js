import "gitalk/dist/gitalk.css"
import "./style-fix.scss"

import React, { useEffect, useRef } from "react"
import Gitalk from "gitalk"
import * as styles from "./gitalk.module.scss"

const gitalkConfig = {
  clientID: "541b66df2ca4fba90b0c",
  clientSecret: "157f686855f29762873e8ce11e056f7397c58209",
  repo: "blog",
  owner: "izackwu",
  admin: ["izackwu"],
  pagerDirection: "first",
  createIssueManually: true,
  distractionFreeMode: false,
  enableHotKey: true,
  proxy:
    "https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token",
}

const MyGitalk = ({ title, id }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
      const gitalk = new Gitalk({
        ...gitalkConfig,
        id,
        title,
      })
      gitalk.render(containerRef.current)
    }
  }, [id, title])

  return (
    <div className={styles["gitalk"]}>
      <div ref={containerRef} />
    </div>
  )
}

export default MyGitalk
