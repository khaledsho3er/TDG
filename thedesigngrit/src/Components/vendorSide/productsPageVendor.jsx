import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai"; // Import arrow icons
import axios from "axios";
import PromotionModal from "./promotionProduct"; // Import the PromotionModal component
import { useVendor } from "../../utils/vendorContext"; // Import vendor context
import UpdateProduct from "./UpdateProduct"; // Import UpdateProduct
import { Button } from "@mui/material";
import VariantDialog from "./VariantDialog";
import ConfirmationDialog from "../confirmationMsg";
// import ProductAnalyticsGraph from "./ProductAnalyticsGraph";

const ProductsPageVendor = ({ setActivePage }) => {
  const { vendor } = useVendor(); // Access vendor data from context (vendorId, brandId)
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [menuOpen, setMenuOpen] = useState(null); // Track the open menu by productId or null
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product for update
  const [promotionModalOpen, setPromotionModalOpen] = useState(false); // Modal open state
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  // State for toggling sections
  const [showFalseStatus, setShowFalseStatus] = useState(false);
  const [showTrueStatus, setShowTrueStatus] = useState(true);
  const [openVariantDialog, setOpenVariantDialog] = useState(false);
  const [variants, setVariants] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleVariantSubmit = async (variantData) => {
    try {
      const res = await axios.post(
        "http://api.thedesigngrit.com/api/products/variants",
        variantData
      );
      setVariants((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error creating variant:", err);
    }
  };

  useEffect(() => {
    if (vendor) {
      const { brandId } = vendor; // Destructure brandId from the vendor object

      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `https://api.thedesigngrit.com/api/products/getproducts/brand/${brandId}`,
            {
              params: {
                category: selectedCategory,
              },
            }
          );
          setProduct(response.data);
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

      const fetchCategories = async () => {
        try {
          const response = await axios.get(
            "https://api.thedesigngrit.com/api/categories/categories"
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
          `https://api.thedesigngrit.com/api/subcategories/byCategory/${selectedCategoryId}`
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

  const falseStatusProducts = filteredProducts.filter(
    (product) => product.status === false
  );
  const trueStatusProducts = filteredProducts.filter(
    (product) => product.status === true
  );

  const toggleMenu = (productId) => {
    setMenuOpen((prevId) => (prevId === productId ? null : productId));
  };

  const closeAllMenus = () => {
    setMenuOpen(null); // Close menu
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowUpdate(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    let success = false;
    try {
      await axios.delete(
        `https://api.thedesigngrit.com/api/products/${productToDelete._id}`
      );
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      success = true;
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product. Please try again.");
      alert("Failed to delete product. Please try again.");
    }
    setConfirmDialogOpen(false);
    setProductToDelete(null);
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

  // const indexOfLastProduct = currentPage * productsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts = filteredProducts.slice(
  //   indexOfFirstProduct,
  //   indexOfLastProduct
  // );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Close all menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => closeAllMenus(); // Close all menus on outside clicks

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside); // Cleanup
    };
  }, []);

  if (showUpdate) {
    return (
      <UpdateProduct
        existingProduct={selectedProduct} // Pass the selected product data
        onBack={() => setShowUpdate(false)} // Function to go back to the product list
      />
    );
  }

  return (
    <>
      <div className="product-list-page-vendor">
        <header className="dashboard-header-vendor">
          <div className="dashboard-header-title">
            <h2>All Products</h2>
            <p> Home &gt; All Products</p>
          </div>
          <div className="dashboard-date-vendor">
            <Button
              onClick={() => setActivePage("AddProduct")}
              variant="contained"
              style={{
                backgroundColor: "#2d2d2d",
                color: "white",
                marginLeft: "10px",
                marginTop: "20px",
              }}
            >
              <CiCirclePlus /> Add Product
            </Button>
            <Button
              onClick={() => setOpenVariantDialog(true)}
              variant="contained"
              style={{
                backgroundColor: "#2d2d2d",
                color: "white",
                marginLeft: "10px",
                marginTop: "20px",
              }}
            >
              Add Variant
            </Button>
          </div>
        </header>
        {/* <ProductAnalyticsGraph products={products} /> */}

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
            className="section-header"
            onClick={() => setShowFalseStatus((prev) => !prev)}
            style={{
              margin: "30px 0",
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
                    <div className="promotion-card" key={product.id}>
                      <div className="promotion-image-container">
                        {product && product.mainImage && (
                          <img
                            src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product?.mainImage}`}
                            alt={product?.name || "Product"}
                            className="promotion-image"
                          />
                        )}
                        {product.discountPercentage && (
                          <div className="discount-badge">
                            {product.discountPercentage}% OFF
                          </div>
                        )}
                      </div>
                      <div className="promotion-details">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: "row",
                          }}
                        >
                          <h3 className="promotion-details">{product.name}</h3>
                          <div className="menu-container">
                            <BsThreeDotsVertical
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent the click from triggering the document listener
                                toggleMenu(product._id);
                              }}
                              className="three-dots-icon"
                            />
                            {menuOpen === product._id && (
                              <div className="menu-dropdown">
                                <button onClick={() => handleEdit(product)}>
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setProductToDelete(product);
                                    setConfirmDialogOpen(true);
                                  }}
                                >
                                  Delete
                                </button>
                                <button onClick={() => handleInsights(product)}>
                                  Promotion
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="price-container">
                          <span
                            className="original-price"
                            style={{
                              textDecoration:
                                product.salePrice !== null
                                  ? "line-through"
                                  : "none",
                              color:
                                product.salePrice !== null ? "#999" : "#2d2d2d",
                            }}
                          >
                            E£{product.price}
                          </span>
                          {product.salePrice !== null && (
                            <span className="sale-price">
                              E£{product.salePrice}
                            </span>
                          )}{" "}
                        </div>
                        <p className="product-summary">
                          {product.description.substring(0, 100)}...
                        </p>
                      </div>

                      <div className="product-card-body">
                        <h5>Summary</h5>

                        <div className="metrics-container">
                          <div className="metric">
                            <span className="metric-label">Sales</span>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <span className="metric-value">
                                {product.sales ? product.sales : "No yet sales"}
                              </span>
                            </div>
                          </div>
                          <hr style={{ margin: "10px 0", color: "#ddd" }} />
                          <div className="metric">
                            <span className="metric-label">
                              Semaining Products
                            </span>
                            <span className="metric-value">
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
            className="section-header"
            onClick={() => setShowTrueStatus((prev) => !prev)}
            style={{
              margin: "30px 0",
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
                    <div className="promotion-card" key={product.id}>
                      <div className="promotion-image-container">
                        {product && product.mainImage && (
                          <img
                            src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product?.mainImage}`}
                            alt={product?.name || "Product"}
                            className="promotion-image"
                          />
                        )}
                        {product.discountPercentage && (
                          <div className="discount-badge">
                            {product.discountPercentage}% OFF
                          </div>
                        )}
                      </div>
                      <div className="promotion-details">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: "row",
                          }}
                        >
                          <h3 className="promotion-details">{product.name}</h3>
                          <div className="menu-container">
                            <BsThreeDotsVertical
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent the click from triggering the document listener
                                toggleMenu(product._id);
                              }}
                              className="three-dots-icon"
                            />
                            {menuOpen === product._id && (
                              <div className="menu-dropdown">
                                <button onClick={() => handleEdit(product)}>
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setProductToDelete(product);
                                    setConfirmDialogOpen(true);
                                  }}
                                >
                                  Delete
                                </button>
                                <button onClick={() => handleInsights(product)}>
                                  Promotion
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="price-container">
                          <span
                            className="original-price"
                            style={{
                              textDecoration:
                                product.salePrice !== null
                                  ? "line-through"
                                  : "none",
                              color:
                                product.salePrice !== null ? "#999" : "#2d2d2d",
                            }}
                          >
                            E£{product.price}
                          </span>
                          {product.salePrice !== null && (
                            <span className="sale-price">
                              E£{product.salePrice}
                            </span>
                          )}{" "}
                        </div>
                        <p className="product-summary">
                          {product.description.substring(0, 100)}...
                        </p>
                      </div>

                      <div className="product-card-body">
                        <h5>Summary</h5>

                        <div className="metrics-container">
                          <div className="metric">
                            <span className="metric-label">Sales</span>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <span className="metric-value">
                                {product.sales ? product.sales : "No yet sales"}
                              </span>
                            </div>
                          </div>
                          <hr style={{ margin: "10px 0", color: "#ddd" }} />
                          <div className="metric">
                            <span className="metric-label">
                              Semaining Products
                            </span>
                            <span className="metric-value">
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
        <VariantDialog
          open={openVariantDialog}
          onClose={() => setOpenVariantDialog(false)}
          onSubmit={handleVariantSubmit}
          sku={product?.sku}
          brandId={vendor?.brandId}
        />
        {/* Promotion Modal */}
        {promotionModalOpen && (
          <PromotionModal
            open={promotionModalOpen}
            onClose={() => setPromotionModalOpen(false)}
            onSave={handleSavePromotion}
            product={selectedProduct}
          />
        )}
        <ConfirmationDialog
          open={confirmDialogOpen}
          title="Delete Product"
          content="Are you sure you want to delete this product?"
          onConfirm={handleDelete}
          onCancel={() => {
            setConfirmDialogOpen(false);
            setProductToDelete(null);
          }}
        />
      </div>
    </>
  );
};

export default ProductsPageVendor;
