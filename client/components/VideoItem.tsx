import React, { useRef, useContext, useEffect } from "react";
import "./User.d.ts"
import styles from "../styles/VideoContainer.module.css"


const VideoItem: React.FC<{ user: User, changeMenu: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void }> = function ({ user: user, changeMenu: changeMenu }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = user.volume
      ref.current.muted = user.muted
      ref.current.autoplay = true
      if (!ref.current.srcObject)
        ref.current.srcObject = user.stream
    }
  }, [user.streaming, user.volume])

  return (
    <div onContextMenu={changeMenu} className={styles.Video_item}>
      <div className={styles.Video_item_name} hidden={user.streaming}>{user.name}</div>
      <video className={styles.Video_item_element} ref={ref} hidden={!user.streaming} />
    </div>
  )
}

export default VideoItem