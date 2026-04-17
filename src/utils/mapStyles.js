export const mapStyles = {
  light: [
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#b1c1d9" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#e9f5e3" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#d9e2d4" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#d9e2d4" }] },
    { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#888888" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#999999" }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
  ],
  dark: [
    { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }, { visibility: "on" }] },
    { featureType: "all", elementType: "labels.text.stroke", stylers: [{ visibility: "on" }, { color: "#1a3646" }, { weight: 2 }, { lightness: -80 }] },
    { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#4b9cb7" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#c4def6" }] },
    { featureType: "administrative.neighborhood", elementType: "labels.text.fill", stylers: [{ color: "#c4def6" }] },
    { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#0f2636" }] },
    { featureType: "poi", elementType: "geometry.fill", stylers: [{ color: "#172f44" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#172f44" }] },
    { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#264860" }] },
    { featureType: "road.arterial", elementType: "geometry.fill", stylers: [{ color: "#264860" }] },
    { featureType: "road.local", elementType: "geometry.fill", stylers: [{ color: "#264860" }] },
    { featureType: "transit", elementType: "geometry.fill", stylers: [{ color: "#264860" }] },
    { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#0a1924" }] }
  ]
};
