// src/layout/PatientLayout.jsx
import { Outlet } from "react-router-dom";
import PatientSidebar from "./PatientSidebar.jsx";
import PatientTopbar from "./PatientTopbar.jsx";

// fixed sizes so content can offset correctly
const HEADER_H = "h-14";         // 56px
const SIDEBAR_W = "md:w-[260px]";

export default function PatientLayout() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Fixed top bar */}
      <div className={`fixed top-0 left-0 right-0 z-50`}>
        <PatientTopbar />
      </div>

      {/* Fixed sidebar (below header) */}
      <aside
        className={[
          "fixed left-0 top-14 bottom-0 z-40 hidden md:block",
          SIDEBAR_W,
          "border-r bg-white"
        ].join(" ")}
      >
        <PatientSidebar />
      </aside>

      {/* Main content with offsets for fixed bars */}
      <main
        className={[
          "pt-14",                 // offset header
          "md:pl-[260px]",         // offset sidebar on desktop
          "min-h-screen"
        ].join(" ")}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
