import {
  useContext,
} from "react";

import {
  ModeContext,
} from "../context/ModeContext";

export default function Settings() {

  const {
    mode,
    setMode,
  } = useContext(ModeContext);

  const modes = [

    {
      key: "demo",
      title: "Demo Mode",
      desc:
        "Simulated telemetry and traffic",
    },

    {
      key: "matlab",
      title: "MATLAB Mode",
      desc:
        "Live Simulink telemetry",
    },

    {
      key: "real",
      title: "Real World Mode",
      desc:
        "GPS connected vehicles",
    },
  ];

  return (
    <div className="max-w-5xl">

      <h1 className="text-4xl font-bold mb-3">
        System Settings
      </h1>

      <p className="text-slate-400 mb-10">
        Select operating mode
      </p>

      <div className="space-y-6">

        {modes.map((item) => (

          <button
            key={item.key}

            onClick={() =>
              setMode(item.key)
            }

            className={`w-full p-8 rounded-2xl border text-left transition-all duration-300

            ${
              mode === item.key
                ? "bg-cyan-500 text-black border-cyan-300"
                : "bg-slate-900 border-slate-800 hover:border-cyan-400"
            }
            `}
          >

            <h2 className="text-3xl font-bold mb-2">
              {item.title}
            </h2>

            <p className="text-lg opacity-80">
              {item.desc}
            </p>

          </button>

        ))}

      </div>

      <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-3">
          Active Mode
        </h2>

        <p className="text-cyan-400 text-3xl font-bold uppercase">
          {mode}
        </p>

      </div>

    </div>
  );
}