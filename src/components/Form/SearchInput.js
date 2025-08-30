import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.keyword?.trim()) return; // prevent empty search

    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="search-wrapper">
      <form className="search-form" role="search" onSubmit={handleSubmit}>
        <div className="search-input-group">
          <input
            className="search-input"
            type="search"
            placeholder="Search for products, brands and more..."
            aria-label="Search"
            value={values.keyword || ""}
            onChange={(e) => setValues({ ...values, keyword: e.target.value })}
          />
          <button className="search-button" type="submit">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
