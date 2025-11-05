import { Search, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
      {/* Search */}
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-1/2">
        <Search className="w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search books, students..."
          className="bg-transparent outline-none px-3 w-full text-sm"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-5">
        <Bell className="w-5 h-5 text-gray-600 hover:text-brand cursor-pointer" />
        <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-semibold">
          P
        </div>
      </div>
    </div>
  );
}
