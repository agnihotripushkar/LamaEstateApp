import { Link } from "react-router-dom";
import "./card.scss";

function Card({ item }) {
  const url = `/property/${item.id}`;

  return (
    <div className="card">
      <Link to={url} className="imageContainer">
        <img src={item.img} alt={item.title} />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={url}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price.toLocaleString()}</p>
        <div className="features">
          <div className="feature">
            <img src="/bed.png" alt="" />
            <span>{item.bedroom} bedroom</span>
          </div>
          <div className="feature">
            <img src="/bath.png" alt="" />
            <span>{item.bathroom} bathroom</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
