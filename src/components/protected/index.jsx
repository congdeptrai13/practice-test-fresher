import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import NotPermitted from './NotPermitted';

const CheckPermitted = (props)=>{
  const role = useSelector(state=> state.account.user.role);
  if(role === 'ADMIN'){
    return (
      <>{props.children}</>
    )
  }
  if(role === "USER"){
    return (
      <>
      <NotPermitted/>
      </>
    )
  }
}
const Protected = (props) => {
  const isAuthenticated = useSelector(state => state.account.isAuthenticated)
  return (
    <>
      {isAuthenticated === true
      ?
      <>
      <CheckPermitted>
        {props.children}
      </CheckPermitted>
      </>
      :
      <>
        <NotPermitted/> 
      </>
    }  
    </>
  )
}

export default Protected