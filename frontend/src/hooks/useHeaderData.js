import { API_URL } from "../config/api";
import { useEffect, useState } from "react";

const useHeaderData = () => {
  const [settings, setSettings] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/header`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch header data"
          );
        }

        const result = await response.json();

        if (result.success) {
          setSettings(result.data?.settings || null);
          setMenuItems(
            result.data?.menuItems || []
          );
        }
      } catch (error) {
        console.error(
          "Header API Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderData();
  }, [API_URL]);

  return {
    settings,
    menuItems,
    loading,
  };
};

export default useHeaderData;