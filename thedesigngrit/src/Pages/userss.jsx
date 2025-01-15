import React, { useContext } from "react";
import { UserContext } from "../utils/userContext";

function UserProfile() {
  const { userSession } = useContext(UserContext);

  if (!userSession) {
    return <p>No user data available. Please log in.</p>;
  }

  return (
    <div>
      <h1>Welcome, {userSession.firstName}!</h1>
      <p>Email: {userSession.email}</p>
      {/* Display other user details */}
    </div>
  );
}

export default UserProfile;
