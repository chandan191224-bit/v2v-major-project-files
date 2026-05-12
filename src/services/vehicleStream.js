import socket from "./socket";

export function streamVehicleData(
  vehicleData,
  vehicleID
) {

  socket.emit(
    "vehicle-update",
    {
      vehicleID,

      latitude:
        vehicleData.latitude,

      longitude:
        vehicleData.longitude,

      speed:
        vehicleData.speed,

      heading:
        vehicleData.heading || 0,

      timestamp:
        Date.now(),
    }
  );
}