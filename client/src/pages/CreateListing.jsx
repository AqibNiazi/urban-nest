import React, { useState } from "react";
import { InputField, InputNumber } from "@/components";
import { notify } from "@/util/notify";
import { clientBaseURL, clientEndPoints } from "@/config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Section, TypeToggle, FeatureBadge } from "@/components/Listing";

// ── Main component ───────────────────────────────────────────────────────────
const CreateListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // ✅ FIX: resolve _id vs id (mongoose returns _id)
  const userId = currentUser?.id || currentUser?._id;

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    type: "sale",
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

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

  const storeImage = async (file) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error(`"${file.name}" exceeds 2MB limit`);
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append("folder", import.meta.env.VITE_CLOUDINARY_FOLDER);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data },
    );

    if (!res.ok) throw new Error("Cloudinary upload failed");
    const result = await res.json();
    return result.secure_url;
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
    setUploadProgress(0);

    try {
      let completed = 0;
      const urls = await Promise.all(
        files.map(async (file) => {
          const url = await storeImage(file);
          completed++;
          setUploadProgress(Math.round((completed / files.length) * 100));
          return url;
        }),
      );

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
      // ✅ FIX: Clear file selection after successful upload
      setFiles([]);
    } catch (err) {
      setImageUploadError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      setError("Please upload at least 1 image");
      return;
    }
    if (+formData.regularPrice < +formData.discountPrice) {
      setError("Discount price must be less than regular price");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await clientBaseURL.post(clientEndPoints.createListing, {
        ...formData,
        // ✅ FIX: userRef uses resolved userId (handles _id vs id)
        // Note: backend should ideally use req.user.id instead, but keeping
        // frontend fix to match your current backend
        userRef: userId,
      });

      if (response.data.success) {
        notify.success(response.data.message);
        navigate(`/listing/${response.data.data._id}`);
      } else {
        setError(response.data.message);
        notify.error(response.data.message);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create listing";
      setError(msg);
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const totalImages = formData.imageUrls.length;
  const canUploadMore = totalImages < 6;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-stone-50 to-amber-50/40 py-10 px-4">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-orange-100/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-stone-100/60 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-amber-600 tracking-wide uppercase">
              New Listing
            </span>
          </div>
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">
            Create a Listing
          </h1>
          <p className="text-stone-500 mt-1.5 text-sm">
            Fill in the details below to list your property on UrbanNest
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* ── Left column (3/5) ── */}
            <div className="lg:col-span-3 space-y-5">
              {/* Basic Info */}
              <Section
                step="1"
                title="Property Details"
                description="Basic information about your listing"
              >
                <div className="space-y-4">
                  <InputField
                    labeltext="Listing Title"
                    labelfor="title"
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g. Modern Downtown Apartment"
                    maxLength="62"
                    minLength="10"
                    required
                    onChange={handleChange}
                    value={formData.title}
                  />

                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-stone-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      onChange={handleChange}
                      value={formData.description}
                      rows={4}
                      placeholder="Describe your property — highlights, nearby amenities, unique features…"
                      className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm
                                 rounded-xl px-4 py-3 resize-none
                                 placeholder:text-stone-400
                                 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                                 hover:border-stone-300 transition-all duration-200"
                    />
                  </div>

                  <InputField
                    labeltext="Address"
                    labelfor="address"
                    type="text"
                    id="address"
                    name="address"
                    placeholder="e.g. 123 Main St, New York, NY"
                    required
                    onChange={handleChange}
                    value={formData.address}
                  />
                </div>
              </Section>

              {/* Listing Type */}
              <Section
                step="2"
                title="Listing Type"
                description="Is this property for sale or rent?"
              >
                <TypeToggle value={formData.type} onChange={handleChange} />
              </Section>

              {/* Features */}
              <Section
                step="3"
                title="Features & Amenities"
                description="Select all that apply"
              >
                <div className="flex flex-wrap gap-2.5">
                  <FeatureBadge
                    id="parking"
                    checked={formData.parking}
                    onChange={handleChange}
                    label="Parking"
                    icon="🚗"
                  />
                  <FeatureBadge
                    id="furnished"
                    checked={formData.furnished}
                    onChange={handleChange}
                    label="Furnished"
                    icon="🛋️"
                  />
                  <FeatureBadge
                    id="offer"
                    checked={formData.offer}
                    onChange={handleChange}
                    label="Special Offer"
                    icon="🏷️"
                  />
                </div>
              </Section>

              {/* Rooms & Pricing */}
              <Section
                step="4"
                title="Rooms & Pricing"
                description="Set capacity and price details"
              >
                <div className="space-y-5">
                  {/* Beds & Baths */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 text-sm font-semibold text-stone-700">
                        Bedrooms
                      </label>
                      <InputNumber
                        id="bedrooms"
                        min="1"
                        max="10"
                        required
                        onChange={handleChange}
                        value={formData.bedrooms}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-sm font-semibold text-stone-700">
                        Bathrooms
                      </label>
                      <InputNumber
                        id="bathrooms"
                        min="1"
                        max="10"
                        required
                        onChange={handleChange}
                        value={formData.bathrooms}
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 text-sm font-semibold text-stone-700">
                        Regular Price
                        {formData.type === "rent" && (
                          <span className="text-xs font-normal text-stone-400 ml-1.5">
                            ($ / month)
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">
                          $
                        </span>
                        <input
                          type="number"
                          id="regularPrice"
                          min="50"
                          max="10000000"
                          required
                          onChange={handleChange}
                          value={formData.regularPrice}
                          className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm
                                     rounded-xl pl-7 pr-4 py-2.5
                                     focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                                     hover:border-stone-300 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {formData.offer && (
                      <div>
                        <label className="block mb-1.5 text-sm font-semibold text-stone-700">
                          Discounted Price
                          {formData.type === "rent" && (
                            <span className="text-xs font-normal text-stone-400 ml-1.5">
                              ($ / month)
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">
                            $
                          </span>
                          <input
                            type="number"
                            id="discountPrice"
                            min="0"
                            max="10000000"
                            required
                            onChange={handleChange}
                            value={formData.discountPrice}
                            className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm
                                       rounded-xl pl-7 pr-4 py-2.5
                                       focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                                       hover:border-stone-300 transition-all duration-200"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price hint */}
                  {formData.offer &&
                    +formData.discountPrice >= +formData.regularPrice && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
                        <svg
                          className="w-4 h-4 shrink-0"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        Discount price must be less than regular price
                      </div>
                    )}
                </div>
              </Section>
            </div>

            {/* ── Right column (2/5) ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Image upload */}
              <Section
                step="5"
                title="Property Photos"
                description={`${totalImages}/6 uploaded · First image is the cover`}
              >
                <div className="space-y-4">
                  {/* Drop zone */}
                  <label
                    htmlFor="images"
                    className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-2xl py-8 cursor-pointer transition-all duration-200
                      ${
                        canUploadMore
                          ? "border-stone-300 hover:border-amber-400 hover:bg-amber-50/50 bg-stone-50"
                          : "border-stone-200 bg-stone-50 opacity-50 cursor-not-allowed"
                      }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-stone-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-stone-700">
                        {files.length > 0
                          ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                          : "Choose photos"}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        PNG, JPG, WEBP · Max 2MB each
                      </p>
                    </div>
                    <input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={!canUploadMore}
                      onChange={(e) => {
                        setFiles(Array.from(e.target.files));
                        setImageUploadError(null);
                      }}
                      className="hidden"
                    />
                  </label>

                  {/* Upload button */}
                  <button
                    type="button"
                    disabled={uploading || files.length === 0 || !canUploadMore}
                    onClick={handleImageSubmit}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold
                               bg-stone-800 hover:bg-stone-900 text-white rounded-xl
                               shadow-md shadow-stone-200 hover:shadow-stone-300
                               transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {uploading ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Uploading {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        </svg>
                        Upload Photos
                      </>
                    )}
                  </button>

                  {/* Upload progress bar */}
                  {uploading && (
                    <div className="w-full bg-stone-200 rounded-full h-1.5">
                      <div
                        className="bg-linear-to-r from-amber-400 to-orange-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Upload error */}
                  {imageUploadError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
                      <svg
                        className="w-4 h-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                      {imageUploadError}
                    </div>
                  )}

                  {/* Image preview grid */}
                  {formData.imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {formData.imageUrls.map((url, index) => (
                        <div
                          key={url}
                          className="relative group rounded-xl overflow-hidden aspect-video border border-stone-200"
                        >
                          <img
                            src={url}
                            alt={`listing ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Cover badge */}
                          {index === 0 && (
                            <span className="absolute top-1.5 left-1.5 text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-md font-semibold">
                              Cover
                            </span>
                          )}
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full
                                       opacity-0 group-hover:opacity-100 transition-opacity duration-150
                                       flex items-center justify-center shadow-md"
                          >
                            <svg
                              className="w-3 h-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Section>

              {/* Submit */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-100 shadow-sm p-6 space-y-3">
                {/* Summary */}
                <div className="flex items-center justify-between text-xs text-stone-500 pb-3 border-b border-stone-100">
                  <span>Photos uploaded</span>
                  <span
                    className={`font-semibold ${totalImages > 0 ? "text-amber-600" : "text-stone-400"}`}
                  >
                    {totalImages} / 6
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500 pb-3 border-b border-stone-100">
                  <span>Listing type</span>
                  <span className="font-semibold text-stone-700 capitalize">
                    {formData.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500 pb-4 border-b border-stone-100">
                  <span>Regular price</span>
                  <span className="font-semibold text-stone-700">
                    {formData.regularPrice > 0
                      ? `$${Number(formData.regularPrice).toLocaleString()}`
                      : "—"}
                    {formData.type === "rent" && formData.regularPrice > 0 && (
                      <span className="font-normal text-stone-400"> /mo</span>
                    )}
                  </span>
                </div>

                {/* Global error */}
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
                    <svg
                      className="w-4 h-4 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white
                             bg-linear-to-r from-amber-500 to-orange-500
                             hover:from-amber-600 hover:to-orange-600
                             rounded-xl shadow-lg shadow-amber-200 hover:shadow-amber-300
                             transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
                             disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Publishing…
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 2L11 13" />
                        <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                      </svg>
                      Publish Listing
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;