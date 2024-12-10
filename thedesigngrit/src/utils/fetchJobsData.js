export const fetchJobsData = async () => {
  try {
    const response = await fetch("/json/jobs.json"); // Path relative to `public` folder
    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return []; // Return an empty array in case of an error
  }
};
export const fetchJobDescriptionData = async () => {
  try {
    const response = await fetch("/json/jobDesc.json"); // Path relative to `public` folder
    if (!response.ok) {
      throw new Error("Failed to fetch job description data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching job description data:", error);
    return {}; // Return empty object in case of error
  }
};
