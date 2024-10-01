import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Counter from "./counter";

const CardGrid = (props) => {
  const [cards] = useState(props.cards);
  const navigate = useNavigate(); // Replaces withRouter

  const handleCheckout = () => {
    navigate("/checkout"); // Use navigate hook to navigate to /checkout
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />
      <div className="row">
        {cards.map((card) => (
          <div className="col-md-4" key={card.id}>
            <div
              className="card"
              style={{ width: "18rem", backgroundColor: "rgb(179, 239, 219)" }}
            >
              <img src={card.img} className="card-img-top" alt={card.title} />
              <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text">{card.content}</p>
                <a href="#" className="btn btn-primary">
                  Go somewhere
                </a>
                <Counter />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleCheckout}
      >
        Checkout
      </button>
    </>
  );
};

export default CardGrid;
