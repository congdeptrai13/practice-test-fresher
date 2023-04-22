import React from 'react'
import { FadeLoader } from 'react-spinners'

const LoadingComponent = () => {
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  return (
    <div style={style}><FadeLoader color="#36d7b7" /></div>
  )
}

export default LoadingComponent