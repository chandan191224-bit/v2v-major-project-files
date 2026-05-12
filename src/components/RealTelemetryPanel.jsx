import {
  useContext,
  useMemo,
} from "react";

import {
  VehicleContext,
} from "../context/VehicleContext";

export default function RealTelemetryPanel() {

  const { vehicleData } =
    useContext(VehicleContext);

  // RISK STATUS
  const drivingStatus =
    useMemo(() => {

      if (
        vehicleData.harshBraking
      ) {

        return {
          text:
            "HARSH BRAKING",
          color:
            "text-red-400",
        };
      }

      if (
        vehicleData.overspeed
      ) {

        return {
          text:
            "OVERSPEED",
          color:
            "text-yellow-400",
        };
      }

      return {
        text:
          "NORMAL",
        color:
          "text-green-400",
      };

    }, [vehicleData]);

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

      {/* SPEED */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

        <p className="text-slate-400 mb-3">
          Real Speed
        </p>

        <h2 className="text-5xl font-bold text-cyan-400">

          {vehicleData.speed || 0}

        </h2>

        <span className="text-slate-500">
          km/h
        </span>

      </div>

      {/* ACCELERATION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

        <p className="text-slate-400 mb-3">
          Acceleration
        </p>

        <h2 className={`text-5xl font-bold ${
          vehicleData.acceleration >= 0
            ? "text-green-400"
            : "text-red-400"
        }`}>

          {vehicleData.acceleration || 0}

        </h2>

        <span className="text-slate-500">
          km/h²
        </span>

      </div>

      {/* DISTANCE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

        <p className="text-slate-400 mb-3">
          Trip Distance
        </p>

        <h2 className="text-5xl font-bold text-yellow-400">

          {vehicleData.tripDistance || 0}

        </h2>

        <span className="text-slate-500">
          km
        </span>

      </div>

      {/* STATUS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

        <p className="text-slate-400 mb-3">
          Driving Status
        </p>

        <h2 className={`text-3xl font-bold ${
          drivingStatus.color
        }`}>

          {drivingStatus.text}

        </h2>

      </div>

    </div>
  );
}