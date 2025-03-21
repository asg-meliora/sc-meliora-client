import React, { useEffect, useState } from 'react'
import SideMenu from "../components/SideMenu";
import UsersTable from '../components/UsersTable.jsx';

const Users = ({ api }) => {

  return (
    <>
      <div className="flex flex-wrap bg-gray-100">
        <SideMenu className="w-full md:w-1/4" />
        <div className="flex-1 w-full md:w-3/4 m-3 flex flex-col items-center ">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Lista de Usuarios
          </h2>
          <div className="bg-gray-50 shadow-xl rounded-lg px-5 py-3 m-2 w-full max-w-3xl overflow-x-auto">
            <UsersTable api={api} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
