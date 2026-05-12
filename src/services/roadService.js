export async function fetchRoadGeometry(
  latitude,
  longitude
) {

  const query = `

[out:json];
(
  way(around:200,${latitude},${longitude})
  [highway];
);
out geom;
`;

  const response =
    await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: query,
      }
    );

  return response.json();
}