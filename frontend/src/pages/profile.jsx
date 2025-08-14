import { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState();
  const { username } = useParams();

  useEffect(() => {
    async function getProfile() {
      console.log("Fetching profile for:", username);
      const res = await axios.get(`http://localhost:3000/profile/${username}`);
      setUser(res.data);
    }
    getProfile();
  }, [username]);

  if (!user) {
    return <p className="text-white p-4">Loading profile...</p>;
  }

  function convertToMonth(d) {
    d = d.slice(0, 9);
    const dateObj = new Date(d); // create a Date object from the string
    const options = { month: "long", year: "numeric" };
    return dateObj.toLocaleDateString("en-US", options);
  }

  return (
    <Fragment>
      <Header></Header>
      <div className=" text-white">
        <div className="flex justify-between items-center bg-black text-white border-b border-gray-700 p-5 h-60">
          {/* Left side: Profile Pic + Username + Details */}
          <div className="flex items-center">
            <img
              src="https://i.scdn.co/image/ab67616d00001e02cc392813bfd8f63d4d5f4a95"
              alt="Profile"
              className="w-50 h-50 rounded-full object-cover"
            />
            <div className="ml-6 flex flex-col justify-center gap-2">
              <h1 className="font-extrabold text-3xl">{user.username}</h1>
              <p>Joined: {convertToMonth(user.createdAt)}</p>
              <div className="text-gray-300 text-sm"></div>
            </div>
          </div>

          {/* Right side: Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Top Reviewer
            </span>
            <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Verified
            </span>
            <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Early Adopter
            </span>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="mt-8 p-5">
          <h2 className="text-2xl font-semibold mb-4">Favorite Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"></div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10 p-5">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        </div>
      </div>
    </Fragment>
  );
}
