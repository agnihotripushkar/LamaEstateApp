import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function Navbar() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav style={{
      height: '80px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0 20px', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #eee',
      marginBottom: '20px'
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: '30px'}}>
        <Link to="/" style={{
          fontWeight: 'bold', 
          fontSize: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          color: '#333',
          textDecoration: 'none'
        }}>
          <span>🏠</span>
          <span>LamaEstate</span>
        </Link>
        <div style={{display: 'flex', gap: '25px'}}>
          <Link to="/" style={{color: '#666', textDecoration: 'none', fontWeight: '500'}}>Home</Link>
          <Link to="/about" style={{color: '#666', textDecoration: 'none', fontWeight: '500'}}>About</Link>
          <Link to="/contact" style={{color: '#666', textDecoration: 'none', fontWeight: '500'}}>Contact</Link>
          <Link to="/agents" style={{color: '#666', textDecoration: 'none', fontWeight: '500'}}>Agents</Link>
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
        {currentUser ? (
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="" style={{
              width: '32px', 
              height: '32px', 
              borderRadius: '50%',
              objectFit: 'cover'
            }} />
            <span style={{fontWeight: '500', color: '#333'}}>{currentUser.username}</span>
            <Link to="/profile" style={{
              padding: '8px 16px', 
              backgroundColor: '#fbbf24', 
              borderRadius: '6px',
              color: '#333',
              textDecoration: 'none',
              fontWeight: '500'
            }}>Profile</Link>
            <button onClick={handleLogout} style={{
              padding: '8px 16px', 
              backgroundColor: '#dc2626', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: '500'
            }}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" style={{
              padding: '8px 16px',
              color: '#666',
              textDecoration: 'none',
              fontWeight: '500'
            }}>Sign in</Link>
            <Link to="/register" style={{
              padding: '10px 20px', 
              backgroundColor: '#fbbf24', 
              borderRadius: '6px',
              color: '#333',
              textDecoration: 'none',
              fontWeight: '600'
            }}>Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;