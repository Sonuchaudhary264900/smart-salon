import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const Home = () => {

  const [salons, setSalons] = useState([]);
  const [trendingSalons, setTrendingSalons] = useState([]);



  // ===============================
  // FETCH ALL SALONS
  // ===============================
  const fetchSalons = async () => {

    try {

      const res = await API.get("/salons/nearby");

      setSalons(res.data);

    } catch (error) {

      console.log("Error loading salons");

    }

  };



  // ===============================
  // FETCH TRENDING SALONS
  // ===============================
  const fetchTrending = async () => {

    try {

      const res = await API.get("/salons/trending");

      setTrendingSalons(res.data);

    } catch (error) {

      console.log("Error loading trending salons");

    }

  };



  // ===============================
  // PAGE LOAD
  // ===============================
  useEffect(() => {

    fetchSalons();
    fetchTrending();

  }, []);




  return (

    <div className="p-6 max-w-6xl mx-auto">


      {/* TRENDING SALONS */}

      <h1 className="text-2xl font-semibold mb-4">
        🔥 Trending Salons
      </h1>

      {trendingSalons.length === 0 && (
        <p className="mb-6 text-gray-500">
          No trending salons yet
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-10">

        {trendingSalons.map((salon) => (

          <Link key={salon._id} to={`/salon/${salon._id}`}>

            <div className="bg-white p-5 rounded shadow border-l-4 border-orange-500 hover:shadow-lg transition">

              <h2 className="text-xl font-semibold">
                {salon.name}
              </h2>

              <p className="text-gray-600 mb-2">
                {salon.address}
              </p>

              <p className="text-yellow-500 font-semibold">
                ⭐ {salon.averageRating?.toFixed(1) || "0"} 
                {" "}
                ({salon.totalReviews || 0} reviews)
              </p>

            </div>

          </Link>

        ))}

      </div>




      {/* NEARBY SALONS */}

      <h1 className="text-3xl font-semibold mb-6">
        Nearby Salons
      </h1>

      {salons.length === 0 && (
        <p>No salons available</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {salons.map((salon) => (

          <Link key={salon._id} to={`/salon/${salon._id}`}>

            <div className="bg-white p-5 rounded shadow hover:shadow-lg transition">

              <h2 className="text-xl font-semibold mb-1">
                {salon.name}
              </h2>

              <p className="text-gray-600 mb-2">
                {salon.address}
              </p>



              <div className="flex items-center gap-2">

                <span className="text-yellow-500 font-semibold">
                  ⭐ {salon.averageRating?.toFixed(1) || "0"}
                </span>

                <span className="text-gray-500 text-sm">
                  ({salon.totalReviews || 0} reviews)
                </span>



                {/* TOP RATED BADGE */}

                {salon.averageRating >= 4.5 && (

                  <span className="ml-auto text-xs bg-yellow-400 text-black px-2 py-1 rounded">

                    🏆 Top Rated

                  </span>

                )}

              </div>

            </div>

          </Link>

        ))}

      </div>


    </div>

  );

};

export default Home;