import {
  useEffect,
  useState,
  useContext,
} from "react";

import { motion } from "framer-motion";

import {
  VehicleContext,
} from "../context/VehicleContext";

import {
  ModeContext,
} from "../context/ModeContext";

import RealRoadView from "../components/RealRoadView";

export default function LiveMap() {

  const {
    vehicleData,
  } = useContext(
    VehicleContext
  );

  const { mode } =
    useContext(
      ModeContext
    );

  // =========================
  // VEHICLE SPEED
  // =========================

  const currentSpeed =
    Math.max(
      0,
      Number(vehicleData.speed) || 0
    );

  // =========================
  // LANES
  // =========================

  const lanes = [
    30,
    50,
    70,
  ];

  // =========================
  // VEHICLES
  // =========================

  const [cars, setCars] =
    useState([

      {
        id: 1,
        lane: 50,
        targetLane: 50,
        y: 65,
        color: "bg-white",
        main: true,
        speed: 0,
      },

      {
        id: 2,
        lane: 30,
        targetLane: 30,
        y: -20,
        color: "bg-red-500",
        speed: 2,
      },

      {
        id: 3,
        lane: 70,
        targetLane: 70,
        y: -120,
        color: "bg-cyan-500",
        speed: 3,
      },

      {
        id: 4,
        lane: 50,
        targetLane: 50,
        y: -240,
        color: "bg-slate-400",
        speed: 1.5,
      },
    ]);

  // =========================
  // REALISTIC TRAFFIC SYSTEM
  // =========================

  useEffect(() => {

    if (
      mode !== "demo" &&
      mode !== "matlab"
    ) {
      return;
    }

    const interval =
      setInterval(() => {

        setCars(
          (prevCars) => {

            return prevCars.map(
              (car) => {

                // MAIN VEHICLE
                if (car.main) {
                  return car;
                }

                // STOP ALL TRAFFIC
                // WHEN SPEED = 0
                if (
                  currentSpeed <= 0
                ) {

                  return {
                    ...car,
                  };
                }

                // RELATIVE SPEED
                const relativeSpeed =
                  currentSpeed * 0.08 -
                  car.speed;

                let newY =
                  car.y +
                  relativeSpeed;

                let targetLane =
                  car.targetLane;

                // RANDOM LANE CHANGE
                if (
                  Math.random() < 0.003
                ) {

                  const availableLanes =
                    lanes.filter(
                      (lane) =>
                        lane !==
                        car.targetLane
                    );

                  const nextLane =
                    availableLanes[
                      Math.floor(
                        Math.random() *
                        availableLanes.length
                      )
                    ];

                  // SAFE CHECK
                  const safe =
                    !prevCars.some(
                      (otherCar) => {

                        if (
                          otherCar.id ===
                          car.id
                        ) {
                          return false;
                        }

                        return (

                          Math.abs(
                            otherCar.lane -
                            nextLane
                          ) < 8 &&

                          Math.abs(
                            otherCar.y -
                            newY
                          ) < 40
                        );
                      }
                    );

                  if (safe) {

                    targetLane =
                      nextLane;
                  }
                }

                // SMOOTH LANE CHANGE
                const smoothLane =
                  car.lane +
                  (
                    targetLane -
                    car.lane
                  ) * 0.05;

                // COLLISION PREVENTION
                prevCars.forEach(
                  (otherCar) => {

                    if (
                      otherCar.id ===
                      car.id
                    ) {
                      return;
                    }

                    const sameLane =
                      Math.abs(
                        smoothLane -
                        otherCar.lane
                      ) < 8;

                    const distance =
                      otherCar.y -
                      newY;

                    if (
                      sameLane &&
                      distance > 0 &&
                      distance < 35
                    ) {

                      newY =
                        otherCar.y - 35;
                    }
                  }
                );

                // RESPAWN
                if (newY > 130) {

                  const spawnLane =
                    lanes[
                      Math.floor(
                        Math.random() *
                        lanes.length
                      )
                    ];

                  return {

                    ...car,

                    lane:
                      spawnLane,

                    targetLane:
                      spawnLane,

                    y:
                      -150 -
                      Math.random() * 300,
                  };
                }

                return {

                  ...car,

                  lane:
                    smoothLane,

                  targetLane,

                  y: newY,
                };
              }
            );
          }
        );

      }, 50);

    return () =>
      clearInterval(
        interval
      );

  }, [
    currentSpeed,
    mode,
  ]);

  // =========================
  // REAL MODE
  // =========================

  if (mode === "real") {

    return (

      <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ROAD VIEW */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-slate-800 bg-black relative min-h-[500px]">

          <RealRoadView />

        </div>

        {/* STATUS */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col">

          <h2 className="text-2xl font-bold mb-8 text-white">

            Autonomous Status

          </h2>

        </div>

      </div>
    );
  }

  // =========================
  // DEMO + MATLAB UI
  // =========================

  return (

    <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6">

      {/* ROAD */}
      <div className="lg:col-span-3 relative overflow-hidden rounded-2xl border border-slate-800 bg-black min-h-[500px]">

        {/* SKY */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-sky-500 to-slate-700"></div>

        {/* ROAD */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-full bg-slate-900"
          style={{
            clipPath:
              "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
          }}
        >

          {/* ROAD LINES */}
          {currentSpeed > 0 &&

            [...Array(15)].map(
              (_, i) => (

                <motion.div
                  key={i}

                  animate={{
                    y: [
                      "-150%",
                      "900%",
                    ],
                  }}

                  transition={{
                    repeat:
                      Infinity,

                    duration:
                      Math.max(
                        0.08,
                        2.2 -
                        currentSpeed / 90
                      ),

                    ease:
                      "linear",

                    delay:
                      i * 0.15,
                  }}

                  className="absolute left-1/2 w-3 h-32 bg-white/70"

                  style={{
                    top:
                      `${i * 90}px`,
                  }}
                />
              )
            )
          }

          {/* STATIC ROAD LINES */}
          {currentSpeed <= 0 &&

            [...Array(15)].map(
              (_, i) => (

                <div
                  key={i}

                  className="absolute left-1/2 w-3 h-32 bg-white/70"

                  style={{
                    top:
                      `${i * 90}px`,
                  }}
                />
              )
            )
          }

          {/* LANE DIVIDERS */}
          <div className="absolute left-1/3 top-0 h-full border-l-2 border-white/20"></div>

          <div className="absolute left-2/3 top-0 h-full border-l-2 border-white/20"></div>

          {/* VEHICLES */}
          {cars.map(
            (car) => (

              <motion.div
                key={car.id}

                animate={{
                  left:
                    `${car.lane}%`,

                  top:
                    `${car.y}%`,

                  rotate:
                    car.main
                      ? vehicleData.steering / 3
                      : 0,
                }}

                transition={{
                  type:
                    "tween",

                  duration:
                    0.08,
                }}

                className={`absolute ${
                  car.main
                    ? "w-20 h-36"
                    : "w-16 h-28"
                } -translate-x-1/2 rounded-2xl shadow-2xl`}
              >

                <div
                  className={`w-full h-full ${car.color} rounded-2xl relative border border-black/30`}
                >

                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-16 bg-black/50 rounded-xl"></div>

                  <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-300 rounded-full"></div>

                  <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 rounded-full"></div>

                  <div className="absolute bottom-2 left-2 w-3 h-3 bg-red-500 rounded-full"></div>

                  <div className="absolute bottom-2 right-2 w-3 h-3 bg-red-500 rounded-full"></div>

                  {car.main && (

                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-cyan-400 font-bold whitespace-nowrap">

                      YOUR VEHICLE

                    </div>

                  )}

                </div>

              </motion.div>
            )
          )}

        </div>

      </div>

      {/* STATUS PANEL */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col">

        <h2 className="text-2xl font-bold mb-8 text-white">

          Vehicle Status

        </h2>

        <div className="flex justify-center mb-10">

          <div className="w-48 h-48 rounded-full border-[12px] border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.5)]">

            <p className="text-5xl font-bold text-cyan-400">

              {Math.round(
                currentSpeed
              )}

            </p>

            <p className="text-xl text-slate-300">

              km/h

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}