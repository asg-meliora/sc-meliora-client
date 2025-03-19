import React from "react";

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
} from "./pages/index";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Login />} />,
    <Route path="/files" element={<Files />} />,
    <Route path="/historical" element={<Historical />} />,
    <Route path="/invoices" element={<Invoices />} />,
    <Route path="/dashboard" element={<Dashboard />} />,
    <Route path="/users" element={<Users />} />,
    <Route path="*" element={<NotFound />} />,
  ])
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
