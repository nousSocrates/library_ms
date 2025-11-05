import { useState } from "react";
import { BookOpen, Users, Home, LogOut, Menu } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const menus = [
    { name: "Dashboard", icon: Home },
    { name: "Books", icon: BookOpen },
    { name: "Students", icon: Users },
  ];

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 h-screen p-4 flex flex-col justify-between transition-all duration-300`}
    >
      <div>
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-600 hover:text-brand flex items-center mb-8"
        >
          <Menu className="w-6 h-6" />
          {open && (
            <span className="ml-3 text-lg font-semibold">LibraryMS</span>
          )}
        </button>

        {/* Menu Items */}
        <ul className="space-y-4">
          {menus.map(({ name, icon: Icon }) => (
            <li
              key={name}
              className="flex items-center gap-3 text-gray-700 hover:text-brand font-medium cursor-pointer"
            >
              <Icon className="w-5 h-5" />
              {open && <span>{name}</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Logout */}
      <button className="flex items-center gap-3 text-gray-700 hover:text-red-500 font-medium cursor-pointer">
        <LogOut className="w-5 h-5" />
        {open && <span>Logout</span>}
      </button>
    </aside>
  );
}
