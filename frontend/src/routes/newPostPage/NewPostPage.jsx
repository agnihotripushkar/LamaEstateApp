import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import "./newPostPage.css";

function NewPostPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "REALTOR") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handlePredictPrice = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Get values directly from the form
    const form = e.target.closest("form");
    const bedroom = form.bedroom.value;
    const bathroom = form.bathroom.value;
    const latitude = form.latitude.value;
    const longitude = form.longitude.value;

    if (!bedroom || !bathroom || !latitude || !longitude) {
      setError("Please fill in Bedroom, Bathroom, Latitude, and Longitude first!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRequest.post("/predict", {
        bedroom: Number(bedroom),
        bathroom: Number(bathroom),
        latitude: Number(latitude),
        longitude: Number(longitude),
      });

      form.price.value = res.data.estimated_price;
      setSuggestedPrice(res.data.estimated_price);
    } catch (err) {
      console.log(err);
      setError("Failed to get prediction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item price">
              <label htmlFor="price">Price</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input id="price" name="price" type="number" />
                <button
                  onClick={handlePredictPrice}
                  disabled={isLoading}
                  className="aiButton"
                >
                  {isLoading ? "Thinking..." : "✨ AI Suggest"}
                </button>
              </div>
              {suggestedPrice && <span style={{ color: "green", fontSize: "12px" }}>AI suggested: ${suggestedPrice}</span>}
              {error && <span style={{ color: "red", fontSize: "12px" }}>{error}</span>}
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              {/* Added basic textarea for description since it was missing input */}
              <textarea id="desc" name="desc" />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Add</button>
          </form>
        </div>
      </div>
      <div className="sideContainer"></div>
    </div>
  );
}

export default NewPostPage;