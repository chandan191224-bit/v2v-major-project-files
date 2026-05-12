import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import html2canvas from "html2canvas";

import { jsPDF } from "jspdf";

import {
  VehicleContext,
} from "../context/VehicleContext";

import {
  ModeContext,
} from "../context/ModeContext";

export default function TelemetryChart() {

  // CONTEXT
  const { vehicleData } =
    useContext(VehicleContext);

  const { mode } =
    useContext(ModeContext);

  // STATES
  const [chartData, setChartData] =
    useState([]);

  const [vehicleHistory, setVehicleHistory] =
    useState([]);

  const [timelineOffset, setTimelineOffset] =
    useState(0);

  const [signalOffset, setSignalOffset] =
    useState(0);

  const [duration, setDuration] =
    useState(30);

  const [liveMode, setLiveMode] =
    useState(true);

  // GRAPH REF
  const graphRef = useRef(null);

  // RESET
  useEffect(() => {

    setChartData([]);

    setVehicleHistory([]);

    setTimelineOffset(0);

    setSignalOffset(0);

    setLiveMode(true);

  }, [mode]);

  // LIVE DATA
  useEffect(() => {

    if (mode === "real")
      return;

    const interval =
      setInterval(() => {

        const timestamp =
          new Date()
            .toLocaleTimeString();

        // MAIN GRAPH
        setChartData((prev) => {

          const updated = [

            ...prev,

            {
              time:
                timestamp,

              speed:
                Math.round(
                  vehicleData.speed || 0
                ),

              steering:
                Math.round(
                  vehicleData.steering || 0
                ),

              latency:
                Math.round(
                  vehicleData.latency || 0
                ),
            },
          ];

          return updated.slice(
            -5000
          );

        });

        // MATLAB VEHICLE HISTORY
        if (
          mode === "matlab" &&
          vehicleData.vehicleID
        ) {

          setVehicleHistory((prev) => {

            const updated = [

              ...prev,

              {
                x:
                  prev.length,

                y:
                  vehicleData.vehicleID,

                vehicleID:
                  vehicleData.vehicleID,

                speed:
                  vehicleData.avgSpeed,

                risk:
                  vehicleData.riskLevel,

                time:
                  timestamp,
              },
            ];

            return updated.slice(
              -5000
            );

          });
        }

      }, 500);

    return () =>
      clearInterval(
        interval
      );

  }, [
    vehicleData,
    mode,
  ]);

  // LIVE SIGNALS
  const visibleSignals =
    useMemo(() => {

      if (liveMode) {

        return chartData.slice(
          -duration
        );
      }

      return chartData.slice(

        Math.max(
          0,
          signalOffset
        ),

        Math.max(
          0,
          signalOffset
        ) + duration
      );

    }, [
      chartData,
      signalOffset,
      duration,
      liveMode,
    ]);

  // VEHICLE WINDOW
  const visibleVehicleHistory =
    useMemo(() => {

      return vehicleHistory.slice(

        Math.max(
          0,
          timelineOffset
        ),

        Math.max(
          0,
          timelineOffset
        ) + 25
      );

    }, [
      vehicleHistory,
      timelineOffset,
    ]);

  // DOWNLOAD REPORT
  const downloadGraph =
    async () => {

      try {

        // ASK OPTION
        const option =
          prompt(

            "Choose Report Type:\n\n1 = Start/End Time\n2 = Last X Seconds/Minutes/Hours"

          );

        let selectedData = [];

        // OPTION 1
        if (option === "1") {

          const startTime =
            prompt(
              "Enter START time exactly as shown in graph"
            );

          const endTime =
            prompt(
              "Enter END time exactly as shown in graph"
            );

          if (
            !startTime ||
            !endTime
          )
            return;

          const startIndex =
            chartData.findIndex(
              (item) =>
                item.time ===
                startTime
            );

          const endIndex =
            chartData.findIndex(
              (item) =>
                item.time ===
                endTime
            );

          if (
            startIndex === -1 ||
            endIndex === -1
          ) {

            alert(
              "Time not found"
            );

            return;
          }

          selectedData =
            chartData.slice(
              startIndex,
              endIndex + 1
            );
        }

        // OPTION 2
        else if (option === "2") {

          const value =
            prompt(
              "Enter X value"
            );

          const unit =
            prompt(
              "Enter unit:\nsec\nmin\nhour"
            );

          if (
            !value ||
            !unit
          )
            return;

          const x =
            parseInt(value);

          if (isNaN(x)) {

            alert(
              "Invalid number"
            );

            return;
          }

          let points = 0;

          // 1 POINT = 0.5 SEC
          if (
            unit === "sec"
          ) {

            points = x * 2;
          }

          else if (
            unit === "min"
          ) {

            points =
              x * 60 * 2;
          }

          else if (
            unit === "hour"
          ) {

            points =
              x * 60 * 60 * 2;
          }

          else {

            alert(
              "Invalid unit"
            );

            return;
          }

          selectedData =
            chartData.slice(
              -points
            );
        }

        else {

          alert(
            "Invalid option"
          );

          return;
        }

        // EMPTY DATA
        if (
          selectedData.length === 0
        ) {

          alert(
            "No data found"
          );

          return;
        }

        // SCREENSHOT
        const canvas =
          await html2canvas(
            graphRef.current,
            {
              scale: 2,
            }
          );

        const imgData =
          canvas.toDataURL(
            "image/png"
          );

        // CREATE PDF
        const pdf =
          new jsPDF(
            "landscape",
            "mm",
            "a4"
          );

        // TITLE
        pdf.setFontSize(18);

        pdf.text(
          "Telemetry Report",
          10,
          12
        );

        pdf.setFontSize(11);

        pdf.text(
          `Generated: ${new Date().toLocaleString()}`,
          10,
          20
        );

        pdf.text(
          `Records: ${selectedData.length}`,
          10,
          27
        );

        // GRAPH IMAGE
        pdf.addImage(
          imgData,
          "PNG",
          10,
          35,
          270,
          120
        );

        // TABLE
        let y = 170;

        selectedData.forEach(
          (item, index) => {

            pdf.text(

              `${index + 1}. ${item.time} | Speed: ${item.speed} | Steering: ${item.steering} | Latency: ${item.latency}`,

              10,

              y
            );

            y += 6;

            // PAGE BREAK
            if (y > 190) {

              pdf.addPage();

              y = 20;
            }
          }
        );

        // FORCE DOWNLOAD
        const pdfBlob =
          pdf.output("blob");

        const blobUrl =
          URL.createObjectURL(
            pdfBlob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = blobUrl;

        link.download =
          `telemetry-report-${Date.now()}.pdf`;

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        URL.revokeObjectURL(
          blobUrl
        );

        alert(
          "Report Downloaded Successfully"
        );

      } catch (err) {

        console.log(err);

        alert(
          "Failed to generate report"
        );
      }
    };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 min-h-[950px] overflow-hidden">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold">
            Live Vehicle Telemetry
          </h2>

          <p className="text-slate-400 mt-2">
            Real-time telemetry analytics
          </p>

          {mode === "matlab" && (

            <p className="text-cyan-400 mt-3 font-semibold">

              Active Vehicle ID:
              {" "}

              {vehicleData.vehicleID || "N/A"}

            </p>

          )}

        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">

          <span className="text-slate-400">
            Mode:
          </span>

          <span className="ml-2 font-bold text-cyan-400 uppercase">
            {mode}
          </span>

        </div>

      </div>

      {/* CONTROL BAR */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">

        {/* DURATION */}
        <div className="flex gap-3">

          <button
            onClick={() =>
              setDuration(20)
            }
            className={`px-4 py-2 rounded-xl ${
              duration === 20
                ? "bg-cyan-500 text-black"
                : "bg-slate-800"
            }`}
          >
            20
          </button>

          <button
            onClick={() =>
              setDuration(50)
            }
            className={`px-4 py-2 rounded-xl ${
              duration === 50
                ? "bg-cyan-500 text-black"
                : "bg-slate-800"
            }`}
          >
            50
          </button>

          <button
            onClick={() =>
              setDuration(100)
            }
            className={`px-4 py-2 rounded-xl ${
              duration === 100
                ? "bg-cyan-500 text-black"
                : "bg-slate-800"
            }`}
          >
            100
          </button>

        </div>

        {/* SIGNAL NAVIGATION */}
        <div className="flex gap-3 flex-wrap">

          <button
            onClick={() =>
              setLiveMode(true)
            }
            className={`px-4 py-2 rounded-xl font-bold transition ${
              liveMode
                ? "bg-green-500 text-black"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            LIVE
          </button>

          <button
            onClick={() => {

              setLiveMode(false);

              setSignalOffset(
                (prev) =>
                  Math.max(
                    prev - 10,
                    0
                  )
              );

            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            ← Signals Back
          </button>

          <button
            onClick={() => {

              setLiveMode(false);

              setSignalOffset(
                (prev) =>
                  Math.min(
                    prev + 10,

                    Math.max(
                      chartData.length - duration,
                      0
                    )
                  )
              );

            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            Signals Forward →
          </button>

        </div>

        {/* DOWNLOAD */}
        <button
          onClick={downloadGraph}
          className="px-5 py-3 bg-cyan-500 text-black rounded-xl font-bold hover:scale-105 transition"
        >
          Download Report
        </button>

      </div>

      {/* LIVE STATS */}
      <div className="grid grid-cols-4 gap-4 mb-8">

        <div className="bg-slate-800 rounded-xl p-4">

          <p className="text-slate-400 text-sm mb-2">
            Speed
          </p>

          <h3 className="text-3xl font-bold text-cyan-400">
            {Math.round(
              vehicleData.speed || 0
            )}
          </h3>

          <span className="text-slate-500 text-sm">
            km/h
          </span>

        </div>

        <div className="bg-slate-800 rounded-xl p-4">

          <p className="text-slate-400 text-sm mb-2">
            Steering
          </p>

          <h3 className="text-3xl font-bold text-green-400">
            {Math.round(
              vehicleData.steering || 0
            )}
          </h3>

          <span className="text-slate-500 text-sm">
            °
          </span>

        </div>

        <div className="bg-slate-800 rounded-xl p-4">

          <p className="text-slate-400 text-sm mb-2">
            Latency
          </p>

          <h3 className="text-3xl font-bold text-yellow-400">
            {Math.round(
              vehicleData.latency || 0
            )}
          </h3>

          <span className="text-slate-500 text-sm">
            ms
          </span>

        </div>

        <div className="bg-slate-800 rounded-xl p-4">

          <p className="text-slate-400 text-sm mb-2">
            Vehicle ID
          </p>

          <h3 className="text-3xl font-bold text-pink-400">
            {vehicleData.vehicleID || "N/A"}
          </h3>

        </div>

      </div>

      {/* MAIN GRAPH */}
      <div
        ref={graphRef}
        className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-8 h-[350px]"
      >

        <h3 className="text-xl font-bold mb-4">
          Telemetry Signals
        </h3>

        <ResponsiveContainer
          width="100%"
          height="90%"
        >

          <LineChart
            data={visibleSignals}
          >

            <CartesianGrid
              stroke="#1e293b"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
              stroke="#94a3b8"
            />

            <YAxis
              stroke="#94a3b8"
            />

            <Tooltip
              contentStyle={{
                background:
                  "#0f172a",

                border:
                  "1px solid #334155",

                borderRadius:
                  "12px",
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="speed"
              name="Speed"
              stroke="#22d3ee"
              strokeWidth={4}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="steering"
              name="Steering"
              stroke="#4ade80"
              strokeWidth={4}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* MATLAB VEHICLE DETECTION */}
      {mode === "matlab" && (

        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 h-[320px]">

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-xl font-bold">
              Detected Vehicle IDs Timeline
            </h3>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setTimelineOffset(
                    (prev) =>
                      Math.max(
                        prev - 5,
                        0
                      )
                  )
                }
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
              >
                ← Back
              </button>

              <button
                onClick={() =>
                  setTimelineOffset(
                    (prev) =>
                      Math.min(
                        prev + 5,

                        Math.max(
                          vehicleHistory.length - 25,
                          0
                        )
                      )
                  )
                }
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
              >
                Forward →
              </button>

            </div>

          </div>

          <ResponsiveContainer
            width="100%"
            height="85%"
          >

            <ScatterChart>

              <CartesianGrid
                stroke="#1e293b"
              />

              <XAxis
                type="number"
                dataKey="x"
                name="Detection Order"
                stroke="#94a3b8"
              />

              <YAxis
                type="number"
                dataKey="y"
                name="Vehicle ID"
                stroke="#94a3b8"
              />

              <ZAxis
                type="number"
                range={[100]}
              />

              <Tooltip
                cursor={{
                  strokeDasharray:
                    "3 3",
                }}

                contentStyle={{
                  background:
                    "#0f172a",

                  border:
                    "1px solid #334155",

                  borderRadius:
                    "12px",
                }}
              />

              <Scatter
                name="Detected Vehicles"
                data={visibleVehicleHistory}
                fill="#22d3ee"
              />

            </ScatterChart>

          </ResponsiveContainer>

        </div>

      )}

    </div>
  );
}