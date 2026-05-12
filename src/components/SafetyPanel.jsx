import {
  useState,
  useEffect,
} from "react";

import socket from "../services/socket";

// =========================
// SAFETY ACTIONS
// =========================

const safetyActions = [

  {
    type: "ACCIDENT",
    icon: "🚨",
    label: "Accident Ahead",
    color:
      "from-red-600 to-red-500",
  },

  {
    type: "ROADBLOCK",
    icon: "🚧",
    label: "Road Blocked",
    color:
      "from-orange-500 to-amber-500",
  },

  {
    type: "BRAKE",
    icon: "🛑",
    label: "Sudden Brake",
    color:
      "from-yellow-500 to-yellow-400",
  },

  {
    type: "WEATHER",
    icon: "🌧",
    label: "Low Visibility",
    color:
      "from-blue-600 to-cyan-500",
  },

  {
    type: "MEDICAL",
    icon: "🚑",
    label: "Medical Emergency",
    color:
      "from-pink-600 to-rose-500",
  },

  {
    type: "FUEL",
    icon: "⛽",
    label: "Fuel Assistance",
    color:
      "from-green-600 to-emerald-500",
  },
];

export default function SafetyPanel({
  vehicleData,
}) {

  // =========================
  // ALERT STATES
  // =========================

  const [alerts, setAlerts] =
    useState([]);

  // =========================
  // SEND ALERT
  // =========================

  const sendAlert =
    (action) => {

      const payload = {

        id:
          Date.now(),

        type:
          action.type,

        icon:
          action.icon,

        message:
          action.label,

        latitude:
          vehicleData.latitude || 0,

        longitude:
          vehicleData.longitude || 0,

        speed:
          vehicleData.speed || 0,

        heading:
          vehicleData.heading || 0,

        timestamp:
          Date.now(),
      };

      console.log(
        "SENDING ALERT:",
        payload
      );

      // SEND TO SERVER
      socket.emit(
        "safety-alert",
        payload
      );
    };

  // =========================
  // RECEIVE ALERTS
  // =========================

  useEffect(() => {

    socket.on(
      "receive-alert",
      (alert) => {

        console.log(
          "ALERT RECEIVED:",
          alert
        );

        // ADD POPUP
        setAlerts(
          (prev) => [

            ...prev,

            alert,
          ]
        );

        // AUTO REMOVE
        const alertId =
          alert.id;

        setTimeout(() => {

          setAlerts(
            (prev) =>
              prev.filter(
                (a) =>
                  a.id !==
                  alertId
              )
          );

        }, 6000);
      }
    );

    return () => {

      socket.off(
        "receive-alert"
      );
    };

  }, []);

  return (

    <>

      {/* ========================= */}
      {/* ACTION BUTTONS */}
      {/* ========================= */}

      <div className="absolute top-5 left-5 z-50 max-w-[68%]">

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {safetyActions.map(
            (action) => (

              <button
                key={
                  action.type
                }

                onClick={() =>
                  sendAlert(
                    action
                  )
                }

                className={`bg-gradient-to-r ${action.color} rounded-2xl p-4 text-left shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/10`}
              >

                <div className="flex items-start gap-3">

                  {/* ICON */}
                  <div className="text-3xl">

                    {
                      action.icon
                    }

                  </div>

                  {/* TEXT */}
                  <div>

                    <h2 className="text-white font-bold text-lg leading-tight">

                      {
                        action.label
                      }

                    </h2>

                    <p className="text-white/80 text-sm mt-1">

                      Broadcast Warning

                    </p>

                  </div>

                </div>

              </button>
            )
          )}

        </div>

      </div>

      {/* ========================= */}
      {/* ALERT POPUPS */}
      {/* ========================= */}

      <div className="absolute bottom-6 right-6 z-[9999] flex flex-col gap-4">

        {alerts.map(
          (alert) => (

            <div
              key={alert.id}

              className="bg-black/85 backdrop-blur-xl border border-red-500 rounded-2xl p-5 w-80 shadow-[0_0_40px_rgba(255,0,0,0.4)] animate-pulse"
            >

              <div className="flex items-center gap-4">

                {/* ICON */}
                <div className="text-4xl">

                  {
                    alert.icon
                  }

                </div>

                {/* CONTENT */}
                <div>

                  <h2 className="text-white text-xl font-bold">

                    {
                      alert.message
                    }

                  </h2>

                  <p className="text-red-400 text-sm mt-1">

                    Nearby Vehicle Warning

                  </p>

                  <p className="text-slate-400 text-xs mt-2">

                    Speed:
                    {" "}

                    {Math.round(
                      alert.speed || 0
                    )}

                    {" "}
                    km/h

                  </p>

                </div>

              </div>

            </div>
          )
        )}

      </div>

    </>
  );
}