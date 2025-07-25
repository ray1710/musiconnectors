import { useUserContext } from "../context/userContext";

export default function Profile() {
  const { user } = useUserContext();

  if (!user) {
    return <p className="text-white p-4">Loading profile...</p>;
  }

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      {/* etc... */}
    </div>
  );
}
