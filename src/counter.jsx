import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div class="add-delete-btn">
      
      <button
        className="btn btn-danger ml-2"
        onClick={decrement}
        disabled={count === 0}
      >
        -
      </button>
      <span className="badge bg-secondary mx-2">{count}</span>
      <button className="btn btn-primary" onClick={increment}>
        +
      </button>
      
    </div>
  );
}

export default Counter;
