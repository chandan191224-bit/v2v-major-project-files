import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  VehicleContext,
} from "../context/VehicleContext";

import socket from "../services/socket";

import {
  projectVehicle,
} from "../utils/projection";

import {
  fetchRoadGeometry,
} from "../services/roadService";

export default function RealRoadView() {

  const {
    vehicleData,
  } = useContext(
    VehicleContext
  );

  const [nearbyVehicles,
    setNearbyVehicles] =
      useState([]);

  const [roads,
    setRoads] =
      useState([]);

  // ROAD FETCH
  useEffect(() => {

    if (
      !vehicleData.latitude ||
      !vehicleData.longitude
    ) {
      return;
    }

    fetchRoadGeometry(
      vehicleData.latitude,
      vehicleData.longitude
    ).then((data) => {

      setRoads(
        data.elements || []
      );

    });

  }, [
    vehicleData.latitude,
    vehicleData.longitude,
  ]);

  // VEHICLE LISTENER
  useEffect(() => {

    socket.on(
      "nearby-vehicles",
      (data) => {

        const projected =
          data.nearbyVehicles.map(
            (vehicle) =>
              projectVehicle(
                vehicleData,
                vehicle
              )
          );

        setNearbyVehicles(
          projected
        );
      }
    );

    return () => {

      socket.off(
        "nearby-vehicles"
      );
    };

  }, [vehicleData]);

  return (

    <div className="relative w-full h-full overflow-hidden bg-[#050816]">

      {/* ROAD GEOMETRY */}
      {roads.map((road, idx) => {

        if (!road.geometry)
          return null;

        return (

          <svg
            key={idx}
            className="absolute inset-0 w-full h-full"
          >

            <polyline
              points={road.geometry
                .map((point) => {

                  const x =
                    (point.lon -
                      vehicleData.longitude) *
                    90000 +
                    window.innerWidth / 2;

                  const y =
                    (vehicleData.latitude -
                      point.lat) *
                    90000 +
                    window.innerHeight / 2;

                  return `${x},${y}`;

                })
                .join(" ")}

              stroke="#1e293b"
              strokeWidth="40"
              fill="none"
              strokeLinecap="round"
            />

            <polyline
              points={road.geometry
                .map((point) => {

                  const x =
                    (point.lon -
                      vehicleData.longitude) *
                    90000 +
                    window.innerWidth / 2;

                  const y =
                    (vehicleData.latitude -
                      point.lat) *
                    90000 +
                    window.innerHeight / 2;

                  return `${x},${y}`;

                })
                .join(" ")}

              stroke="#ffffff55"
              strokeWidth="3"
              fill="none"
              strokeDasharray="20 20"
            />

          </svg>
        );
      })}

      {/* YOUR VEHICLE */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-36 bg-cyan-400 rounded-3xl shadow-[0_0_40px_#22d3ee] z-50"
      >

        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-14 rounded-xl bg-slate-900"></div>

      </div>

      {/* OTHER VEHICLES */}
      {nearbyVehicles.map(
        (vehicle, idx) => (

          <div
            key={idx}

            className="absolute w-16 h-28 bg-red-500 rounded-2xl z-40 transition-all duration-300"

            style={{

              left:
                `calc(50% + ${vehicle.x}px)`,

              top:
                `calc(50% - ${vehicle.y}px)`,

              transform:
                `translate(-50%, -50%) rotate(${vehicle.heading}deg)`,
            }}
          />
        )
      )}

    </div>
  );
}