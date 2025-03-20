import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import axios from "axios";
import PromotionModal from "./promotionProduct";
import { useVendor } from "../../utils/vendorContext";
import UpdateProduct from "./UpdateProduct";
import ProductAnalyticsGraph from "./ProductAnalyticsGraph";

const ProductsPageVendor = ({ setActivePage }) => {
  const { vendor } = useVendor();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [menuOpen, setMenuOpen] = useState({});
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [showFalseStatus, setShowFalseStatus] = useState(false);
  const [showTrueStatus, setShowTrueStatus] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [timeframe, setTimeframe] = useState("month");

  useEffect(() => {
    if (vendor) {
      const { brandId } = vendor;

      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `https://tdg-db.onrender.com/api/products/getproducts/brand/${brandId}`,
            {
              params: {
                category: selectedCategory,
              },
            }
          );
          const fetchedProducts = response.data;

          const productsWithTypeNames = await Promise.all(
            fetchedProducts.map(async (product) => {
              if (product.type) {
                try {
                  const typeResponse = await axios.get(
                    `https://tdg-db.onrender.com/api/types/types/${product.type}`
                  );
                  product.typeName = typeResponse.data.name || "Unknown";
                } catch (error) {
                  console.error("Error fetching type:", error);
                  product.typeName = "Unknown";
                }
              } else {
                product.typeName = "Unknown";
              }
              return product;
            })
          );
          setProducts(productsWithTypeNames);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      const fetchCategories = async () => {
        try {
          const response = await axios.get(
            "https://tdg-db.onrender.com/api/categories/categories"
          );
          setCategories(response.data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchProducts();
      fetchCategories();
    }
  }, [vendor, selectedCategory, subCategories]);

  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    setSubCategories([]);
    setSelectedSubCategory("");

    if (selectedCategoryId) {
      try {
        const response = await axios.get(
          `https://tdg-db.onrender.com/api/subcategories/byCategory/${selectedCategoryId}`
        );
        setSubCategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    if (selectedSubCategory) {
      return product.subCategoryId === selectedSubCategory;
    }
    if (selectedCategory) {
      return product.category === selectedCategory;
    }
    return true;
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
      [productId]: !prevState[productId],
    }));
  };

  const closeAllMenus = () => {
    setMenuOpen({});
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowUpdate(true);
  };

  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://tdg-db.onrender.com/api/products/${product._id}`
        );
        setProducts(products.filter((p) => p._id !== product._id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleInsights = (product) => {
    setSelectedProduct(product);
    setPromotionModalOpen(true);
  };

  const handleSavePromotion = (promotionDetails) => {
    console.log("Promotion Details:", promotionDetails);
    setPromotionModalOpen(false);
  };

  const handleProductSelect = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const handleClickOutside = () => closeAllMenus();

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (showUpdate) {
    return (
      <UpdateProduct
        existingProduct={selectedProduct}
        onBack={() => setShowUpdate(false)}
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
            onClick={() => setActivePage("AddProduct")}
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

      {/* Graph Component */}
      <ProductAnalyticsGraph
        products={products}
        selectedProducts={selectedProducts}
        timeframe={timeframe}
      />

      {/* Timeframe Selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          marginBottom: "20px",
        }}
      >
        <FormControl sx={{ m: 1 }}>
          <InputLabel id="timeframe-label">Timeframe</InputLabel>
          <Select
            sx={{
              width: "200px",
              color: "#2d2d2d",
              backgroundColor: "#fff",
            }}
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>
      </div>

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

      {/* Section for products with status false */}
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
                        <p>{product.typeName}</p>
                        <p>{product.price}</p>
                      </div>
                      <div className="menu-container">
                        <BsThreeDotsVertical
                          onClick={(e) => {
                            e.stopPropagation();
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
                            <button
                              onClick={() => handleProductSelect(product._id)}
                            >
                              {selectedProducts.includes(product._id)
                                ? "Deselect"
                                : "Select"}
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
                            e.stopPropagation();
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
                            <button
                              onClick={() => handleProductSelect(product._id)}
                            >
                              {selectedProducts.includes(product._id)
                                ? "Deselect"
                                : "Select"}
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
    </div>
  );
};

export default ProductsPageVendor;
