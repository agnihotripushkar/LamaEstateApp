import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import "./profileUpdatePage.scss";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { username, email, password } = Object.fromEntries(new FormData(e.target));

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password: password || undefined,
        avatar: avatar || null,
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div className="item">
            <label htmlFor="avatar">Avatar URL</label>
            <input
              id="avatar"
              name="avatar"
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
          <button disabled={isLoading}>{isLoading ? "Updating..." : "Update"}</button>
          {error && <span className="error">{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar || "/noavatar.jpg"} alt="Avatar preview" className="avatar" />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
