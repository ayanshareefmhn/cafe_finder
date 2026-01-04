import React, { useEffect, useState } from "react";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/favorites/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFavorites();
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (!userEmail) {
    return (
      <div style={{ padding: "90px 20px" }}>
        <h2 style={{ color: "#ff6f61" }}>❤️ My Favorite Cafes</h2>
        <p>Please log in to view your favorites ☕</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "90px 20px" }}>
      <h2 style={{ color: "#ff6f61" }}>❤️ My Favorite Cafes</h2>

      {favorites.length === 0 ? (
        <p>No favourites yet! Go to the map and add some ☕</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {favorites.map((cafe) => (
            <div
              key={cafe._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{cafe.name}</h3>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>{cafe.fullName}</p>
              <a
                href={`https://www.google.com/maps?q=${cafe.lat},${cafe.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#ff6f61",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                📍 View on Map
              </a>
              <br />
              <button
                onClick={() => removeFavorite(cafe._id)}
                style={{
                  marginTop: "10px",
                  background: "#e63946",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
