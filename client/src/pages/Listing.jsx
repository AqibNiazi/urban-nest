import React, { useEffect, useState } from "react";
import { notify } from "@/util/notify";
import { clientBaseURL, clientEndPoints } from "@/config";
import { useNavigate, useParams } from "react-router-dom";
import { Hourglass } from "react-loader-spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
const Listing = () => {
  SwiperCore.use([Navigation]);
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const response = await clientBaseURL.get(
          `${clientEndPoints.getListing}/${listingId}`,
        );

        if (response.data.success) {
          notify.success(response.data.message);
          setListing(response.data.data);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(error.response.data.message);
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);
  console.log("Listing Data", listing);

  return (
    <main>
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <Hourglass
            visible={true}
            height="80"
            width="80"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass="flex item-center justify-center"
            colors={["#306cce", "#72a1ed"]}
          />
        </div>
      )}

      {error && (
        <div className="flex flex-col justify-center items-center min-h-screen mx-auto">
          <p className="text-red-500 text-2xl mb-4">{error}</p>
          <button
            type="button"
            className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      )}

      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </main>
  );
};

export default Listing;
