import React, { useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/header";
import OurProduct from "../../components/OurProduct";

import FilterSidebar from "../../components/FilterSidebar";
import Banner from "./Banner";
import Newarrival from "./Newarrival";
import Footer from "../../components/footer";
import "../../assets/styles/FilterSidebar.css";

const HomePage = () => {
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    priceRange: [0, 1500],
  });

  // Memoize handleFilterChange to maintain stable identity
  const handleFilterChange = useCallback((newFilters) => {
    // console.log("Received New Filters:", newFilters);
    setFilters(newFilters);
  }, []);

  return (
    <>
      <Header />

      <div className="container-fluid" style={{ maxWidth: "1550px", margin: "0 auto" }}>
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 filter-sidebar">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content */}
          <main className="col-md-9">
            {/* Hero Section */}
            <Banner />

            {/* Our Products */}
            <section className="products-section mb-4">
              <OurProduct filters={filters} />
            </section>

            {/* New Arrivals */}
            <Newarrival />
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HomePage;