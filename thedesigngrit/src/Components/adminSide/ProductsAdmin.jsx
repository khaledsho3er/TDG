import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const ProductsPageAdmin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const productsPerPage = 12; // Products per page

  const [menuOpen, setMenuOpen] = useState(null); // State to track which menu is open

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
    console.log("Insights", product);
    // Add your insights functionality here
  };
  // Function to fetch JSON data
  const fetchProducts = async () => {
    try {
      const response = await fetch("/json/productData.json"); // Replace with the actual path
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Fetch data on component mount
  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  // Function to handle page change
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
      <div className="vendor-products-list-grid">
        {currentProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-card-header">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info-vendor">
                <h3>{product.name}</h3>
                <p>{product.type}</p>
                <p>{product.price}</p>
                <p>{product.category}</p>

                <img
                  src={product.brandLogo}
                  alt="Logo"
                  style={{
                    width: "70px",
                    height: "30px",
                    PaddingTop: "10px",
                  }}
                />
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
                      Insights
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
      <div
        className="pagination"
        style={{ textAlign: "left", margin: "120px 0" }}
      >
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
              border:
                currentPage === index + 1
                  ? "1px solid #2d2d2d"
                  : "1px solid #2d2d2d",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: currentPage === index + 1 ? "bold" : "normal",
            }}
          >
            {index + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => paginate(currentPage + 1)}
            style={{
              margin: "5px",
              padding: "8px 12px",
              backgroundColor: "#efebe8",
              border: "1px solid #2d2d2d",
              borderRadius: "5px",
              cursor: "pointer",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            NEXT{" "}
            <IoIosArrowForward
              style={{ color: "#2d2d2d", marginBottom: "-2px" }}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductsPageAdmin;
