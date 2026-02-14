import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clientBaseURL, clientEndPoints } from "@/config";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { ListingItem } from "@/components";
const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await clientBaseURL(
          `${clientEndPoints.getListings}?offer=true&limit=4`,
        );

        const data = response?.data?.data;
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      const response = await clientBaseURL(
        `${clientEndPoints.getListings}?type=rent&limit=4`,
      );
      const data = response?.data?.data;
      setRentListings(data);
      fetchSaleListings();
    };
    const fetchSaleListings = async () => {
      const response = await clientBaseURL(
        `${clientEndPoints.getListings}?type=sale&limit=4`,
      );
      const data = response?.data?.data;
      setSaleListings(data);
    };

    fetchOfferListings();
  }, []);



  return (
    <div>
      {/*Top*/}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span> <br />{" "}
          place with ease
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Urban Nest will help you find your home fast, easy and comfortable.
          <br />
          Our expert support are always available.
        </p>

        <Link
          className="text-xs sm:text-sm text-blue-800 hover:underline font-semibold"
          to="/search"
        >
          Let's get Started...
        </Link>
      </div>

      {/*Swiper*/}
      <Swiper navigation>
        {offerListings?.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${
                    listing?.imageUrls?.[0] ||
                    "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg"
                  }) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-125"
              />
            </SwiperSlide>
          ))}
      </Swiper>

      {/*Listing Results for offer, sale and rent*/}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
