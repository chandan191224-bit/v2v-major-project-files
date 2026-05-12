import TelemetryChart from "../components/TelemetryChart";

import {
  useContext,
} from "react";

import {
  VehicleContext,
} from "../context/VehicleContext";

export default function Telemetry() {

  const { vehicleData } =
    useContext(VehicleContext);

  return (
    <div>

      {/* PAGE TITLE */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Telemetry Analytics
        </h1>

        <p className="text-slate-400 mt-2">
          Real-time vehicle telemetry monitoring
        </p>

      </div>

      {/* LIVE DATA CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        {/* SPEED */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-slate-400 mb-3">
            Vehicle Speed
          </h2>

          <p className="text-5xl font-bold text-cyan-400">
            {Math.round(
              vehicleData.speed
            )}
          </p>

          <span className="text-slate-500">
            km/h
          </span>

        </div>

        {/* STEERING */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-slate-400 mb-3">
            Steering Angle
          </h2>

          <p className="text-5xl font-bold text-green-400">
            {vehicleData.steering}
          </p>

          <span className="text-slate-500">
            degrees
          </span>

        </div>

        {/* LATENCY */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-slate-400 mb-3">
            Network Latency
          </h2>

          <p className="text-5xl font-bold text-yellow-400">
            {vehicleData.latency}
          </p>

          <span className="text-slate-500">
            ms
          </span>

        </div>

      </div>

      {/* GRAPH */}
      <TelemetryChart />

    </div>
  );
}