import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import axios from "axios";
import Header from "../Components/navBar";
import ProductCards from "../Components/Products/Productsgrid";
import FilterSection from "../Components/Products/filters";
import TopFilter from "../Components/Products/TopFilters";
import Footer from "../Components/Footer";

function ProductsPage() {
  const { subcategoryId, subcategoryName } = useParams();
  const [products, setProducts] = useState([]); // جميع المنتجات
  const [filteredProducts, setFilteredProducts] = useState([]); // المنتجات بعد الفلترة

  // 🟢 جلب المنتجات عند تحميل الصفحة
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `https://tdg-db.onrender.com/api/products/subcategory/${subcategoryId}/${subcategoryName}`
        );
        setProducts(data);
        setFilteredProducts(data); // عرض جميع المنتجات مبدئيًا
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [subcategoryId, subcategoryName]);

  return (
    <Box>
      <Header />
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} sm={4} md={3}>
          <FilterSection
            products={products}
            setFilteredProducts={setFilteredProducts}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <ProductCards products={filteredProducts} />
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}

export default ProductsPage;
