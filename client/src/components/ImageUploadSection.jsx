// ── Image upload section ─────────────────────────────────────────────────────
import { Section } from "@/components";
const ImageUploadSection = ({
  step,
  imageUrls,
  files,
  setFiles,
  uploading,
  uploadProgress,
  imageUploadError,
  setImageUploadError,
  handleImageSubmit,
  handleRemoveImage,
}) => {
  const totalImages = imageUrls.length;
  const canUploadMore = totalImages < 6;

  return (
    <Section
      step={step}
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

        {/* Progress bar */}
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
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-1">
            {imageUrls.map((url, index) => (
              <div
                key={url}
                className="relative group rounded-xl overflow-hidden aspect-video border border-stone-200"
              >
                <img
                  src={url}
                  alt={`listing ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === 0 && (
                  <span className="absolute top-1.5 left-1.5 text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-md font-semibold">
                    Cover
                  </span>
                )}
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
  );
};

export default ImageUploadSection;
