import { useEffect, useState } from "react";
import "./Marquee.css";

function Marquee() {
  const [marqueeItems, setMarqueeItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL || "/api";

  useEffect(() => {
    fetchMarquee();
  }, []);

  const fetchMarquee = async () => {
    try {
      const response = await fetch(`${API_URL}/marquee/active`);

      if (!response.ok) {
        throw new Error("Failed to fetch marquee data");
      }

      const result = await response.json();

      if (result.success) {
        setMarqueeItems(result.data || []);
      }
    } catch (error) {
      console.error("Marquee API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="marquee-section">
      <div className="marquee-container">

        {/* ================= HEADING ================= */}
        <div className="marquee-heading">
          <span>What's New...</span>
        </div>

        {/* ================= SCROLL AREA ================= */}
        <div className="marquee-scroll-area">
          <div className="marquee-track">

            {!loading &&
              marqueeItems.map((item) => (
                <h3
                  className="marquee-text"
                  key={item.id}
                >
                  {item.title}
                </h3>
              ))}

          </div>
        </div>

      </div>
    </section>
  );
}

export default Marquee;