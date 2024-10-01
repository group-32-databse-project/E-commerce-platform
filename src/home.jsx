import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './header';
import AllCategory from './homeComponent/allCatagery';  // Corrected import


const HomePage = () => {
  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <aside className="col-md-3 bg-light pt-4">
            <h4>All Categories</h4>
            <ul className="list-group">
              <li className="list-group-item">Headphones</li>
              <li className="list-group-item">Digital Cameras</li>
              <li className="list-group-item">Mobile Phones & Tablets</li>
              <li className="list-group-item">Computers & Laptops</li>
              <li className="list-group-item">TVs</li>
              <li className="list-group-item">Toys</li>
              <li className="list-group-item">More Categories</li>
            </ul>
          </aside>

          {/* Main Content */}
          <main className="col-md-9">
            {/* Hero Section */}
            <section className="hero-section mb-4">
              <div id="carouselExample" className="carousel slide">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src="https://via.placeholder.com/900x300" className="d-block w-100" alt="Headphone" />
                  </div>
                  <div className="carousel-item">
                    <img src="https://via.placeholder.com/900x300" className="d-block w-100" alt="Macbook Promo" />
                  </div>
                  <div className="carousel-item">
                    <img src="https://via.placeholder.com/900x300" className="d-block w-100" alt="Toys Promo" />
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
              </div>
            </section>

            {/* Our Products */}
            <section className="products-section mb-4">
              <AllCategory />  {/* Corrected component name */}
            </section>

            {/* New Arrivals */}
            <section className="new-arrivals-section">
              <h4>New Arrivals</h4>
              <div className="row">
                <div className="col-md-3">
                  <div className="card">
                    <img src="https://via.placeholder.com/150" className="card-img-top" alt="Monopoly" />
                    <div className="card-body">
                      <h5 className="card-title">Monopoly Board Game</h5>
                      <p className="card-text">$37.99</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card">
                    <img src="https://via.placeholder.com/150" className="card-img-top" alt="TV" />
                    <div className="card-body">
                      <h5 className="card-title">50 inch Ultra HD TV</h5>
                      <p className="card-text">$1200</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card">
                    <img src="https://via.placeholder.com/150" className="card-img-top" alt="Laptop" />
                    <div className="card-body">
                      <h5 className="card-title">Dell Latitude</h5>
                      <p className="card-text">$1500</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default HomePage;
