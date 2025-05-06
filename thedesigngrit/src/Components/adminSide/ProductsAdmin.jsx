import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PromotionModal from "../vendorSide/promotionProduct"; // Import the PromotionModal component
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai"; // Import arrow icons
import UpdateProduct from "../vendorSide/UpdateProduct";
import ProductReviewDialog from "./reviewPopup";

const ProductPageAdmin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [menuOpen, setMenuOpen] = useState({}); // State to track which menu is open
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product for update
  const [promotionModalOpen, setPromotionModalOpen] = useState(false); // Modal open state
  const [showFalseStatus, setShowFalseStatus] = useState(false);
  const [showTrueStatus, setShowTrueStatus] = useState(true);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [productToReview, setProductToReview] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://api.thedesigngrit.com/api/products/getproducts",
          {
            params: {
              category: selectedCategory, // Still allowing category filtering if needed
            },
          }
        );

        const fetchedProducts = response.data;

        // Map products and fetch type name by type ID
        const productsWithTypeNames = await Promise.all(
          fetchedProducts.map(async (product) => {
            if (product.type) {
              try {
                const typeResponse = await axios.get(
                  `https://api.thedesigngrit.com/api/types/types/${product.type}`
                );
                product.typeName = typeResponse.data.name || "Unknown"; // Set type name
              } catch (error) {
                console.error("Error fetching type:", error);
                product.typeName = "Unknown"; // Fallback in case of error
              }
            } else {
              product.typeName = "Unknown"; // Handle products with no type
            }
            return product;
          })
        );

        setProducts(productsWithTypeNames); // Set the products with type names
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(); // Fetch products

    // Fetch categories as well
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.thedesigngrit.com/api/categories/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [selectedCategory, subCategories]); // Runs when category selection changes
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          "https://api.thedesigngrit.com/api/brand"
        );
        setBrands(response.data); // Assuming the API returns an array of brand objects
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };
  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId); // Save the selected category ID
    setSubCategories([]); // Reset subcategories
    setSelectedSubCategory(""); // Reset selected subcategory

    // Fetch subcategories if needed
    if (selectedCategoryId) {
      try {
        const response = await axios.get(
          `https://api.thedesigngrit.com/api/subcategories/byCategory/${selectedCategoryId}`
        );
        setSubCategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    if (selectedBrand && product.brandId) {
      return product.brandId._id === selectedBrand;
    }
    if (selectedSubCategory) {
      return product.subCategoryId === selectedSubCategory;
    }
    if (selectedCategory) {
      return product.category === selectedCategory;
    }
    return true; // No filter applied
  });
  const falseStatusProducts = filteredProducts.filter(
    (product) => product.status === false
  );
  const trueStatusProducts = filteredProducts.filter(
    (product) => product.status === true
  );
  const toggleMenu = (productId) => {
    setMenuOpen((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId], // Toggle specific menu state
    }));
  };

  const closeAllMenus = () => {
    setMenuOpen({}); // Close all menus
  };

  const handleEdit = (product) => {
    navigate("/update-product", { state: { product } }); // Navigate with product data
  };

  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://api.thedesigngrit.com/api/products/${product._id}`
        ); // Use the correct endpoint
        setProducts(products.filter((p) => p._id !== product._id)); // Update the state to remove the deleted product
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
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
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Close all menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => closeAllMenus(); // Close all menus on outside click

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside); // Cleanup
    };
  }, []);
  const handleOpenReviewDialog = (product) => {
    setProductToReview(product);
    setReviewDialogOpen(true);
  };

  if (showUpdate) {
    return (
      <UpdateProduct
        existingProduct={selectedProduct} // Pass the selected product data
        onBack={() => setShowUpdate(false)} // Function to go back to the product list
      />
    );
  }

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
        <FormControl sx={{ m: 1 }}>
          <InputLabel id="brand-select-label">Brand</InputLabel>
          <Select
            labelId="brand-select-label"
            value={selectedBrand}
            onChange={handleBrandChange}
            sx={{ width: "200px", color: "#2d2d2d", backgroundColor: "#fff" }}
          >
            <MenuItem value="">Select Brand</MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand._id} value={brand._id}>
                {brand.brandName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <InputLabel id="demo-multiple-chip-label">Category</InputLabel>
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
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {/* Product List or No Products Message */}
      <div>
        <div
          onClick={() => setShowFalseStatus((prev) => !prev)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            padding: "10px",
            backgroundColor: "transparent",
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginBottom: "30px",
          }}
        >
          <span>Products without approval</span>
          {showFalseStatus ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
        {showFalseStatus && (
          <div className="false-status-section">
            {falseStatusProducts.length === 0 ? (
              <p>No products Not approval.</p>
            ) : (
              <div className="product-grid">
                {falseStatusProducts.map((product) => (
                  <div className="all-product-card" key={product.id}>
                    <div className="product-card-header">
                      <img
                        src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                        alt={product.name}
                        className="all-product-image"
                      />
                      <div className="product-info-vendor">
                        <h3>{product.name}</h3>
                        <h5>{product.brandId.brandName}</h5>
                        {/* <p>{product.typeName}</p> */}
                        <p>
                          {product.salePrice ? (
                            <span
                              style={{
                                textDecoration: "line-through",
                                marginRight: "5px",
                              }}
                            >
                              {product.price} E£
                            </span>
                          ) : (
                            product.price
                          )}
                          {product.salePrice && (
                            <span style={{ color: "red" }}>
                              {product.salePrice}E£
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="menu-container">
                        <BsThreeDotsVertical
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the click from triggering the document listener
                            toggleMenu(product.id);
                          }}
                          className="three-dots-icon"
                        />
                        {menuOpen[product.id] && (
                          <div className="menu-dropdown">
                            <button onClick={() => handleEdit(product)}>
                              Edit
                            </button>
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
                            <span className="sales-value">
                              {product.sales ? product.sales : "No yet sales"}
                            </span>
                          </div>
                        </div>
                        <hr style={{ margin: "10px 0", color: "#ddd" }} />
                        <div className="product-remaining">
                          <span>Remaining Products</span>
                          <span className="remaining-value">
                            {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section for products with status true */}
      <div>
        <div
          onClick={() => setShowTrueStatus((prev) => !prev)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            padding: "10px",
            backgroundColor: "transparent",
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginBottom: "15px",
            marginTop: "30px",
          }}
        >
          <span>Products with approval</span>
          {showTrueStatus ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
        {showTrueStatus && (
          <div className="true-status-section">
            {trueStatusProducts.length === 0 ? (
              <p>No products with approval.</p>
            ) : (
              <div className="product-grid">
                {trueStatusProducts.map((product) => (
                  <div className="all-product-card" key={product.id}>
                    <div className="product-card-header">
                      <img
                        src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                        alt={product.name}
                        className="all-product-image"
                      />
                      <div className="product-info-vendor">
                        <h3>{product.name}</h3>
                        <p>{product.typeName}</p>
                        <p>{product.price}</p>
                      </div>
                      <div className="menu-container">
                        <BsThreeDotsVertical
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the click from triggering the document listener
                            toggleMenu(product.id);
                          }}
                          className="three-dots-icon"
                        />
                        {menuOpen[product.id] && ( // Check if menuOpen for this product ID is true
                          <div className="menu-dropdown">
                            <button onClick={() => handleEdit(product)}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(product)}>
                              Delete
                            </button>
                            <button onClick={() => handleInsights(product)}>
                              Promotion
                            </button>
                            <button
                              onClick={() => handleOpenReviewDialog(product)}
                            >
                              Review Product
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
                            <span className="sales-value">
                              {product.rating}
                            </span>
                          </div>
                        </div>
                        <hr style={{ margin: "10px 0", color: "#ddd" }} />
                        <div className="product-remaining">
                          <span>Remaining Products</span>
                          <span className="remaining-value">
                            {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
      {productToReview && (
        <ProductReviewDialog
          open={reviewDialogOpen}
          onClose={() => setReviewDialogOpen(false)}
          product={productToReview}
        />
      )}
    </div>
  );
};

export default ProductPageAdmin;
