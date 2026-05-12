import {
  FaCar,
  FaChartLine,
  FaCog,
  FaComments,
  FaTachometerAlt,
  FaMapMarkedAlt,
  FaBars,
} from "react-icons/fa";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  useState,
} from "react";

export default function Sidebar() {

  const location =
    useLocation();

  const [
    mobileMenu,
    setMobileMenu,
  ] = useState(false);

  // MENU ITEMS
  const menu = [

    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/",
    },

    {
      name: "Live Map",
      icon: <FaMapMarkedAlt />,
      path: "/map",
    },

    {
      name: "Drive Control",
      icon: <FaCar />,
      path: "/drive",
    },

    {
      name: "Telemetry",
      icon: <FaChartLine />,
      path: "/telemetry",
    },

    {
      name: "Team Chat",
      icon: <FaComments />,
      path: "/chat",
    },

    {
      name: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];

  return (

    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">

        <h1 className="text-2xl font-bold text-cyan-400">
          SIMULINK
        </h1>

        <button
          onClick={() =>
            setMobileMenu(
              !mobileMenu
            )
          }
          className="text-2xl text-white"
        >

          <FaBars />

        </button>

      </div>

      {/* SIDEBAR */}
      <div
        className={`

        fixed md:relative z-50 top-0 left-0 h-full

        w-72 bg-slate-900 border-r border-slate-800

        p-5 flex flex-col

        transition-transform duration-300

        ${

          mobileMenu
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"

        }

        `}
      >

        {/* LOGO */}
        <div className="mb-10 hidden md:block">

          <h1 className="text-4xl font-bold text-cyan-400 tracking-wide">

            SIMULINK

          </h1>

          <p className="text-slate-400 mt-2">

            Intelligent Vehicle Platform

          </p>

        </div>

        {/* MENU */}
        <div className="space-y-3 flex-1 overflow-y-auto">

          {menu.map((item) => {

            const isActive =
              location.pathname ===
              item.path;

            return (

              <Link
                key={item.name}
                to={item.path}

                onClick={() =>
                  setMobileMenu(false)
                }

                className={`

                w-full flex items-center gap-4

                p-4 rounded-2xl

                transition-all duration-300 border

                ${

                  isActive

                    ? "bg-cyan-500 text-black border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)]"

                    : "bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"

                }

                `}
              >

                {/* ICON */}
                <span className="text-xl">

                  {item.icon}

                </span>

                {/* TEXT */}
                <span className="text-base md:text-lg font-semibold">

                  {item.name}

                </span>

              </Link>

            );
          })}

        </div>

        {/* FOOTER */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-800 border border-slate-700">

          <div className="flex items-center gap-3 mb-2">

            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

            <span className="font-semibold">

              System Online

            </span>

          </div>

          <p className="text-slate-400 text-sm">

            Vehicle Monitoring Active

          </p>

        </div>

      </div>
    </>
  );
}