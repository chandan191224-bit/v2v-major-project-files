import {
  useLocation,
} from "react-router-dom";

export default function Topbar() {

  const location = useLocation();

  // PAGE TITLES
  const pageData = {

    "/": {
      title: "Dashboard",
      subtitle:
        "Real-Time Vehicle Simulation System",
    },

    "/map": {
      title: "Live Map",
      subtitle:
        "Live Vehicle Traffic Visualization",
    },

    "/drive": {
      title: "Drive Control",
      subtitle:
        "Vehicle Driving Interface",
    },

    "/chat": {
      title: "Team Chat",
      subtitle:
        "Real-Time Communication System",
    },

    "/settings": {
      title: "System Settings",
      subtitle:
        "Application Configuration & Modes",
    },
  };

  // CURRENT PAGE
  const currentPage =
    pageData[location.pathname] ||
    pageData["/"];

  return (
    <div className="h-24 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between">

      {/* LEFT */}
      <div>

        <h1 className="text-4xl font-bold">
          {currentPage.title}
        </h1>

        <p className="text-slate-400 text-lg">
          {currentPage.subtitle}
        </p>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-8">

        {/* CONNECTION STATUS */}
        <div className="flex items-center gap-3">

          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>

          <span className="text-lg">
            Backend Connected
          </span>

        </div>

        {/* STATUS */}
        <div className="bg-slate-800 px-6 py-3 rounded-2xl text-lg">
          Simulation Active
        </div>

      </div>
    </div>
  );
}