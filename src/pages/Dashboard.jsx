import {
  useContext,
  useMemo,
} from "react";

import {
  VehicleContext,
} from "../context/VehicleContext";

import {
  ModeContext,
} from "../context/ModeContext";

import {
  FaCar,
  FaWifi,
  FaSatelliteDish,
  FaExclamationTriangle,
  FaRoad,
  FaMicrochip,
  FaMapMarkerAlt,
  FaTachometerAlt,
} from "react-icons/fa";

export default function Dashboard() {

  const { vehicleData } =
    useContext(VehicleContext);

  const { mode } =
    useContext(ModeContext);

  // CONNECTION STATUS
  const systemOnline =
    useMemo(() => {

      if (mode === "demo")
        return true;

      if (mode === "matlab") {

        return (
          vehicleData.vehicleID !== 0
        );
      }

      return (
        vehicleData.latitude !== 0
      );

    }, [
      vehicleData,
      mode,
    ]);

  // RISK TEXT
  const riskText =
    useMemo(() => {

      const risk =
        Number(
          vehicleData.riskLevel || 0
        );

      if (risk <= 1)
        return "LOW";

      if (risk <= 3)
        return "MEDIUM";

      return "HIGH";

    }, [vehicleData]);

  return (

    <div className="space-y-6 w-full overflow-x-hidden">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

        <div>

          <h1 className="text-2xl md:text-5xl font-bold">

            {mode === "demo" &&
              "Simulation Dashboard"}

            {mode === "matlab" &&
              "MATLAB Dashboard"}

            {mode === "real" &&
              "Real World Dashboard"}

          </h1>

          <p className="text-slate-400 mt-3 text-sm md:text-lg">

            {mode === "demo" &&
              "AI Vehicle Simulation Environment"}

            {mode === "matlab" &&
              "Live Simulink Telemetry & V2V Analytics"}

            {mode === "real" &&
              "Real GPS & Vehicle Tracking"}

          </p>

        </div>

        {/* STATUS */}
        <div className="flex flex-col md:flex-row gap-3">

          <div className="bg-slate-900 px-4 py-3 rounded-2xl border border-slate-800 flex items-center gap-3">

            <div className={`w-3 h-3 rounded-full ${
              systemOnline
                ? "bg-green-500"
                : "bg-red-500"
            }`} />

            <span className="font-semibold text-sm md:text-base">

              {systemOnline
                ? "System Online"
                : "Disconnected"}

            </span>

          </div>

          <div className="bg-slate-900 px-4 py-3 rounded-2xl border border-slate-800">

            <span className="text-slate-400 text-sm">
              Current Mode:
            </span>

            <span className="ml-2 font-bold text-cyan-400 uppercase text-sm md:text-base">
              {mode}
            </span>

          </div>

        </div>

      </div>

      {/* PRIMARY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* CARD */}
        {[

          {
            title: "Primary Speed",
            value: Math.round(
              vehicleData.speed ||
              vehicleData.avgSpeed ||
              0
            ),
            icon: <FaTachometerAlt className="text-3xl text-cyan-400" />,
            color: "text-cyan-400",
            footer: "km/h",
          },

          {
            title: "Vehicle ID",
            value: vehicleData.vehicleID || "N/A",
            icon: <FaCar className="text-3xl text-green-400" />,
            color: "text-green-400",
            footer: "Active vehicle",
          },

          {
            title: "Risk Analysis",
            value: riskText,
            icon: <FaExclamationTriangle className="text-3xl text-red-400" />,
            color:
              riskText === "LOW"
                ? "text-green-400"
                : riskText === "MEDIUM"
                ? "text-yellow-400"
                : "text-red-400",
            footer: "AI safety prediction",
          },

          {
            title: "Network Latency",
            value: vehicleData.latency || 0,
            icon: <FaWifi className="text-3xl text-yellow-400" />,
            color: "text-yellow-400",
            footer: "milliseconds",
          },

        ].map((card, index) => (

          <div
            key={index}
            className="bg-slate-900 p-5 rounded-3xl border border-slate-800"
          >

            <div className="flex justify-between items-center mb-4">

              <div>

                <p className="text-slate-400 mb-2 text-sm">

                  {card.title}

                </p>

                <h2 className={`text-3xl md:text-5xl font-bold ${card.color}`}>

                  {card.value}

                </h2>

              </div>

              {card.icon}

            </div>

            <span className="text-slate-500 text-sm">

              {card.footer}

            </span>

          </div>

        ))}

      </div>

      {/* SECONDARY SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* SYSTEM ANALYTICS */}
        <div className="xl:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-5">

          <h2 className="text-2xl md:text-3xl font-bold mb-6">

            Vehicle Intelligence

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {[
              {
                title: "Minimum Distance",
                value: vehicleData.minDist || 0,
                icon: <FaRoad className="text-3xl text-cyan-400" />,
                color: "text-cyan-400",
                footer: "meters",
              },

              {
                title: "Simulation FPS",
                value: vehicleData.fps || 60,
                icon: <FaMicrochip className="text-3xl text-green-400" />,
                color: "text-green-400",
                footer: "rendering performance",
              },

              {
                title: "Steering Angle",
                value: vehicleData.steering || 0,
                icon: <FaCar className="text-3xl text-yellow-400" />,
                color: "text-yellow-400",
                footer: "degrees",
              },

              {
                title: "MATLAB Mode",
                value: vehicleData.modeValue || 0,
                icon: <FaSatelliteDish className="text-3xl text-pink-400" />,
                color: "text-pink-400",
                footer: "Simulink state",
              },

            ].map((item, index) => (

              <div
                key={index}
                className="bg-slate-950 p-5 rounded-2xl"
              >

                <div className="flex items-center gap-4 mb-4">

                  {item.icon}

                  <div>

                    <p className="text-slate-400 text-sm">

                      {item.title}

                    </p>

                    <h3 className={`text-3xl md:text-4xl font-bold ${item.color}`}>

                      {item.value}

                    </h3>

                  </div>

                </div>

                <span className="text-slate-500 text-sm">

                  {item.footer}

                </span>

              </div>

            ))}

          </div>

        </div>

        {/* GPS PANEL */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5">

          <h2 className="text-2xl md:text-3xl font-bold mb-6">

            GPS & Tracking

          </h2>

          <div className="space-y-4">

            {[
              {
                title: "Latitude",
                value: vehicleData.latitude || "N/A",
                color: "text-cyan-400",
              },

              {
                title: "Longitude",
                value: vehicleData.longitude || "N/A",
                color: "text-green-400",
              },

              {
                title: "Data Source",
                value: vehicleData.source || "Unknown",
                color: "text-yellow-400",
              },

            ].map((item, index) => (

              <div
                key={index}
                className="bg-slate-950 p-4 rounded-2xl"
              >

                <div className="flex items-center gap-3 mb-3">

                  <FaMapMarkerAlt className={`${item.color} text-xl`} />

                  <p className="text-slate-400 text-sm">

                    {item.title}

                  </p>

                </div>

                <h3 className={`text-lg md:text-2xl font-bold ${item.color} break-all`}>

                  {item.value}

                </h3>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}