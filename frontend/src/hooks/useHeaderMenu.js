import { API_URL } from "../config/api";
import { useEffect, useState } from "react";

const useHeaderMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          `${API_URL}/header-menu/active`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch header menu"
          );
        }

        const result = await response.json();

        if (result.success) {
          setMenuItems(result.data || []);
        }
      } catch (error) {
        console.error(
          "Header Menu API Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [API_URL]);

  return {
    menuItems,
    loading,
  };
};

export default useHeaderMenu;