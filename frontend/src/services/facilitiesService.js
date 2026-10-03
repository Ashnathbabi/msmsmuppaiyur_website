import { API_URL } from "../config/api";


// ===============================
// GET ACTIVE FACILITIES
// ===============================
export const getFacilities = async () => {
  const response = await fetch(`${API_URL}/facilities`);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("getFacilities API Error:", data);
    throw new Error(data.message || "Failed to fetch facilities");
  }

  return data;
};

// ===============================
// GET ALL FACILITIES - ADMIN
// ===============================
export const getAllFacilities = async () => {
  const url = `${API_URL}/facilities/admin/all`;

  console.log("Fetching:", url);

  const response = await fetch(url);

  const data = await response.json().catch(() => ({}));

  console.log("Facility API Response:", response.status, data);

  if (!response.ok) {
    throw new Error(
      data.message || `Failed to fetch facilities (${response.status})`
    );
  }

  return data;
};

// ===============================
// GET FACILITY BY SLUG
// ===============================
export const getFacilityBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/facilities/${slug}`);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch facility");
  }

  return data;
};

// ===============================
// CREATE FACILITY
// ===============================
export const createFacility = async (formData) => {
  const response = await fetch(`${API_URL}/facilities`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to create facility");
  }

  return data;
};

// ===============================
// UPDATE FACILITY
// ===============================
export const updateFacility = async (id, formData) => {
    const response = await fetch(
        `${API_URL}/facilities/${id}`,
        {
            method: "PUT",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to update facility"
        );
    }

    return data;
};

// ===============================
// DELETE FACILITY
// ===============================
export const deleteFacility = async (id) => {
  const response = await fetch(`${API_URL}/facilities/${id}`, {
    method: "DELETE",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete facility");
  }

  return data;
};

// ===============================
// ADD RULE
// ===============================
export const addFacilityRule = async (facilityId, ruleData) => {
  const response = await fetch(
    `${API_URL}/facilities/${facilityId}/rules`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ruleData),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to add rule");
  }

  return data;
};

// ===============================
// UPDATE RULE
// ===============================
export const updateFacilityRule = async (ruleId, ruleData) => {
  const response = await fetch(
    `${API_URL}/facilities/rules/${ruleId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ruleData),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to update rule");
  }

  return data;
};

// ===============================
// DELETE RULE
// ===============================
export const deleteFacilityRule = async (ruleId) => {
  const response = await fetch(
    `${API_URL}/facilities/rules/${ruleId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete rule");
  }

  return data;
};