export async function fetchProductData(id) {
  try {
    const response = await fetch(`/json/productData.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }
    const data = await response.json();
    // Assuming the JSON file contains an array of products
    // Filter to find the product with the matching ID
    const product = data.find((product) => product.id === id);
    return product ? [product] : []; // Return an array with a single product
  } catch (error) {
    console.error("Error fetching product data:", error);
    return []; // Return an empty array in case of error
  }
}
export const fetchProductReview = async (productId) => {
  try {
    // Fetch reviews from a different file if applicable, or use the same structure
    const response = await fetch(`/json/productData.json`);

    if (!response.ok) {
      throw new Error("Failed to fetch product reviews");
    }

    const reviews = await response.json();
    const productReviews = reviews.filter(
      (review) => review.productId === productId
    );

    return productReviews || []; // Return reviews if found
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
};
