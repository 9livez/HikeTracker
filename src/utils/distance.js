/**
 * Calculates the length of a single path segment in meters.
 * @param {Array<{lat: number, lng: number}>} path 
 */
export function calculatePathLength(path) {
  if (!path || path.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    total += getDistance(path[i], path[i + 1]);
  }
  return total;
}

/**
 * Helper to calculate distance between two points in meters using Haversine formula.
 */
function getDistance(p1, p2) {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (p1.lat * Math.PI) / 180;
  const phi2 = (p2.lat * Math.PI) / 180;
  const dPhi = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLambda = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Formats distance in meters to a human-readable string (m or km).
 */
export function formatDistance(meters) {
  if (typeof meters !== 'number' || isNaN(meters)) return null;
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    return `${(meters / 1000).toFixed(2)} km`;
  }
}

/**
 * Calculates total length of a route (sum of all segments).
 */
export function calculateRouteLength(route) {
  if (!route || !route.paths) return 0;
  return route.paths.reduce((acc, segment) => acc + calculatePathLength(segment), 0);
}
