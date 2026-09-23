import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import DOMPurify from "dompurify";
import { AuthContext } from "../../context/AuthContext";
import Card from "../../components/card/Card";
import "./SinglePage.scss";

export default function SinglePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [nearbyPosts, setNearbyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: property.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await apiRequest.get(`/post/${id}`);
        setProperty(response.data);
        setSaved(response.data.isSaved);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!property) return;

      try {
        // Fetch Similar Properties
        const similarRes = await apiRequest.get(`/post/${property.id}/similar`);
        setSimilarPosts(similarRes.data);

        // Fetch Nearby Properties if lat/lng are available
        if (property.latitude && property.longitude) {
          const nearbyRes = await apiRequest.get(`/post/nearby?lat=${property.latitude}&lng=${property.longitude}`);
          // Filter out the current property from nearby results if it shows up
          const filteredNearby = nearbyRes.data.filter(p => p.id !== property.id);
          setNearbyPosts(filteredNearby);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };

    fetchRecommendations();
  }, [property]);

  if (loading) {
    return (
      <div className="singlePageStatus">
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="singlePageStatus error">
        <p>{error || "Property not found"}</p>
      </div>
    );
  }

  const detail = property.postDetail;
  const images = detail?.images ?? [];

  return (
    <div className="singlePage">
      <button className="backButton" onClick={() => navigate(-1)}>
        ← Back to Listings
      </button>

      <div className="layout">
        <div className="main">
          {images.length > 0 ? (
            <div className="gallery">
              <div className="bigImage" style={{ backgroundImage: `url(${images[0]})` }} />
              <div className="smallImages">
                {images.slice(1, 3).map((img, index) => (
                  <div key={index} style={{ backgroundImage: `url(${img})` }} />
                ))}
              </div>
            </div>
          ) : (
            <div className="noImages">No Images Available</div>
          )}

          <div className="info">
            <h1>{property.title}</h1>
            <div className="address">
              <span>📍</span>
              <span>{property.address}</span>
            </div>
            <div className="price">${property.price.toLocaleString()}</div>

            {detail?.desc && (
              <div
                className="description"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(detail.desc),
                }}
              />
            )}
          </div>

          {similarPosts.length > 0 && (
            <section className="recommendations">
              <h2>Similar Properties</h2>
              <div className="cardGrid">
                {similarPosts.map(post => (
                  <Card key={post.id} item={post} />
                ))}
              </div>
            </section>
          )}

          {nearbyPosts.length > 0 && (
            <section className="recommendations">
              <h2>Nearby Properties</h2>
              <div className="cardGrid">
                {nearbyPosts.map(post => (
                  <Card key={post.id} item={post} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="sidebar">
          <div className="panel">
            <h3>Property Details</h3>
            <div className="rows">
              <div className="row">
                <span>🛏️ Bedrooms:</span>
                <span>{property.bedroom}</span>
              </div>
              <div className="row">
                <span>🚿 Bathrooms:</span>
                <span>{property.bathroom}</span>
              </div>
              {detail?.size && (
                <div className="row">
                  <span>📐 Size:</span>
                  <span>{detail.size} sqft</span>
                </div>
              )}
              <div className="row">
                <span>🏠 Type:</span>
                <span className="capitalize">{property.property}</span>
              </div>
            </div>
          </div>

          {detail && (
            <div className="panel">
              <h3>Features &amp; Amenities</h3>
              <div className="rows">
                {detail.utilities && (
                  <div className="stacked">
                    <span>⚡ Utilities:</span>
                    <p>{detail.utilities}</p>
                  </div>
                )}
                {detail.pet && (
                  <div className="stacked">
                    <span>🐕 Pet Policy:</span>
                    <p>{detail.pet}</p>
                  </div>
                )}
                {detail.income && (
                  <div className="stacked">
                    <span>💰 Income Requirement:</span>
                    <p>{detail.income}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {detail && (
            <div className="panel">
              <h3>Nearby Places</h3>
              <div className="rows">
                {detail.school && (
                  <div className="stacked">
                    <span>🏫 School:</span>
                    <p>{detail.school}</p>
                  </div>
                )}
                {detail.bus && (
                  <div className="stacked">
                    <span>🚌 Bus Stop:</span>
                    <p>{detail.bus}</p>
                  </div>
                )}
                {detail.restaurant && (
                  <div className="stacked">
                    <span>🍽️ Restaurant:</span>
                    <p>{detail.restaurant}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="actions">
            <button className="messageButton">💬 Send Message</button>
            <button
              className={`saveButton${saved ? " saved" : ""}`}
              onClick={handleSave}
            >
              {saved ? "❤️ Property Saved" : "🤍 Save Property"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
