import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListingItem } from "@/components";
import { clientBaseURL, clientEndPoints } from "@/config";
import { useLocation } from "react-router-dom";
export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  // ✅ Sync URL → Sidebar State + Fetch Listings
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTerm = urlParams.get("searchTerm") || "";
    const type = urlParams.get("type") || "all";
    const parking = urlParams.get("parking") === "true";
    const furnished = urlParams.get("furnished") === "true";
    const offer = urlParams.get("offer") === "true";
    const sort = urlParams.get("sort") || "createdAt";
    const order = urlParams.get("order") || "desc";

    setSidebardata({
      searchTerm,
      type,
      parking,
      furnished,
      offer,
      sort,
      order,
    });

    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);

        const response = await clientBaseURL(
          `${clientEndPoints.getListings}?${urlParams.toString()}`,
        );
        console.log("res in search", response);

        const data = response?.data?.data || [];

        setListings(data);
        setShowMore(data.length > 8);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  // ✅ Handle Form Changes
  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "searchTerm") {
      setSidebardata((prev) => ({
        ...prev,
        searchTerm: value,
      }));
    }

    if (["all", "rent", "sale"].includes(id)) {
      setSidebardata((prev) => ({
        ...prev,
        type: id,
      }));
    }

    if (["parking", "furnished", "offer"].includes(id)) {
      setSidebardata((prev) => ({
        ...prev,
        [id]: checked,
      }));
    }

    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata((prev) => ({
        ...prev,
        sort,
        order,
      }));
    }
  };

  // ✅ Submit → Update URL
  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();

    if (sidebardata.searchTerm)
      urlParams.set("searchTerm", sidebardata.searchTerm);

    if (sidebardata.type !== "all") urlParams.set("type", sidebardata.type);

    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    navigate(`/search?${urlParams.toString()}`, { replace: true });
  };

  // ✅ Pagination
  const onShowMoreClick = async () => {
    try {
      const startIndex = listings.length;

      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);

      const response = await clientBaseURL(
        `${clientEndPoints.getListings}?${urlParams.toString()}`,
      );

      const data = response?.data?.data || [];

      setListings((prev) => [...prev, ...data]);

      if (data.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.error("Error loading more listings:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-b-2 border-gray-300 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to hight</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b border-gray-300 p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings?.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
