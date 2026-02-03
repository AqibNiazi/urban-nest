import React, { useEffect, useState } from "react";
import { Button, InputCheck, InputField, InputNumber } from "@/components";
import { notify } from "@/util/notify";
import { clientBaseURL, clientEndPoints } from "@/config";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
const UpdateListing = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const { listingId } = useParams();

  const { currentUser } = useSelector((state) => state.user);
  console.log("Current user", currentUser);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    type: "sale", // default
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    imageUrls: [],
  });

  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await clientBaseURL.get(
          `${clientEndPoints.getListing}/${listingId}`,
        );

        if (response.data.success) {
          notify.success(response.data.message);
          setFormData(response.data.data);
        }
      } catch (error) {
        setError(error.response.data.message);
      }
    };
    fetchListing();
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (id === "sale") {
        setFormData({ ...formData, type: checked ? "sale" : "rent" });
      } else if (id === "rent") {
        setFormData({ ...formData, type: checked ? "rent" : "sale" });
      } else {
        setFormData({ ...formData, [id]: checked });
      }
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleImageSubmit = async () => {
    if (files.length === 0) {
      setImageUploadError("Please select at least 1 image");
      return;
    }

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError("You can only upload up to 6 images total");
      return;
    }

    setUploading(true);
    setImageUploadError(null);

    try {
      const urls = await Promise.all(files.map(storeImage));

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
    } catch (err) {
      setImageUploadError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Image must be less than 2MB");
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append("folder", import.meta.env.VITE_CLOUDINARY_FOLDER);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      },
    );

    if (!res.ok) {
      throw new Error("Cloudinary upload failed");
    }

    const result = await res.json();
    return result.secure_url;
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1)
      return setError("Please upload at least 1 image");

    if (+formData.regularPrice < +formData.discountPrice)
      return setError("Discount price must be less than regular price");
    try {
      setLoading(true);
      setError(null);
      const response = await clientBaseURL.put(
        `${clientEndPoints.updateListing}/${listingId}`,
        { ...formData, userRef: currentUser.id },
      );

      console.log(response);
      if (response.data.success) {
        notify.success(response.data.message);
        navigate(`/listing/${response.data.data._id}`);
        // optionally redirect or reset form
      } else {
        setError(response.data.message);
        notify.error(response.data.message);
      }
    } catch (err) {
      setError("Failed to update listing");
      notify.error(err.response?.data?.message || "Failed to Update listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <InputField
            type="text"
            placeholder="Title"
            id="title"
            name="title"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                  focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 placeholder:text-sm"
            id="description"
            name="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <InputField
            type="text"
            placeholder="Address"
            name="address"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap">
            <InputCheck
              id="sale"
              onChange={handleChange}
              checked={formData.type === "sale"}
              label="Sale"
            />
            <InputCheck
              id="rent"
              onChange={handleChange}
              checked={formData.type === "rent"}
              label="Rent"
            />
            <InputCheck
              id="parking"
              onChange={handleChange}
              checked={formData.parking}
              label="Parking spot"
            />
            <InputCheck
              id="furnished"
              onChange={handleChange}
              checked={formData.furnished}
              label="Furnished"
            />
            <InputCheck
              id="offer"
              onChange={handleChange}
              checked={formData.offer}
              label="Offer"
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <InputNumber
              type="number"
              id="bedrooms"
              min="1"
              max="10"
              required
              onChange={handleChange}
              value={formData.bedrooms}
              label="Beds"
            />

            <InputNumber
              type="number"
              id="bathrooms"
              min="1"
              max="10"
              required
              onChange={handleChange}
              value={formData.bathrooms}
              label="Baths"
            />

            <div className="flex items-center gap-2">
              <InputNumber
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <InputNumber
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>

                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex items-center gap-2">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              type="file"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                  focus:ring-blue-600 focus:border-blue-600 block w-full p-3.5 placeholder:text-sm"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className=" text-white bg-green-600 hover:bg-green-700 py-3 px-4 rounded  hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          <ul>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <li
                  key={url}
                  className="flex justify-between p-3 border border-gray-300 rounded-xl items-center mb-4"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-25 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-2.5 bg-red-400 hover:bg-red-500 text-white rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>

          <Button
            disabled={loading || uploading}
            className={`uppercase
              ${
                loading || uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-slate-700 hover:bg-slate-800"
              } 
              transition-colors duration-200`}
          >
            {loading ? "Updating..." : "Update listing"}
          </Button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
