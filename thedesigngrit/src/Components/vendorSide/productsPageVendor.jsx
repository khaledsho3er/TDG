import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import axios from "axios";
import PromotionModal from "./promotionProduct";
import { useVendor } from "../../utils/vendorContext";
import UpdateProduct from "./UpdateProduct";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProductsPageVendor = ({ setActivePage }) => {
  const { vendor } = useVendor();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState({});
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [showFalseStatus, setShowFalseStatus] = useState(false);
  const [showTrueStatus, setShowTrueStatus] = useState(true);

  // Analytics states
  const [selectedProducts, setSelectedProducts] = useState([]); // For comparison (up to 3)
  const [timeframe, setTimeframe] = useState("30d"); // Default 30 days
  const [analyticsData, setAnalyticsData] = useState(null);

  const productsPerPage = 12;

  // Fetch products and analytics data
  useEffect(() => {
    if (vendor) {
      const { brandId } = vendor;

      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `https://tdg-db.onrender.com/api/products/getproducts/brand/${brandId}`,
            { params: { category: selectedCategory } }
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
  }, [vendor, selectedCategory]);

  // Fetch analytics data when selected products or timeframe changes
  useEffect(() => {
    if (selectedProducts.length > 0) {
      fetchAnalyticsData();
    }
  }, [selectedProducts, timeframe]);

  const fetchAnalyticsData = async () => {
    try {
      const promises = selectedProducts.map((product) =>
        axios.get(
          `https://tdg-db.onrender.com/api/products/sales/${product._id}`,
          { params: { timeframe } }
        )
      );
      const responses = await Promise.all(promises);

      const datasets = responses.map((response, index) => ({
        label: selectedProducts[index].name,
        data: response.data.salesData, // Assuming API returns { date, sales }
        borderColor: `hsl(${index * 120}, 70%, 50%)`,
        backgroundColor: `hsla(${index * 120}, 70%, 50%, 0.2)`,
        fill: true,
      }));

      setAnalyticsData({
        labels: responses[0]?.data.dates || [], // Assuming consistent dates across products
        datasets,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Product Sales Analytics" },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Sales" }, beginAtZero: true },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  // Product selection for comparison
  const handleProductSelect = (product) => {
    if (selectedProducts.some((p) => p._id === product._id)) {
      setSelectedProducts(
        selectedProducts.filter((p) => p._id !== product._id)
      );
    } else if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  // Other existing functions remain largely the same
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
    if (selectedSubCategory)
      return product.subCategoryId === selectedSubCategory;
    if (selectedCategory) return product.category === selectedCategory;
    return true;
  });

  const falseStatusProducts = filteredProducts.filter((p) => !p.status);
  const trueStatusProducts = filteredProducts.filter((p) => p.status);

  const toggleMenu = (productId) => {
    setMenuOpen((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const closeAllMenus = () => setMenuOpen({});

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowUpdate(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `https://tdg-db.onrender.com/api/products/${product._id}`
        );
        setProducts(products.filter((p) => p._id !== product._id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
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

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const handleClickOutside = () => closeAllMenus();
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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
          <p>Home All Products</p>
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

      {/* Analytics Graph Section */}
      <div style={{ margin: "20px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
          <div>Selected Products: {selectedProducts.length}/3</div>
        </div>
        {analyticsData && (
          <div style={{ height: "400px" }}>
            <Line data={analyticsData} options={chartOptions} />
          </div>
        )}
      </div>

      {/* Filters */}
      <div
        style={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}
      >
        <FormControl sx={{ m: 1 }}>
          <InputLabel>Category</InputLabel>
          <Select
            sx={{ width: "200px", color: "#2d2d2d", backgroundColor: "#fff" }}
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

      {/* Products with status false */}
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
                  <div
                    className="all-product-card"
                    key={product._id}
                    onMouseEnter={() =>
                      !selectedProducts.length && setSelectedProducts([product])
                    }
                    onMouseLeave={() =>
                      !selectedProducts.length && setSelectedProducts([])
                    }
                    style={{
                      border: selectedProducts.some(
                        (p) => p._id === product._id
                      )
                        ? "2px solid #2d2d2d"
                        : "1px solid #ddd",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.some(
                        (p) => p._id === product._id
                      )}
                      onChange={() => handleProductSelect(product)}
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                      }}
                    />
                    {/* Rest of the product card content remains the same */}
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
                            toggleMenu(product._id);
                          }}
                          className="three-dots-icon"
                        />
                        {menuOpen[product._id] && (
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
                          <span className="sales-value">
                            {product.sales ? product.sales : "No yet sales"}
                          </span>
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

      {/* Products with status true */}
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
                  <div
                    className="all-product-card"
                    key={product._id}
                    onMouseEnter={() =>
                      !selectedProducts.length && setSelectedProducts([product])
                    }
                    onMouseLeave={() =>
                      !selectedProducts.length && setSelectedProducts([])
                    }
                    style={{
                      border: selectedProducts.some(
                        (p) => p._id === product._id
                      )
                        ? "2px solid #2d2d2d"
                        : "1px solid #ddd",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.some(
                        (p) => p._id === product._id
                      )}
                      onChange={() => handleProductSelect(product)}
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                      }}
                    />
                    {/* Rest of the product card content remains the same */}
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
                            toggleMenu(product._id);
                          }}
                          className="three-dots-icon"
                        />
                        {menuOpen[product._id] && (
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
                          <span className="sales-value">{product.rating}</span>
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
