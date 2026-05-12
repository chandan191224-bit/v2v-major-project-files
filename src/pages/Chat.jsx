import {
  useState,
  useEffect,
  useContext,
} from "react";

import socket from "../services/socket";

import {
  VehicleContext,
} from "../context/VehicleContext";

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

export default function TeamChat() {

  const {
    vehicleData,
  } = useContext(
    VehicleContext
  );

  const [messages,
    setMessages] =
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

      socket.emit(
        "safety-alert",
        payload
      );

      // ADD TO LOCAL CHAT
      setMessages(
        (prev) => [

          payload,

          ...prev,
        ]
      );
    };

  // =========================
  // RECEIVE ALERTS
  // =========================

  useEffect(() => {

    socket.on(
      "receive-alert",
      (alert) => {

        setMessages(
          (prev) => [

            alert,

            ...prev,
          ]
        );
      }
    );

    return () => {

      socket.off(
        "receive-alert"
      );
    };

  }, []);

  return (

    <div className="h-full grid grid-cols-3 gap-6">

      {/* ACTION PANEL */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

        <h2 className="text-3xl font-bold text-white mb-6">

          Safety Broadcast

        </h2>

        <div className="space-y-4">

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

                className={`w-full bg-gradient-to-r ${action.color} rounded-2xl p-5 text-left hover:scale-[1.02] transition-all shadow-2xl`}
              >

                <div className="flex items-center gap-4">

                  <div className="text-4xl">

                    {
                      action.icon
                    }

                  </div>

                  <div>

                    <h2 className="text-white text-xl font-bold">

                      {
                        action.label
                      }

                    </h2>

                    <p className="text-white/80 text-sm">

                      Broadcast to Nearby Vehicles

                    </p>

                  </div>

                </div>

              </button>
            )
          )}

        </div>

      </div>

      {/* LIVE ALERT FEED */}
      <div className="col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col">

        <h2 className="text-3xl font-bold text-white mb-6">

          Live Safety Feed

        </h2>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">

          {messages.length === 0 && (

            <div className="text-slate-500 text-center mt-20">

              No Active Alerts

            </div>

          )}

          {messages.map(
            (msg) => (

              <div
                key={msg.id}

                className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
              >

                <div className="flex items-start gap-4">

                  <div className="text-4xl">

                    {
                      msg.icon
                    }

                  </div>

                  <div className="flex-1">

                    <div className="flex items-center justify-between">

                      <h2 className="text-white text-xl font-bold">

                        {
                          msg.message
                        }

                      </h2>

                      <span className="text-xs text-slate-400">

                        {new Date(
                          msg.timestamp
                        ).toLocaleTimeString()}

                      </span>

                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">

                      <div className="bg-slate-900 rounded-xl p-3">

                        <p className="text-slate-400 text-sm">

                          Speed

                        </p>

                        <p className="text-cyan-400 font-bold">

                          {Math.round(
                            msg.speed || 0
                          )}

                          {" "}
                          km/h

                        </p>

                      </div>

                      <div className="bg-slate-900 rounded-xl p-3">

                        <p className="text-slate-400 text-sm">

                          Heading

                        </p>

                        <p className="text-green-400 font-bold">

                          {
                            msg.heading
                          }°

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}