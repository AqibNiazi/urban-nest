import { toast } from "react-toastify";

export const notify = {
  success: (msg) =>
    toast.success(msg, { position: "top-right", autoClose: 3000 }),
  error: (msg) => toast.error(msg, { position: "top-right", autoClose: 3000 }),
  info: (msg) => toast.info(msg, { position: "top-right", autoClose: 3000 }),
};
