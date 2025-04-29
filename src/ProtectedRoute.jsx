import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export const ProtectedRoute = ({children, allowedRoles }) => {
   const token = Cookies.get('token');
   const UserRole = parseInt(Cookies.get("role_id"), 10); 
   const isActive = parseInt(Cookies.get("is_active"), 10);

   //Si no hay token o es un usuario inactivo o el rol del usuario no está en la lista de roles permitidos, 
   // redirige a la página de inicio
   if(!token || !allowedRoles.includes(UserRole) || isActive === 0)
     return <Navigate to='/' replace />;
  
  return children
}