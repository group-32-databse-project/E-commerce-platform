import React, { useEffect, useState } from 'react';
import { CardsCount } from './cards';
function Header() {
    const [query, setQuery] = useState('');        // Search query state
    const [results, setResults] = useState([]);    // Search results state
    const [error, setError] = useState('');        // Error state

    // Effect to fetch results when the query changes
    useEffect(() => {
        const fetchResults = async () => {
            if (query.length > 0) {
                try {
                    const response = await fetch(`http://localhost:5000/api/search?q=${query}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setResults(data);            // Update results with fetched data
                    setError('');                // Clear any previous errors
                } catch (error) {
                    console.error('Error fetching search results:', error);
                    setError(error.message);     // Update the error state
                }
            } else {
                setResults([]);                   // Clear results when query is empty
                setError('');                     // Clear any previous errors
            }
        };
        fetchResults();
    }, [query]);

    return (
      <header>
      <div className="header-container">
        <img src="./pictures/logo.png" alt="Logo" className="logo" />
        <div className="search-wrapper"> 
        <input 
          type="text" 
          placeholder="Search entire store here..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          className="search-bar"
        />

        {results.length > 0 && (
          <ul className="search-suggestions">
          {results.map(item => (
            <li key={item.id} onClick={() => {
            setQuery(item.product_name);
            setResults([]); // Clear the results to remove the list from the screen
            }}>
            {item.product_name}
            </li>
          ))}
          </ul>
        )}
         
        {error && <div className="error">{error}</div>}

        <button className="search-icon-button">
          <img src="./pictures/search.png" alt="Search Icon" className="search-icon" />
        </button>
        </div>
        <div className="header-right">
        <span>Delivery Within 10 Days For All Items</span>
        <div className="cart-user">
          <a href="/cart"><img src="./pictures/cart.png" alt="Cart Icon" className="cart-icon" />
          </a>
          <a href="#">
          {CardsCount()}
          </a>
          <a href="#"><img src="./pictures/user.png" alt="User Icon" className="user-icon" /></a>
        </div>
        </div>
      </div>
      <nav>
        <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/electronics">Electronics</a></li>
        <li><a href="/toys">Toys</a></li>
        
        </ul>
      </nav>
      </header>
    );
}

export default Header;
