/**
 * Utility function to fetch data with automatic retries
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<any>} - The parsed response
 */
export const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  let retries = 0;
  let lastError;

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error;
      retries++;
      console.log(`Attempt ${retries} failed. Retrying...`);
      
      if (retries === maxRetries) {
        break;
      }
      
      // Exponential backoff: wait longer between each retry
      await new Promise(resolve => 
        setTimeout(resolve, 1000 * Math.pow(2, retries - 1))
      );
    }
  }
  
  console.error(`Failed after ${maxRetries} retries:`, lastError);
  throw lastError;
};

/**
 * Utility function to check if a resource is available
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Whether the resource is available
 */
export const isResourceAvailable = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};