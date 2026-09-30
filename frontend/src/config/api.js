// Central API config.
//
// Defaults are same-origin ("") so the app works on localhost AND through
// a single ngrok URL via the Vite dev-server proxy (/api and /uploads are
// proxied to the backend — see vite.config.js).
//
// Only set VITE_API_URL / VITE_IMAGE_URL if the backend is exposed on its
// own separate public URL. They may be a server root ("https://xyz.ngrok.io")
// or already include "/api" — both are handled.

const RAW_ROOT = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const SERVER_ROOT = RAW_ROOT.replace(/\/api$/, "");

const API_BASE_URL = SERVER_ROOT ? `${SERVER_ROOT}/api` : "/api";

const IMAGE_ROOT = (import.meta.env.VITE_IMAGE_URL || SERVER_ROOT).replace(/\/+$/, "");

export const SERVER_URL = IMAGE_ROOT;

export const API_URL = API_BASE_URL;

export const getImageUrl = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image) || /^data:image\//i.test(image)) return image;
  return `${IMAGE_ROOT}${image.startsWith("/") ? image : `/${image}`}`;
};

export default SERVER_ROOT;
