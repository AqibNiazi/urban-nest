import React from "react";
import { FaHandshake, FaLightbulb, FaHeadset } from "react-icons/fa";
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-700 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">UrbanNest</h1>
          <p className="text-lg text-slate-200">
            Helping you find the perfect place to call home.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-slate-800">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed">
              UrbanNest is a modern real estate platform designed to make
              buying, selling, and renting properties simple, fast, and
              reliable. We believe finding a home should be an exciting journey,
              not a stressful one.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you are searching for a cozy apartment, a family house, or
              an investment opportunity, UrbanNest connects you with the best
              listings tailored to your needs.
            </p>
          </div>

          {/* Image */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
              alt="Real estate"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16 px-6 border-t">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-slate-800 mb-6">
            Our Mission
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our mission is to provide a transparent, user-friendly, and
            trustworthy real estate experience. We aim to empower users with
            accurate information, powerful search tools, and a smooth browsing
            experience so they can make confident property decisions.
          </p>
        </div>
      </div>

      {/* Values Section */}
      {/* Values Section */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Trust */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-100 p-4 rounded-full">
                <FaHandshake className="text-slate-700 text-3xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Trust</h3>
            <p className="text-gray-600 text-sm">
              Verified listings and transparent information you can rely on.
            </p>
          </div>

          {/* Simplicity */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-100 p-4 rounded-full">
                <FaLightbulb className="text-slate-700 text-3xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Simplicity
            </h3>
            <p className="text-gray-600 text-sm">
              Clean design and smart search to find properties effortlessly.
            </p>
          </div>

          {/* Support */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-100 p-4 rounded-full">
                <FaHeadset className="text-slate-700 text-3xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Support
            </h3>
            <p className="text-gray-600 text-sm">
              Helping you at every step of your real estate journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
