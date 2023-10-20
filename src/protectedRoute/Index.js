import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ProtectedRoute(props) {
    const { Component } = props 
    const navigate = useNavigate();
    useEffect(()=>{
        const user_id = localStorage.getItem('user');
        if(!user_id){
            navigate("/");
        }
    })
  return (
    <div>
        <Component />
    </div>
  )
}

export default ProtectedRoute