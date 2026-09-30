import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AlumniYear = () => {
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
  }, [slug]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        `/alumni/year/${slug}`
      );

      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center">
        Alumni data not found
      </div>
    );
  }

  return (
    <section
      className="
        w-full
        bg-white
        py-[70px]
        sm:py-[80px]
        md:py-[90px]
        lg:py-[110px]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1320px]
          px-4
          sm:px-5
          lg:px-6
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-[40px]
            lg:grid-cols-[minmax(300px,1fr)_minmax(0,2fr)]
            lg:gap-[50px]
            xl:grid-cols-[350px_minmax(0,1fr)]
          "
        >
          {/* Sidebar */}

          <AlumniSidebar />

          {/* Content */}

          <div className="w-full min-w-0">
            <div className="mb-[30px] sm:mb-[40px]">
              <h2
                className="
                  m-0
                  pl-[10px]
                  font-['Figtree',sans-serif]
                  text-[30px]
                  font-semibold
                  leading-[40px]
                  text-[#050734]
                  sm:text-[38px]
                  md:text-[45px]
                  lg:pl-[25px]
                  lg:text-[52px]
                  lg:leading-[62px]
                "
              >
                Alumni {data.year.year_name}
              </h2>

              <div
                className="
                  ml-[10px]
                  mt-[12px]
                  h-[4px]
                  w-[60px]
                  rounded-full
                  bg-[#e71b93]
                  lg:ml-[25px]
                "
              />
            </div>

            {/* Table */}

            <div
              className="
                w-full
                overflow-x-auto
                rounded-[15px]
                bg-[#f5f5f6]
                shadow-sm
              "
            >
              <table
                className="
                  w-full
                  min-w-[650px]
                  border-collapse
                  font-['Figtree',sans-serif]
                "
              >
                <thead>
                  <tr className="bg-[#e71b93] text-white">
                    <th className="px-5 py-4 text-left">
                      Name of the Student
                    </th>

                    <th className="px-5 py-4 text-left">
                      Course / Designation
                    </th>

                    <th className="px-5 py-4 text-left">
                      Contact Number
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.students.map((student) => (
                    <tr
                      key={student.id}
                      className="
                        border-b
                        border-gray-200
                        bg-white
                        transition
                        hover:bg-pink-50
                      "
                    >
                      <td
                        className="
                          px-5
                          py-5
                          font-semibold
                          text-[#050734]
                        "
                      >
                        {student.name}
                      </td>

                      <td
                        className="
                          px-5
                          py-5
                          text-gray-600
                        "
                      >
                        {student.course}
                      </td>

                      <td
                        className="
                          px-5
                          py-5
                          text-gray-600
                        "
                      >
                        {student.contact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Gallery */}

            {data.gallery?.length > 0 && (
              <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {data.gallery.map((item) => (
                  <img
                    key={item.id}
                    src={`${import.meta.env.VITE_IMAGE_URL || ""}${item.image}`}
                    alt={item.alt_text}
                    className="
                      aspect-[3/2]
                      w-full
                      rounded-[15px]
                      object-cover
                    "
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlumniYear;
