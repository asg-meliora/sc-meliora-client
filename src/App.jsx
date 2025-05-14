import React from "react";
import { TokenProvider } from './TokenContext';
import { ProtectedRoute } from "./ProtectedRoute";

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import {
  Dashboard,
  Files,
  Historical,
  Invoices,
  Login,
  Users,
  NotFound,
  FilesDetails,
  InvoicesDetails
} from "./pages/index";

import {
  InvoicesUser,
  InvoicesUserDetails
} from "./pagesUser/indexUser"

const apiLink = "http://localhost:3001/api"; //import.meta.env.VITE_API_URL ||

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Login api = {apiLink} />} />,
    //Rutas de Admin
    <Route path="/files" element={<ProtectedRoute allowedRoles={[1]}> <Files api={apiLink}/> </ProtectedRoute>} />,
    <Route path="/files/details/:id" element={<ProtectedRoute allowedRoles={[1]}> <FilesDetails api={apiLink}/> </ProtectedRoute>} />,
    <Route path="/historical" element={<ProtectedRoute allowedRoles={[1]}> <Historical api={apiLink}/> </ProtectedRoute>} />,
    <Route path="/invoices" element={<ProtectedRoute allowedRoles={[1]}> <Invoices api={apiLink}/> </ProtectedRoute>} />,
    <Route path="/invoices/details/:id" element={<ProtectedRoute allowedRoles={[1]}> <InvoicesDetails api={apiLink}/> </ProtectedRoute>} />,
    <Route path="/dashboard" element={<ProtectedRoute allowedRoles={[1]}> <Dashboard api={apiLink}/> </ProtectedRoute>} />,
    <Route path="/users" element={<ProtectedRoute allowedRoles={[1]}> <Users api={apiLink}/> </ProtectedRoute>} />,

    //Rutas de Usuario
    <Route path="/user/invoices/:userId" element={<ProtectedRoute allowedRoles={[2]}> <InvoicesUser api={apiLink}/> </ProtectedRoute>} />,
    <Route path="/user/invoices/:userId/details/:invoiceId" element={<ProtectedRoute allowedRoles={[2]}> <InvoicesUserDetails api={apiLink}/> </ProtectedRoute>} />,

    <Route path="*" element={<NotFound />} />,
  ])
);

function App() {
  return (
    <>
      <TokenProvider>
        <RouterProvider router={router} />
      </TokenProvider>
    </>
  );
}

export default App;
