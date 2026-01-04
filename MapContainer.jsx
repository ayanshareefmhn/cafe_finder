import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix Leaflet default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ✅ Component to recenter the map when location changes
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14);
  }, [center]);
  return null;
}

const CafeMap = ({ searchTerm }) => {
  const [cafes, setCafes] = useState([]);
  const [center, setCenter] = useState([17.385, 78.4867]); // Default Hyderabad
  const [userLocation, setUserLocation] = useState(null);

  // ✅ Get user current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
          setCenter([latitude, longitude]);
        },
        (err) => console.error("Location error:", err)
      );
    }
  }, []);

  // ✅ Fetch cafes using OpenStreetMap (Nominatim)
  useEffect(() => {
    if (!searchTerm) return;

    const fetchCafes = async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchTerm + " cafe"
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        setCafes(data);
        setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        setCafes([]);
      }
    };

    fetchCafes();
  }, [searchTerm]);

  // ❤️ Add to favorites (secure with token verification)
  const addToFavorites = async (cafe) => {
    const userEmail = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");

    if (!userEmail || !token) {
      alert("⚠️ Please log in to add favorites!");
      return;
    }

    // ✅ Fallback unique ID if Nominatim doesn’t provide one
    const uniqueId = cafe.place_id || `${cafe.lat}-${cafe.lon}`;

    const newFav = {
      userEmail,
      place_id: uniqueId,
      name: cafe.display_name.split(",")[0],
      fullName: cafe.display_name,
      lat: cafe.lat,
      lon: cafe.lon,
    };

    try {
      const res = await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Token verification
        },
        body: JSON.stringify(newFav),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Cafe added to favorites!");
      } else {
        alert(data.message || "❌ Failed to add favorite");
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
      alert("Server error while adding favorite.");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "90vh", marginTop: "80px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {/* Recenter when user moves or searches */}
        <RecenterMap center={center} />

        {/* ✅ Show user’s current location */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>📍 You’re here</Popup>
          </Marker>
        )}

        {/* ✅ Display all cafes */}
        {cafes.map((cafe, i) => (
          <Marker key={i} position={[parseFloat(cafe.lat), parseFloat(cafe.lon)]}>
            <Popup>
              <strong>{cafe.display_name.split(",")[0]}</strong>
              <br />
              {cafe.display_name}
              <br />
              {localStorage.getItem("userEmail") ? (
                <button
                  style={{
                    background: "#ff6f61",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    marginTop: "6px",
                    padding: "6px 10px",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => addToFavorites(cafe)}
                  onMouseOver={(e) => (e.target.style.background = "#e75c54")}
                  onMouseOut={(e) => (e.target.style.background = "#ff6f61")}
                >
                  ❤️ Add to Favorites
                </button>
              ) : (
                <p
                  style={{
                    color: "gray",
                    fontSize: "0.85rem",
                    marginTop: "8px",
                    textAlign: "center",
                  }}
                >
                  🔒 Please log in to save this cafe
                </p>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CafeMap;
