export function projectVehicle(
  self,
  other
) {

  const dx =
    (other.longitude - self.longitude) *
    111320;

  const dy =
    (other.latitude - self.latitude) *
    110540;

  const angle =
    (-self.heading || 0) *
    Math.PI /
    180;

  // ROTATE WORLD
  const rotatedX =
    dx * Math.cos(angle) -
    dy * Math.sin(angle);

  const rotatedY =
    dx * Math.sin(angle) +
    dy * Math.cos(angle);

  return {
    x: rotatedX,
    y: rotatedY,
    heading:
      other.heading || 0,
    speed:
      other.speed || 0,
    vehicleID:
      other.vehicleID,
  };
}