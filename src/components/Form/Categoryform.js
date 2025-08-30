import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      alert("Category cannot be empty");
      return;
    }
    handleSubmit();
    setValue(""); // optional: clear input after submit
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new Category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
