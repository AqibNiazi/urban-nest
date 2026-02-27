// ── Shared storeImage util ───────────────────────────────────────────────────
export const storeImage = async (file) => {
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
