// src/utils/fetchProductData.js
export const fetchProductData = async () => {
    try {
      const response = await fetch("/json/productData.json"); // Path relative to `public` folder
      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product data:", error);
      return []; // Return an empty array in case of an error
    }
  };
  export const fetchProductReview = async () => {
    try {
      const response = await fetch("/json/review.json"); // Path relative to `public` folder
      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product data:", error);
      return []; // Return an empty array in case of an error
    }
  };