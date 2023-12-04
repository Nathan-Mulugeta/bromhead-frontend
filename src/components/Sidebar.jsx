import SidebarItem from "./SidebarItem";
import { LuLayoutDashboard } from "react-icons/lu";
import { GoTasklist } from "react-icons/go";
import { useContext } from "react";
import { SidebarContext } from "./DashLayout";

const SidebarMenuItems = [
  {
    title: "Dashboard",
    icon: <LuLayoutDashboard fontSize={20} />,
  },
  { title: "Projects", icon: <GoTasklist fontSize={20} /> },
];

const Sidebar = () => {
  const { expanded } = useContext(SidebarContext);

  return (
    <aside className="fixed bottom-0 left-0 top-14">
      <nav className="flex h-full flex-col border-r bg-white shadow-sm">
        <ul className="flex-1 px-3">
          {SidebarMenuItems.map((item) => (
            <SidebarItem key={item.title} title={item.title} icon={item.icon} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
