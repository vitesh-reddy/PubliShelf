//client/src/pages/publisher/publish-book/PublishBook.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { publishBook } from "../../../services/publisher.services.js";

const PublishBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    price: "",
    quantity: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageFile) {
      setError("Please upload a book cover image.");
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "imageFile") {
        submitData.append(key, formData[key]);
      } else if (formData[key]) {
        submitData.append(key, formData[key]);
      }
    });

    try {
      setLoading(true);
      const response = await publishBook(submitData);
      if (response.success) {
        alert("Book published successfully!");
        navigate("/publisher/dashboard");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Error publishing book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/publisher/dashboard" className="flex items-center mb-6">
          <i className="fas fa-arrow-left text-gray-600 mr-4" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">PubliShelf</span>
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Publish New Book</h1>
            <p className="text-gray-500 mt-1">Fill in the details to list your book for sale</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700">Book Title</label>
                <input
                  type="text"
                  name="title"
                  id="bookTitle"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 px-3 py-2 block w-full rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  name="author"
                  id="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="mt-1 px-3 py-2 block w-full rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows="4"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="mt-1 px-3 py-2 block w-full rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                <select
                  name="genre"
                  id="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                  className="mt-1 px-3 py-2 block w-full rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="" disabled>Select Genre</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Romance">Romance</option>
                  <option value="Thriller">Thriller</option>
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="1"
                  min="0"
                  required
                  className="mt-1 px-3 py-2 block w-full rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  className="mt-1 px-3 py-2 block w-full rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Book Cover Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <FaCloudUploadAlt className="text-gray-400 text-3xl mx-auto" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="imageFile" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                      <span>Upload a file</span>
                      <input id="imageFile" name="imageFile" type="file" onChange={handleImageChange} className="sr-only" accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {imagePreview && (
                <div id="imagePreviewContainer" className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Image Preview:</h4>
                  <img src={imagePreview} alt="Preview" className="w-48 h-64 object-cover rounded-lg shadow-md" />
                </div>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-4">
              <Link to="/publisher/dashboard" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </Link>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
                {loading ? "Publishing..." : "Publish Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublishBook;