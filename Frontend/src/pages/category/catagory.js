import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/header";
import CategoryList from "../../components/catagoryList";

import FilterSidebar from "../../components/FilterSidebar";

import Footer from "../../components/footer"; // Update if necessary

const Category = () => {
  const handleFilterChange = (filters) => {
    // Implement your filter logic here
    console.log("Filters changed:", filters);
    // You might want to update the state or perform other actions
  };

  return (
    <>
      <Header />

      <div
        className="container-fluid"
        style={{ maxWidth: "1550px", margin: "0 auto" }}
      >
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content */}
          <main className="col-md-9">
            {/* Hero Section */}

            {/* Our Products */}
            <section className="products-section mb-4"></section>
            <CategoryList />
          </main>
        </div>
      </div>

      <div
        className="container-fluid"
        style={{ maxWidth: "1400px", margin: "0 auto" }}
      ></div>
      <Footer />
    </>
  );
};

export default Category;
