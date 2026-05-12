import {
  useContext,
  useEffect,
} from "react";

import {
  motion,
} from "framer-motion";

import socket from "../services/socket";

import {
  VehicleContext,
} from "../context/VehicleContext";

export default function Drive() {

  const {
    vehicleData,
    setVehicleData,
  } = useContext(
    VehicleContext
  );

  // UPDATE VEHICLE
  const updateVehicle = (
    changes
  ) => {

    const updated = {
      ...vehicleData,
      ...changes,
    };

    setVehicleData(updated);

    socket.emit(
      "vehicle-data",
      updated
    );
  };

  // KEYBOARD CONTROLS
  useEffect(() => {

    const handleKey = (e) => {

      if (
        e.key === "ArrowUp"
      ) {

        updateVehicle({
          speed: Math.min(
            vehicleData.speed + 2,
            180
          ),
        });
      }

      if (
        e.key === "ArrowDown"
      ) {

        updateVehicle({
          speed: Math.max(
            vehicleData.speed - 2,
            0
          ),
        });
      }

      if (
        e.key === "ArrowLeft"
      ) {

        updateVehicle({
          steering:
            vehicleData.steering - 3,
        });
      }

      if (
        e.key === "ArrowRight"
      ) {

        updateVehicle({
          steering:
            vehicleData.steering + 3,
        });
      }
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKey
      );
    };

  }, [vehicleData]);

  return (
    <div className="grid grid-cols-2 gap-6">

      {/* LEFT PANEL */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

        <h1 className="text-3xl font-bold mb-8">
          Drive Control
        </h1>

        {/* STEERING WHEEL */}
        <div className="flex justify-center mb-10">

          <motion.div
            animate={{
              rotate:
                vehicleData.steering,
            }}

            transition={{
              type: "spring",
              stiffness: 100,
            }}

            className="w-56 h-56 border-[16px] border-blue-500 rounded-full flex items-center justify-center"
          >

            <div className="w-6 h-24 bg-blue-500 rounded-full"></div>
          </motion.div>
        </div>

        {/* CONTROLS */}
        <div className="grid grid-cols-2 gap-4">

          <button
            onClick={() =>
              updateVehicle({
                speed:
                  vehicleData.speed + 2,
              })
            }

            className="bg-green-600 hover:bg-green-700 p-4 rounded-xl text-xl font-bold"
          >
            Accelerate
          </button>

          <button
            onClick={() =>
              updateVehicle({
                speed: Math.max(
                  0,
                  vehicleData.speed - 2
                ),
              })
            }

            className="bg-red-600 hover:bg-red-700 p-4 rounded-xl text-xl font-bold"
          >
            Brake
          </button>

          <button
            onClick={() =>
              updateVehicle({
                steering:
                  vehicleData.steering - 3,
              })
            }

            className="bg-slate-700 hover:bg-slate-600 p-4 rounded-xl text-xl"
          >
            Left
          </button>

          <button
            onClick={() =>
              updateVehicle({
                steering:
                  vehicleData.steering + 3,
              })
            }

            className="bg-slate-700 hover:bg-slate-600 p-4 rounded-xl text-xl"
          >
            Right
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col justify-center items-center">

        <h2 className="text-3xl font-bold mb-8">
          Speedometer
        </h2>

        <div className="relative w-72 h-72 rounded-full border-[18px] border-blue-500 flex items-center justify-center">

          <div className="text-center">

            <p className="text-7xl font-bold text-blue-500">
              {Math.round(
                vehicleData.speed
              )}
            </p>

            <p className="text-xl text-slate-400">
              km/h
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">

          <p className="text-xl mb-2">
            Steering Angle
          </p>

          <p className="text-5xl font-bold text-green-500">
            {Math.round(
              vehicleData.steering
            )}°
          </p>
        </div>
      </div>
    </div>
  );
}