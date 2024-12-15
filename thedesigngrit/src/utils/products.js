// In a service file like productService.js
export const updateProduct = async (updatedProduct) => {
  try {
    // Make the API call to update the product
    const response = await fetch("/api/products/" + updatedProduct.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};
export const deleteProduct = async (productId) => {
  try {
    // Make the API call to delete the product
    const response = await fetch("/api/products/" + productId, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
