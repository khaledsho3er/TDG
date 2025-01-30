import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PromotionModal from "./promotionProduct"; // Import the PromotionModal component
import { useVendor } from "../../utils/vendorContext"; // Import vendor context
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

const ProductsPageVendor = () => {
  const navigate = useNavigate();
  const { vendor } = useVendor(); // Access vendor data from context (vendorId, brandId)
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [menuOpen, setMenuOpen] = useState({}); // State to track which menu is open

  const [promotionModalOpen, setPromotionModalOpen] = useState(false); // Modal open state
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product for the promotion

  useEffect(() => {
    if (vendor) {
      console.log("Brand ID:", vendor.brandId);
      const { brandId } = vendor; // Destructure brandId from the vendor object
      console.log(subCategories);

      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/products/getproducts/brand/${brandId}`,
            {
              params: {
                category: selectedCategory,
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
                    `http://localhost:5000/api/types/types/${product.type}`
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

      const fetchCategories = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/categories/categories"
          );
          setCategories(response.data); // Set the fetched categories
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchProducts(); // Fetch products
      fetchCategories(); // Fetch categories
    }
  }, [vendor, selectedCategory, subCategories]); // Fetch when vendor context changes

  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId); // Save the selected category ID
    setSubCategories([]); // Reset subcategories
    setSelectedSubCategory(""); // Reset selected subcategory

    // Fetch subcategories if needed
    if (selectedCategoryId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/subcategories/byCategory/${selectedCategoryId}`
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
      return product.category === selectedCategory; // Match product.category with selectedCategory ID
    }
    return true; // No filter applied
  });

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

  // Close all menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => closeAllMenus(); // Close all menus on outside click

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside); // Cleanup
    };
  }, []);

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
      {filteredProducts.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "50px",
            gap: "10px",
          }}
        >
          <ProductionQuantityLimitsIcon
            style={{ fontSize: "48px", color: "#666" }}
          />
          <p style={{ fontSize: "18px", color: "#666" }}>
            No products found in this category.
          </p>
        </div>
      ) : (
        <div className="vendor-products-list-grid">
          {currentProducts.map((product) => (
            <div className="all-product-card" key={product.id}>
              <div className="product-card-header">
                <img
                  src={`http://localhost:5000${
                    product.mainImage.startsWith("/")
                      ? product.mainImage
                      : "/" + product.mainImage
                  }`}
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
      )}

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
