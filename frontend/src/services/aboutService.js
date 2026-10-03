import { API_URL } from "../config/api";





// ==========================================
// GET ABOUT
// ==========================================

export const getAbout = async () => {
  const response = await fetch(`${API_URL}/about`);

  if (!response.ok) {
    throw new Error("Failed to fetch About");
  }

  return response.json();
};


// ==========================================
// GET ABOUT ADMIN
// ==========================================

export const getAdminAbout = async () => {
  const response = await fetch(`${API_URL}/about/admin`);

  if (!response.ok) {
    throw new Error("Failed to fetch About");
  }

  return response.json();
};


// ==========================================
// UPDATE ABOUT
// ==========================================

export const updateAbout = async (id, data) => {
  const response = await fetch(`${API_URL}/about/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update About");
  }

  return response.json();
};