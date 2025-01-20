import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MenuItem, Select } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PromotionModal from "./promotionProduct"; // Import the PromotionModal component

const ProductsPageVendor = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [menuOpen, setMenuOpen] = useState(null); // State to track which menu is open

  const [promotionModalOpen, setPromotionModalOpen] = useState(false); // Modal open state
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product for the promotion

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/json/productData.json");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    setSubCategories([]);
    setSelectedSubCategory("");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/subcategories/byCategory/${selectedCategoryId}`
      );
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    if (selectedSubCategory) {
      return product.subCategoryId === selectedSubCategory;
    }
    if (selectedCategory) {
      return product.categoryId === selectedCategory;
    }
    return true;
  });

  const toggleMenu = (productId) => {
    setMenuOpen(menuOpen === productId ? null : productId); // Toggle menu
  };
  const handleEdit = (product) => {
    navigate("/update-product", { state: { product } }); // Navigate with product data
    console.log("Edit", product);
    // Add your edit functionality here
  };

  const handleDelete = (product) => {
    console.log("Delete", product);
    // Add your delete functionality here
  };

  const handleInsights = (product) => {
    setSelectedProduct(product); // Set the selected product
    setPromotionModalOpen(true); // Open the modal
  };

  const handleSavePromotion = (promotionDetails) => {
    console.log("Promotion Details:", promotionDetails);
    // Save promotion details (e.g., send to API or update state)
    setPromotionModalOpen(false); // Close the modal after saving
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="product-list-page-vendor">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>All Products</h2>
          <p>Home &gt; All Products</p>
        </div>
        <div className="dashboard-date-vendor">
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: "#2d2d2d",
              color: "white",
              padding: "15px 15px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <CiCirclePlus /> Add Product
          </button>
        </div>
      </header>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          marginBottom: "20px",
        }}
      >
        <Select
          sx={{
            width: "200px",
            color: "#2d2d2d",
            backgroundColor: "#fff",
          }}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <MenuItem value="">Select Category</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>

        {subCategories.length > 0 && (
          <Select
            sx={{
              width: "200px",
              marginLeft: "20px",
            }}
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
          >
            <option value="">Select Subcategory</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </option>
            ))}
          </Select>
        )}
      </div>

      <div className="vendor-products-list-grid">
        {currentProducts.map((product) => (
          <div className="all-product-card" key={product.id}>
            <div className="product-card-header">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="all-product-image"
              />
              <div className="product-info-vendor">
                <h3>{product.name}</h3>
                <p>{product.type}</p>
                <p>{product.price}</p>
              </div>
              <div className="menu-container">
                <BsThreeDotsVertical
                  onClick={() => toggleMenu(product.id)}
                  className="three-dots-icon"
                />
                {menuOpen === product.id && (
                  <div className="menu-dropdown">
                    <button onClick={() => handleEdit(product)}>Edit</button>
                    <button onClick={() => handleDelete(product)}>
                      Delete
                    </button>
                    <button onClick={() => handleInsights(product)}>
                      Promotion
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="product-card-body">
              <h5>Summary</h5>
              <p className="product-summary">
                {product.description.substring(0, 100)}...
              </p>
              <div className="product-stats">
                <div className="product-sales">
                  <span>Sales</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span className="sales-value">{product.rating}</span>
                  </div>
                </div>
                <hr style={{ margin: "10px 0", color: "#ddd" }} />
                <div className="product-remaining">
                  <span>Remaining Products</span>
                  <span className="remaining-value">
                    {product.reviewsCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            style={{
              margin: "5px",
              padding: "8px 12px",
              backgroundColor:
                currentPage === index + 1 ? "#2d2d2d" : "#efebe8",
              color: currentPage === index + 1 ? "#fff" : "#2d2d2d",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Promotion Modal */}
      {promotionModalOpen && (
        <PromotionModal
          open={promotionModalOpen}
          onClose={() => setPromotionModalOpen(false)}
          onSave={handleSavePromotion}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default ProductsPageVendor;
