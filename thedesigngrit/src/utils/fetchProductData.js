export async function fetchProductData(id) {
  try {
    const response = await fetch(
      `https://tdg-db.onrender.com/api/products/getsingle/${id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }
    const data = await response.json();
    // Find product by ID (ensure id is a number)
    const product = data.find((product) => product.id === Number(id));
    return product || null; // Return null if no product is found
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null; // Return null in case of an error
  }
}

export const fetchProductReview = async (productId) => {
  try {
    const response = await fetch(`/json/review.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch product reviews");
    }
    const reviews = await response.json();
    const productReviews = reviews.filter(
      (review) => review.productId === Number(productId)
    );
    return productReviews || []; // Return empty array if no reviews found
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
};
