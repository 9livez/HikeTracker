// Converts standard #RRGGBB hex to KML AABBGGRR format
function convertHexToKmlColor(hex, opacity = 'FF') {
  // Remove hash if present
  hex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Default to black if invalid
  if (hex.length !== 6) {
    return `${opacity}000000`;
  }
  
  // Extract RGB components
  const r = hex.substring(0, 2);
  const g = hex.substring(2, 4);
  const b = hex.substring(4, 6);
  
  // KML format is aabbggrr
  return `${opacity}${b}${g}${r}`.toUpperCase();
}

export function generateKML(routes) {
  let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>HikeTracker Export</name>
    <description>Exported routes from HikeTracker</description>
`;

  routes.forEach((route, index) => {
    // Collect all coordinates across all segments of the route
    const allCoords = [];
    route.paths.forEach(segment => {
      segment.forEach(point => {
        allCoords.push(`${point.lng},${point.lat},0`);
      });
    });

    if (allCoords.length === 0) return; // Skip empty routes

    const color = route.style?.color || '#4F46E5';
    const weight = route.style?.weight || 4;
    const kmlColor = convertHexToKmlColor(color, 'E6'); // E6 is ~90% opacity

    const styleId = `style-${route.id}`;

    kmlContent += `
    <Style id="${styleId}">
      <LineStyle>
        <color>${kmlColor}</color>
        <width>${weight}</width>
      </LineStyle>
    </Style>
    <Placemark>
      <name>Route ${index + 1}</name>
      <styleUrl>#${styleId}</styleUrl>
      <LineString>
        <tessellate>1</tessellate>
        <coordinates>
          ${allCoords.join('\n          ')}
        </coordinates>
      </LineString>
    </Placemark>
`;
  });

  kmlContent += `  </Document>
</kml>`;

  return kmlContent;
}

export function downloadKML(routes) {
  const kmlString = generateKML(routes);
  const blob = new Blob([kmlString], { type: 'application/vnd.google-earth.kml+xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = `HikeTracker_Routes_${new Date().toISOString().split('T')[0]}.kml`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
