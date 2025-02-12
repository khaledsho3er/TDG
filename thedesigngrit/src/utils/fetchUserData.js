useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await fetch("https://tdg-db.onrender.com/api/getUser", {
        credentials: "include", // Send cookies with the request
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // Update userContext or state
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  fetchUserData();
}, []);
