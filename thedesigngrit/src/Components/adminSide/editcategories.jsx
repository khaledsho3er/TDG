import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateCategory = ({ category, onBack }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  // const [newSubCategory, setNewSubCategory] = useState({
  //   name: "",
  //   description: "",
  //   image: [],
  //   imagePreviews: [],
  //   types: [],
  // });
  const [newTypes, setNewTypes] = useState({});

  useEffect(() => {
    if (!category || !category._id) {
      console.error("Category is undefined or missing _id:", category);
      return;
    }

    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `https://api.thedesigngrit.com/api/categories/categories/${category._id}`
        );
        const fetchedCategory = response.data;

        setCategoryName(fetchedCategory.name || "");
        setCategoryDescription(fetchedCategory.description || "");
        setImagePreview(
          fetchedCategory.image
            ? `https://api.thedesigngrit.com/uploads/${fetchedCategory.image}`
            : null
        );

        setSubCategories(
          fetchedCategory.subCategories.map((subCat) => ({
            ...subCat,
            imagePreviews: subCat.image
              ? [`https://api.thedesigngrit.com/uploads/${subCat.image}`]
              : [],
            types: subCat.types || [],
          }))
        );
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [category]);

  const handleDeleteCategory = async () => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await axios.delete(
        `https://api.thedesigngrit.com/api/categories/categories/${category._id}`
      );
      alert("Category deleted successfully!");
      onBack(); // الرجوع بعد الحذف
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubCategoryImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setSubCategories((prev) => {
        const updated = [...prev];
        updated[index].image = file;
        updated[index].imagePreviews = [URL.createObjectURL(file)];
        return updated;
      });
    }
  };

  // const handleAddSubCategory = () => {
  //   if (newSubCategory.name.trim()) {
  //     setSubCategories([...subCategories, { ...newSubCategory }]);
  //     setNewSubCategory({
  //       name: "",
  //       description: "",
  //       image: [],
  //       imagePreviews: [],
  //       types: [],
  //     });
  //   }
  // };

  const handleRemoveType = (subIndex, typeIndex) => {
    setSubCategories((prev) => {
      const updated = [...prev];
      updated[subIndex].types = updated[subIndex].types.filter(
        (_, i) => i !== typeIndex
      );
      return updated;
    });
  };

  const handleAddType = (index) => {
    if (!newTypes[index] || newTypes[index].trim() === "") return; // تأكد أن الإدخال ليس فارغًا

    setSubCategories((prev) => {
      const updated = [...prev];
      updated[index].types = [
        ...updated[index].types,
        { name: newTypes[index] },
      ]; // ✅ تحديث الأنواع لكل subCategory
      return updated;
    });

    setNewTypes((prev) => ({ ...prev, [index]: "" })); // إعادة تعيين الإدخال
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !categoryDescription) {
      alert("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("description", categoryDescription);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    subCategories.forEach((subCategory, index) => {
      const subCatData = {
        name: subCategory.name,
        description: subCategory.description,
        types: subCategory.types.map((type) => ({ name: type.name })),
        _id: subCategory._id || undefined,
      };

      formData.append(`subCategories[]`, JSON.stringify(subCatData));
      // تعديل هنا

      if (subCategory.image) {
        formData.append(`subCategoryImages`, subCategory.image);
      }
    });

    const response = await axios.put(
      `https://api.thedesigngrit.com/api/categories/categories/${category._id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // ✅ التصحيح: لا داعي لاستخدام response.json()
    if (response.status === 200) {
      // تحقق من أن الطلب ناجح
      alert("Category updated successfully!");
      onBack();
    } else {
      alert(response.data.message || "Failed to update category");
    }
  };

  const handleRemoveSubCategory = (index) => {
    setSubCategories((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Montserrat" }}>
      <header className="dashboard-header-vendor">
        <h2>Update Category</h2>
        <button onClick={onBack}>Back to Categories</button>
      </header>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Category Description</label>
          <textarea
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Category Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {imagePreview && <img src={imagePreview} alt="Preview" width="200" />}
        </div>

        <div className="form-group">
          <label>Subcategories</label>
          {subCategories.map((subCategory, subIndex) => (
            <div key={subIndex}>
              <input
                type="text"
                value={subCategory.name}
                onChange={(e) => {
                  const updated = [...subCategories];
                  updated[subIndex].name = e.target.value;
                  setSubCategories(updated);
                }}
              />
              <input
                type="text"
                value={subCategory.description}
                onChange={(e) => {
                  const updated = [...subCategories];
                  updated[subIndex].description = e.target.value;
                  setSubCategories(updated);
                }}
                placeholder="Subcategory Description"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSubCategoryImageUpload(e, subIndex)}
              />
              {subCategory.imagePreviews.map((img, i) => (
                <img key={i} src={img} alt="Subcategory Preview" width="100" />
              ))}
              <button
                type="button"
                onClick={() => handleRemoveSubCategory(subIndex)}
              >
                Remove SubCategory
              </button>

              <input
                type="text"
                value={newTypes[subIndex] || ""}
                onChange={(e) =>
                  setNewTypes({ ...newTypes, [subIndex]: e.target.value })
                }
                placeholder="New Type"
              />

              {/* ✅ زر إضافة النوع */}
              <button type="button" onClick={() => handleAddType(subIndex)}>
                Add Type
              </button>

              {/* ✅ عرض الأنواع المضافة */}
              <ul>
                {subCategory.types.map((type, i) => (
                  <li key={i}>
                    {type.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveType(subIndex, i)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button type="submit">Update Category</button>
        <button
          type="button"
          onClick={handleDeleteCategory}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Delete Category
        </button>
      </form>
    </div>
  );
};

export default UpdateCategory;
