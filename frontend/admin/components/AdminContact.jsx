import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  CalendarDays,
  X,
  MessageSquareText,
  Loader2,
  CheckCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] =
    useState(null);

  // =====================================================
  // FETCH MESSAGES
  // =====================================================

  const fetchMessages = async () => {
    try {
      setRefreshing(true);

      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/contact`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch messages"
        );
      }

      setMessages(data.messages || []);
    } catch (error) {
      console.error(
        "Fetch messages error:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // =====================================================
  // DELETE MESSAGE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/contact/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Delete failed"
        );
      }

      setMessages((prev) =>
        prev.filter((item) => item.id !== id)
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error.message ||
          "Unable to delete message"
      );
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredMessages = messages.filter(
    (item) => {
      const keyword =
        search.toLowerCase().trim();

      if (!keyword) return true;

      return (
        item.name
          ?.toLowerCase()
          .includes(keyword) ||
        item.email
          ?.toLowerCase()
          .includes(keyword) ||
        item.phone
          ?.toLowerCase()
          .includes(keyword) ||
        item.subject
          ?.toLowerCase()
          .includes(keyword) ||
        item.message
          ?.toLowerCase()
          .includes(keyword)
      );
    }
  );

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">

        <div className="text-center">

          <Loader2
            size={35}
            className="
              mx-auto
              animate-spin
              text-[#2d2588]
            "
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading messages...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* =================================================
          HEADER
      ================================================== */}

      <div
        className="
          mb-7
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <div className="flex items-center gap-2">

            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-[#2d2588]
                text-white
              "
            >
              <MessageSquareText size={18} />
            </span>

            <h1
              className="
                text-[26px]
                font-bold
                text-[#111827]
              "
            >
              Contact Messages
            </h1>

          </div>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Manage messages received from
            the school website.
          </p>

        </div>

        {/* REFRESH */}

        <button
          type="button"
          onClick={fetchMessages}
          disabled={refreshing}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            text-sm
            font-semibold
            text-gray-700
            shadow-sm
            transition
            hover:border-[#2d2588]
            hover:text-[#2d2588]
            disabled:opacity-50
          "
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* =================================================
          STATS
      ================================================== */}

      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-[0_5px_20px_rgba(15,23,42,0.04)]
          "
        >

          <p className="text-sm text-gray-500">
            Total Messages
          </p>

          <h2
            className="
              mt-2
              text-3xl
              font-bold
              text-[#111827]
            "
          >
            {messages.length}
          </h2>

        </div>

        <div
          className="
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-[0_5px_20px_rgba(15,23,42,0.04)]
          "
        >

          <p className="text-sm text-gray-500">
            Search Results
          </p>

          <h2
            className="
              mt-2
              text-3xl
              font-bold
              text-[#2d2588]
            "
          >
            {filteredMessages.length}
          </h2>

        </div>

        <div
          className="
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-[0_5px_20px_rgba(15,23,42,0.04)]
          "
        >

          <p className="text-sm text-gray-500">
            Status
          </p>

          <div className="mt-2 flex items-center gap-2">

            <CheckCircle
              size={19}
              className="text-emerald-500"
            />

            <span className="font-semibold text-emerald-600">
              System Active
            </span>

          </div>

        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================== */}

      <div
        className="
          mb-5
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-4
          shadow-[0_5px_20px_rgba(15,23,42,0.04)]
        "
      >

        <div className="relative">

          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="
              Search by name, email, phone or subject...
            "
            className="
              h-12
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              pl-11
              pr-4
              text-sm
              text-gray-800
              outline-none
              transition
              focus:border-[#2d2588]
              focus:bg-white
              focus:ring-2
              focus:ring-[#2d2588]/10
            "
          />

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-gray-100
          bg-white
          shadow-[0_5px_25px_rgba(15,23,42,0.05)]
        "
      >

        {/* DESKTOP TABLE */}

        <div className="hidden overflow-x-auto lg:block">

          <table className="w-full">

            <thead>

              <tr
                className="
                  border-b
                  border-gray-100
                  bg-gray-50
                "
              >

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Name
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Contact
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Subject
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredMessages.length === 0 ? (
                <tr>

                  <td
                    colSpan="5"
                    className="
                      px-5
                      py-16
                      text-center
                    "
                  >

                    <MessageSquareText
                      size={40}
                      className="
                        mx-auto
                        text-gray-300
                      "
                    />

                    <p
                      className="
                        mt-3
                        font-semibold
                        text-gray-500
                      "
                    >
                      No messages found
                    </p>

                  </td>

                </tr>
              ) : (
                filteredMessages.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="
                        border-b
                        border-gray-100
                        transition
                        hover:bg-[#faf9ff]
                      "
                    >

                      {/* NAME */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#eeeafd]
                              text-sm
                              font-bold
                              text-[#2d2588]
                            "
                          >
                            {item.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>

                            <p className="font-semibold text-gray-800">
                              {item.name}
                            </p>

                            <p className="mt-0.5 max-w-[180px] truncate text-xs text-gray-400">
                              {item.message}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CONTACT */}

                      <td className="px-5 py-4">

                        <p className="text-sm text-gray-700">
                          {item.email}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {item.phone}
                        </p>

                      </td>

                      {/* SUBJECT */}

                      <td className="px-5 py-4">

                        <span
                          className="
                            inline-flex
                            max-w-[220px]
                            truncate
                            rounded-lg
                            bg-[#f4f2ff]
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-[#2d2588]
                          "
                        >
                          {item.subject}
                        </span>

                      </td>

                      {/* DATE */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-500">

                          <CalendarDays
                            size={15}
                          />

                          {formatDate(
                            item.created_at
                          )}

                        </div>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedMessage(
                                item
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-[#f3f1ff]
                              text-[#2d2588]
                              transition
                              hover:bg-[#2d2588]
                              hover:text-white
                            "
                            title="View"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-red-50
                              text-red-500
                              transition
                              hover:bg-red-500
                              hover:text-white
                            "
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

        {/* MOBILE CARDS */}

        <div className="space-y-3 p-3 lg:hidden">

          {filteredMessages.length === 0 ? (
            <div className="py-12 text-center">

              <MessageSquareText
                size={38}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm text-gray-500">
                No messages found
              </p>

            </div>
          ) : (
            filteredMessages.map(
              (item) => (
                <div
                  key={item.id}
                  className="
                    rounded-xl
                    border
                    border-gray-100
                    bg-gray-50
                    p-4
                  "
                >

                  <div className="flex items-start gap-3">

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#eeeafd]
                        font-bold
                        text-[#2d2588]
                      "
                    >
                      {item.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {item.email}
                      </p>

                    </div>

                    <span className="text-xs text-gray-400">
                      {formatDate(
                        item.created_at
                      )}
                    </span>

                  </div>

                  <div className="mt-3">

                    <p className="text-sm font-semibold text-[#2d2588]">
                      {item.subject}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {item.message}
                    </p>

                  </div>

                  <div className="mt-4 flex gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedMessage(item)
                      }
                      className="
                        flex
                        h-9
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-[#2d2588]
                        text-xs
                        font-semibold
                        text-white
                      "
                    >
                      <Eye size={15} />
                      View Message
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      className="
                        flex
                        h-9
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-red-50
                        text-red-500
                      "
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>
              )
            )
          )}

        </div>

      </div>

      {/* =================================================
          MESSAGE MODAL
      ================================================== */}

      {selectedMessage && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
          onClick={() =>
            setSelectedMessage(null)
          }
        >

          <div
            className="
              max-h-[90vh]
              w-full
              max-w-[650px]
              overflow-y-auto
              rounded-2xl
              bg-white
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-100
                px-6
                py-5
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#2d2588]
                    text-white
                  "
                >
                  <MessageSquareText
                    size={19}
                  />
                </div>

                <div>

                  <h2 className="font-bold text-gray-900">
                    Contact Message
                  </h2>

                  <p className="text-xs text-gray-400">
                    {formatDate(
                      selectedMessage.created_at
                    )}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-gray-100
                  text-gray-500
                  transition
                  hover:bg-red-50
                  hover:text-red-500
                "
              >
                <X size={18} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="space-y-5 p-6">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Name
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {selectedMessage.name}
                </p>

              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Email
                  </p>

                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="
                      mt-1
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-[#2d2588]
                    "
                  >
                    <Mail size={15} />
                    {selectedMessage.email}
                  </a>

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Phone
                  </p>

                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="
                      mt-1
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-[#2d2588]
                    "
                  >
                    <Phone size={15} />
                    {selectedMessage.phone}
                  </a>

                </div>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Subject
                </p>

                <p
                  className="
                    mt-2
                    rounded-lg
                    bg-[#f5f3ff]
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-[#2d2588]
                  "
                >
                  {selectedMessage.subject}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Message
                </p>

                <div
                  className="
                    mt-2
                    rounded-xl
                    border
                    border-gray-100
                    bg-gray-50
                    p-4
                    text-sm
                    leading-7
                    text-gray-600
                  "
                >
                  {selectedMessage.message}
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminContact;
