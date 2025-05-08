import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'

export const ProtectedRoute = ({children, allowedRoles }) => {
   const token = Cookies.get('token');
   const userRole = parseInt(Cookies.get("role_id"), 10); 
   const isActive = parseInt(Cookies.get("is_active"), 10);
   const currentUserId = parseInt(Cookies.get('user_id'), 10);

   const { userId } = useParams(); // viene desde la URL, si aplica

   //Si no hay token o es un usuario inactivo o el rol del usuario no está en la lista de roles permitidos, 
   // redirige a la página de inicio
   if(!token || !allowedRoles.includes(userRole) || isActive === 0)
     return <Navigate to='/' replace />;

   
  // Validación adicional: si el rol no es admin (por ejemplo rol_id 1) y el userId de la URL no coincide
  if (userId && userRole !== 1 && parseInt(userId, 10) !== currentUserId) {
    return <Navigate to="/" replace />;
  }
  
  return children
}