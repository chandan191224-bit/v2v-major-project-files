import {
  useContext,
} from "react";

import {
  VehicleContext,
} from "../context/VehicleContext";

export default function MatlabMode() {

  const { vehicleData } =
    useContext(VehicleContext);

  return (
    <div>

      {/* TITLE */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          MATLAB Telemetry
        </h1>

        <p className="text-slate-400 mt-2">
          Live Simulink telemetry data
        </p>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 gap-6">

        {/* VEHICLE ID */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-slate-400 mb-3">
            Vehicle ID
          </h2>

          <p className="text-5xl font-bold text-cyan-400">
            {vehicleData.vehicleID ?? 0}
          </p>

        </div>

        {/* AVG SPEED */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-slate-400 mb-3">
            Average Speed
          </h2>

          <p className="text-5xl font-bold text-green-400">
            {vehicleData.avgSpeed ?? 0}
          </p>

          <span className="text-slate-500">
            km/h
          </span>

        </div>

        {/* MIN DIST */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-slate-400 mb-3">
            Minimum Distance
          </h2>

          <p className="text-5xl font-bold text-yellow-400">
            {vehicleData.minDist ?? 0}
          </p>

          <span className="text-slate-500">
            meters
          </span>

        </div>

        {/* RISK */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-slate-400 mb-3">
            Risk Level
          </h2>

          <p className="text-5xl font-bold text-red-400">
            {vehicleData.riskLevel ?? 0}
          </p>

        </div>

      </div>

      {/* DEBUG PANEL */}
      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-4">
          Raw Incoming Data
        </h2>

        <pre className="text-green-400 overflow-auto">
          {JSON.stringify(
            vehicleData,
            null,
            2
          )}
        </pre>

      </div>

    </div>
  );
}