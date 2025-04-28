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
  FilesCreate
} from "./pages/index";

const apiLink = "http://localhost:3001/api"; //import.meta.env.VITE_API_URL ||

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Login api = {apiLink} />} />,
    <Route path="/files" element={<ProtectedRoute> <Files api={apiLink}/> </ProtectedRoute>} />,
    <Route path="/files/details/:id" element={<ProtectedRoute> <FilesCreate api={apiLink}/> </ProtectedRoute>} />,
    <Route path="/historical" element={<ProtectedRoute> <Historical api={apiLink}/> </ProtectedRoute>} />,
    <Route path="/invoices" element={<ProtectedRoute> <Invoices api={apiLink}/> </ProtectedRoute>} />,
    <Route path="/dashboard" element={<ProtectedRoute> <Dashboard api={apiLink}/> </ProtectedRoute>} />,
    <Route path="/users" element={<ProtectedRoute> <Users api={apiLink}/> </ProtectedRoute>} />,
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
