import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import socket from "../services/socket";

import {
  ModeContext,
} from "./ModeContext";

// CONTEXT
export const VehicleContext =
  createContext();

// PROVIDER
export default function VehicleProvider({
  children,
}) {

  // CURRENT MODE
  const { mode } =
    useContext(
      ModeContext
    );

  // PREVIOUS SPEED
  const prevSpeedRef =
    useRef(0);

  // VEHICLE ID
  const vehicleIdRef =
    useRef(null);

  // GENERATE VEHICLE ID
  useEffect(() => {

    let savedId =
      localStorage.getItem(
        "vehicleID"
      );

    if (!savedId) {

      savedId =
        "CAR_" +
        Math.floor(
          Math.random() *
          100000
        );

      localStorage.setItem(
        "vehicleID",
        savedId
      );
    }

    vehicleIdRef.current =
      savedId;

  }, []);

  // =========================
  // DEMO STATE
  // =========================

  const demoState = {

    speed: 45,

    steering: 0,

    acceleration: 0,

    tripDistance: 0,

    harshBraking: false,

    overspeed: false,

    latency: 18,

    fps: 60,

    source:
      "Demo Simulation",
  };

  // =========================
  // MATLAB STATE
  // =========================

  const matlabState = {

    speed: 0,

    steering: 0,

    acceleration: 0,

    tripDistance: 0,

    harshBraking: false,

    overspeed: false,

    latency: 0,

    fps: 60,

    vehicleID: 0,

    avgSpeed: 0,

    minDist: 0,

    riskLevel: 0,

    modeValue: 0,

    source:
      "MATLAB Waiting...",
  };

  // =========================
  // REAL STATE
  // =========================

  const realState = {

    speed: 0,

    steering: 0,

    acceleration: 0,

    tripDistance: 0,

    harshBraking: false,

    overspeed: false,

    latitude: 0,

    longitude: 0,

    heading: 0,

    accuracy: 0,

    latency: 5,

    fps: 60,

    source:
      "GPS Waiting...",
  };

  // =========================
  // GLOBAL DATA
  // =========================

  const [
    vehicleData,
    setVehicleData,
  ] = useState(
    demoState
  );

  // =========================
  // RESET ON MODE CHANGE
  // =========================

  useEffect(() => {

    if (mode === "demo") {

      setVehicleData(
        demoState
      );
    }

    else if (
      mode === "matlab"
    ) {

      setVehicleData(
        matlabState
      );
    }

    else if (
      mode === "real"
    ) {

      setVehicleData(
        realState
      );
    }

  }, [mode]);

  // =========================
  // DEMO MODE
  // =========================

  useEffect(() => {

    if (mode !== "demo")
      return;

    console.log(
      "DEMO MODE ACTIVE"
    );

    const interval =
      setInterval(() => {

        setVehicleData(
          (prev) => {

            const newSpeed =
              Math.max(
                0,
                prev.speed +
                (
                  Math.random() *
                  10 -
                  5
                )
              );

            const acceleration =
              Number(
                (
                  newSpeed -
                  prev.speed
                ).toFixed(2)
              );

            return {

              ...prev,

              speed:
                newSpeed,

              steering:
                Math.floor(
                  Math.random() *
                  40 -
                  20
                ),

              acceleration,

              harshBraking:
                acceleration < -8,

              overspeed:
                newSpeed > 100,

              tripDistance:
                Number(
                  (
                    prev.tripDistance +
                    newSpeed /
                    3600
                  ).toFixed(2)
                ),

              latency:
                Math.floor(
                  Math.random() *
                  30
                ),

              fps: 60,

              source:
                "Demo Simulation",
            };
          }
        );

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, [mode]);

  // =========================
  // MATLAB MODE
  // =========================

  useEffect(() => {

    if (mode !== "matlab")
      return;

    console.log(
      "MATLAB MODE ACTIVE"
    );

    const handleMatlabData =
      (data) => {

        const speed =
          Number(
            data.avgSpeed
          ) || 0;

        const previousSpeed =
          prevSpeedRef.current;

        const acceleration =
          Number(
            (
              speed -
              previousSpeed
            ).toFixed(2)
          );

        prevSpeedRef.current =
          speed;

        setVehicleData(
          (prev) => {

            return {

              speed,

              steering:
                Number(
                  data.riskLevel
                ) * 5 || 0,

              acceleration,

              harshBraking:
                acceleration < -8,

              overspeed:
                speed > 100,

              tripDistance:
                Number(
                  (
                    prev.tripDistance +
                    speed /
                    3600
                  ).toFixed(2)
                ),

              latency:
                Number(
                  data.minDist
                ) || 0,

              fps: 60,

              vehicleID:
                Number(
                  data.vehicleID
                ) || 0,

              avgSpeed:
                speed,

              minDist:
                Number(
                  data.minDist
                ) || 0,

              riskLevel:
                Number(
                  data.riskLevel
                ) || 0,

              modeValue:
                Number(
                  data.mode
                ) || 0,

              source:
                "MATLAB Simulink",
            };
          }
        );
      };

    socket.off(
      "matlab-data"
    );

    socket.on(
      "matlab-data",
      handleMatlabData
    );

    return () => {

      socket.off(
        "matlab-data",
        handleMatlabData
      );

    };

  }, [mode]);

  // =========================
  // REAL MODE
  // =========================

  useEffect(() => {

    if (mode !== "real")
      return;

    console.log(
      "REAL MODE ACTIVE"
    );

    if (
      navigator.geolocation
    ) {

      const watchId =
        navigator.geolocation.watchPosition(

          (position) => {

            const currentSpeed =
              Math.round(

                position.coords
                  .speed

                  ? position.coords
                    .speed * 3.6

                  : 0
              );

            const previousSpeed =
              prevSpeedRef.current;

            const acceleration =
              Number(
                (
                  currentSpeed -
                  previousSpeed
                ).toFixed(2)
              );

            prevSpeedRef.current =
              currentSpeed;

            const updatedData = {

              speed:
                currentSpeed,

              steering:
                Math.floor(
                  Math.random() *
                  20 -
                  10
                ),

              acceleration,

              harshBraking:
                acceleration < -8,

              overspeed:
                currentSpeed >
                100,

              tripDistance:
                Number(
                  (
                    vehicleData.tripDistance +
                    currentSpeed /
                    3600
                  ).toFixed(2)
                ),

              latitude:
                position.coords
                  .latitude,

              longitude:
                position.coords
                  .longitude,

              heading:
                position.coords
                  .heading || 0,

              accuracy:
                position.coords
                  .accuracy || 0,

              latency: 5,

              fps: 60,

              source:
                "Real GPS System",
            };

            // UPDATE UI
            setVehicleData(
              updatedData
            );

            // SEND TO SERVER
            socket.emit(
              "vehicle-update",
              {

                vehicleID:
                  vehicleIdRef.current,

                latitude:
                  updatedData.latitude,

                longitude:
                  updatedData.longitude,

                speed:
                  updatedData.speed,

                heading:
                  updatedData.heading,

                timestamp:
                  Date.now(),
              }
            );

          },

          (err) => {

            console.log(
              "GPS ERROR:",
              err
            );

          },

          {

            enableHighAccuracy: true,

            maximumAge: 0,

            timeout: 5000,
          }
        );

      return () => {

        navigator.geolocation.clearWatch(
          watchId
        );

      };
    }

  }, [
    mode,
    vehicleData.tripDistance,
  ]);

  // =========================
  // PROVIDER
  // =========================

  return (

    <VehicleContext.Provider
      value={{
        vehicleData,
        setVehicleData,
      }}
    >

      {children}

    </VehicleContext.Provider>
  );
}