import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Drive from "./pages/Drive";
import LiveMap from "./pages/LiveMap";
import Settings from "./pages/Settings";
import Telemetry from "./pages/Telemetry";
import MatlabMode from "./pages/MatlabMode";

import {
  Routes,
  Route,
} from "react-router-dom";

export default function App() {

  return (

    <div className="flex flex-col md:flex-row bg-slate-950 text-white min-h-screen overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-6">

          <Routes>

            {/* DASHBOARD */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* LIVE MAP */}
            <Route
              path="/map"
              element={<LiveMap />}
            />

            {/* DRIVE */}
            <Route
              path="/drive"
              element={<Drive />}
            />

            {/* CHAT */}
            <Route
              path="/chat"
              element={<Chat />}
            />

            {/* SETTINGS */}
            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* TELEMETRY */}
            <Route
              path="/telemetry"
              element={<Telemetry />}
            />

            {/* MATLAB MODE */}
            <Route
              path="/matlab"
              element={<MatlabMode />}
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}