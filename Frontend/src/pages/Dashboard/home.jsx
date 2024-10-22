import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/header";
import OurProduct from "../../components/OurProduct";
import ProductList from "./ProductList";
import FilterSidebar from "./FilterSidebar";
import Banner from "./Banner";
import Newarrival from "./Newarrival";
import Footer from "../../components/footer"; // Update if necessary

const HomePage = () => {
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
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <main className="col-md-9">
            {/* Hero Section */}
            <Banner />

            {/* Our Products */}
            <section className="products-section mb-4"></section>
            <OurProduct />

            <></>

            {/* New Arrivals */}
            <Newarrival />
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

export default HomePage;
