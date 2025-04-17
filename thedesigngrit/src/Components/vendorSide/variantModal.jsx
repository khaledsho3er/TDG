import React, { useState } from "react";

const VariantsModal = ({ formData, setFormData, handleClose }) => {
  const [newVariant, setNewVariant] = useState({
    name: "",
    price: "",
    color: "",
    size: "",
    images: [],
  });

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant({ ...newVariant, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewVariant({
      ...newVariant,
      images: [...newVariant.images, ...files],
    });
  };

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, newVariant], // Add the new variant to the form data
    });
    setNewVariant({
      name: "",
      price: "",
      color: "",
      size: "",
      images: [],
    }); // Reset the variant form
    handleClose(); // Close the modal
  };

  return (
    <div className="modal">
      <h2>Add Variant</h2>
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={newVariant.name}
          onChange={handleVariantChange}
        />
      </div>
      <div>
        <label>Price</label>
        <input
          type="text"
          name="price"
          value={newVariant.price}
          onChange={handleVariantChange}
        />
      </div>
      <div>
        <label>Color</label>
        <input
          type="text"
          name="color"
          value={newVariant.color}
          onChange={handleVariantChange}
        />
      </div>
      <div>
        <label>Size</label>
        <input
          type="text"
          name="size"
          value={newVariant.size}
          onChange={handleVariantChange}
        />
      </div>
      <div>
        <label>Images</label>
        <input type="file" multiple onChange={handleImageUpload} />
      </div>

      <button onClick={handleAddVariant}>Add Variant</button>
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default VariantsModal;
