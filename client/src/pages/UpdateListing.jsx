import React, { useEffect, useState } from "react";
import { InputField } from "@/components";
import { notify } from "@/util/notify";
import { clientBaseURL, clientEndPoints } from "@/config";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { storeImage } from "@/util/StoreImage";
import {
  Section,
  TypeToggle,
  FeatureBadge,
  ImageUploadSection,
  SubmitPanel,
} from "@/components/Listing";

const UpdateListing = () => {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  // ✅ FIX: handle both _id and id
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
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch existing listing ───────────────────────────────────────────────
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setFetchLoading(true);
        const response = await clientBaseURL.get(
          `${clientEndPoints.getListing}/${listingId}`,
        );
        if (response.data.success) {
          setFormData(response.data.data);
        }
      } catch (err) {
        // ✅ FIX: optional chaining — won't crash if server unreachable
        setError(err?.response?.data?.message || "Failed to load listing");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (id === "sale")
        setFormData({ ...formData, type: checked ? "sale" : "rent" });
      else if (id === "rent")
        setFormData({ ...formData, type: checked ? "rent" : "sale" });
      else setFormData({ ...formData, [id]: checked });
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
      setImageUploadError("Max 6 images total");
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
      // ✅ FIX: Clear files after successful upload
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
      const response = await clientBaseURL.put(
        `${clientEndPoints.updateListing}/${listingId}`,
        { ...formData, userRef: userId },
      );
      if (response.data.success) {
        notify.success(response.data.message);
        navigate(`/listing/${response.data.data._id}`);
      } else {
        setError(response.data.message);
        notify.error(response.data.message);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update listing";
      setError(msg);
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-stone-50 to-amber-50/40 py-10 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-stone-400">
          <svg
            className="w-8 h-8 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <p className="text-sm font-medium">Loading listing…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-stone-50 to-amber-50/40 py-10 px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-orange-100/40 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-amber-600 tracking-wide uppercase">
              Edit Listing
            </span>
          </div>
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">
            Update Listing
          </h1>
          <p className="text-stone-500 mt-1.5 text-sm">
            Make changes to your listing below
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left col */}
            <div className="lg:col-span-3 space-y-5">
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
                      placeholder="Describe your property…"
                      className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm rounded-xl px-4 py-3 resize-none
                                 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50
                                 focus:border-amber-400 hover:border-stone-300 transition-all duration-200"
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

              <Section
                step="2"
                title="Listing Type"
                description="Is this property for sale or rent?"
              >
                <TypeToggle value={formData.type} onChange={handleChange} />
              </Section>

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

              <Section
                step="4"
                title="Rooms & Pricing"
                description="Set capacity and price details"
              >
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 text-sm font-semibold text-stone-700">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        id="bedrooms"
                        min="1"
                        max="10"
                        required
                        onChange={handleChange}
                        value={formData.bedrooms}
                        className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm rounded-xl px-4 py-2.5
                                   focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                                   hover:border-stone-300 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-sm font-semibold text-stone-700">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        id="bathrooms"
                        min="1"
                        max="10"
                        required
                        onChange={handleChange}
                        value={formData.bathrooms}
                        className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm rounded-xl px-4 py-2.5
                                   focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                                   hover:border-stone-300 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 text-sm font-semibold text-stone-700">
                        Regular Price{" "}
                        {formData.type === "rent" && (
                          <span className="text-xs font-normal text-stone-400 ml-1">
                            ($ / month)
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
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
                          className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm rounded-xl pl-7 pr-4 py-2.5
                                     focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                                     hover:border-stone-300 transition-all duration-200"
                        />
                      </div>
                    </div>
                    {formData.offer && (
                      <div>
                        <label className="block mb-1.5 text-sm font-semibold text-stone-700">
                          Discounted Price{" "}
                          {formData.type === "rent" && (
                            <span className="text-xs font-normal text-stone-400 ml-1">
                              ($ / month)
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
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
                            className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm rounded-xl pl-7 pr-4 py-2.5
                                       focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                                       hover:border-stone-300 transition-all duration-200"
                          />
                        </div>
                      </div>
                    )}
                  </div>
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

            {/* Right col */}
            <div className="lg:col-span-2 space-y-5">
              <ImageUploadSection
                step="5"
                imageUrls={formData.imageUrls}
                files={files}
                setFiles={setFiles}
                uploading={uploading}
                uploadProgress={uploadProgress}
                imageUploadError={imageUploadError}
                setImageUploadError={setImageUploadError}
                handleImageSubmit={handleImageSubmit}
                handleRemoveImage={handleRemoveImage}
              />
              <SubmitPanel
                formData={formData}
                loading={loading}
                uploading={uploading}
                error={error}
                submitLabel="Save Changes"
                submitIcon={
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                }
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateListing;