import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { ReactNode } from "react";


export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
