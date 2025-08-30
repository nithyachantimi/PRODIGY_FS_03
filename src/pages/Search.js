import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { Button } from "antd";
import { Link } from "react-router-dom";

const Search = () => {
  const [values] = useSearch();

  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results?.length < 1
              ? "No Products found"
              : `Found ${values?.results?.length} products`}
          </h6>

          {values?.results?.length === 0 ? (
            <p className="text-center mt-4">No products found.</p>
          ) : (
            <div className="d-flex flex-wrap mt-4">
              {values?.results?.map((p) => (
                <div key={p._id} className="col-md-4 mb-3">
                  <div className="card h-100">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name || "Product"}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description?.substring(0, 30)}...</p>
                      <p className="card-text">₹ {p.price}</p>
                      <div className="mt-auto">
                        <Link to={`/product/${p.slug}`}>
                          <Button type="primary" className="me-2">
                            MORE DETAILS
                          </Button>
                        </Link>
                        <Button type="primary" className="me-2">
                          ADD TO CART
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
