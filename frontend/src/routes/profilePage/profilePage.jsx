import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate("/add");
  };

  const handleUpdateProfile = () => {
    navigate("/profile/update");
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>

        {/* Left Column: User Info, Listings, Saved */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          {/* User Information */}
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', margin: 0 }}>User Information</h1>
              <button onClick={handleUpdateProfile} style={{
                padding: '10px 20px',
                backgroundColor: '#fbbf24',
                color: '#333',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>Update Profile</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {currentUser ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: '600', color: '#444', minWidth: '80px' }}>Avatar:</span>
                    <img
                      src={currentUser.avatar || "/noavatar.jpg"}
                      alt="User Avatar"
                      style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: '600', color: '#444', minWidth: '80px' }}>Username:</span>
                    <span style={{ color: '#666' }}>{currentUser.username}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: '600', color: '#444', minWidth: '80px' }}>E-mail:</span>
                    <span style={{ color: '#666' }}>{currentUser.email}</span>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <p style={{ color: '#666', fontSize: '16px' }}>Please log in to view your profile.</p>
                </div>
              )}
            </div>
          </div>

          {/* My Listings */}
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>My Listings</h2>
              {currentUser?.role === "REALTOR" && (
                <button
                  onClick={handleCreatePost}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>Create New Post</button>
              )}
            </div>

            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <p style={{ color: '#666', fontSize: '16px' }}>No listings yet. Create your first property listing!</p>
            </div>
          </div>

          {/* Saved Properties */}
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>Saved Properties</h2>
            </div>
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <p style={{ color: '#666', fontSize: '16px' }}>No saved properties yet. Start browsing to save your favorites!</p>
            </div>
          </div>

        </div>

        {/* Right Column: Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>Messages</h2>
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <p style={{ color: '#666', fontSize: '16px' }}>No messages yet.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;