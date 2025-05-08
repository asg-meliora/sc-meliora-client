import SideBar from "./SideBar";
import SideMenu from "./SideMenu";
import { useState } from "react";

const Navbar = () => {
  const [fullSideBar, setFullSideBar] = useState(false);

  return (
    <div className="w-16">
      {fullSideBar ? (
        <SideMenu setFullSideBar={setFullSideBar} />
      ) : (
        <div className="hidden sm:inline"><SideBar setFullSideBar={setFullSideBar} /></div>
      )}
    </div>
  );
};

export default Navbar;
