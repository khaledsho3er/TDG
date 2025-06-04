import axios from "axios";

// Create axios instance with default headers
const paymobAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
let authToken = null;
let tokenExpiry = null;
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer before actual expiry

const paymobService = {
  // Get or refresh authentication token
  async getAuthToken() {
    try {
      // Check if we have a valid token
      if (
        authToken &&
        tokenExpiry &&
        Date.now() < tokenExpiry - TOKEN_EXPIRY_BUFFER
      ) {
        console.log("Using cached auth token");
        return authToken;
      }

      console.log("Getting new auth token");
      // Get Paymob configuration from backend
      const configResponse = await axios.get(
        "https://api.thedesigngrit.com/api/paymob/config"
      );
      const { apiKey } = configResponse.data;

      const response = await paymobAxios.post(
        "https://accept.paymob.com/api/auth/tokens",
        {
          api_key: apiKey,
        }
      );

      // Store the new token and set expiry (Paymob tokens typically last 1 hour)
      authToken = response.data.token;
      tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour from now

      return authToken;
    } catch (error) {
      console.error("Error getting auth token:", error);
      // Clear token on error
      authToken = null;
      tokenExpiry = null;
      throw error;
    }
  },

  // Initialize payment
  async initializePayment(paymentData) {
    try {
      console.log("Initializing payment with data:", paymentData);

      // Extract billing details from the payment data
      const { billingDetails, total, cartItems, shippingDetails } = paymentData;

      // Prepare the order data for the backend
      const orderData = {
        total_amount: total,
        billing_data: {
          apartment: billingDetails.apartment || "NA",
          email: billingDetails.email,
          floor: billingDetails.floor || "NA",
          first_name: billingDetails.first_name,
          street: billingDetails.street,
          building: billingDetails.building || "NA",
          phone_number: billingDetails.phone_number,
          shipping_method: shippingDetails?.method || "NA",
          postal_code: shippingDetails?.postalCode || "NA",
          city: billingDetails.city,
          country: billingDetails.country,
          last_name: billingDetails.last_name,
          state: billingDetails.state || "NA",
        },
        items: cartItems.map((item) => ({
          name: item.name,
          amount_cents: Math.round(item.price * 100), // Convert to cents and ensure it's an integer
          description: item.description || "",
          quantity: item.quantity,
        })),
      };

      // Log the exact data being sent
      console.log(
        "Sending order data to backend:",
        JSON.stringify(orderData, null, 2)
      );

      // Send the order data to your backend
      const response = await axios.post(
        `https://api.thedesigngrit.com/api/paymob/create-payment`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            // Add any required authentication headers here
          },
        }
      );

      console.log("Payment initialization response:", response.data);

      if (response.data.success) {
        return {
          iframeUrl: response.data.iframe_url,
          orderId: response.data.order_id,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to initialize payment"
        );
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      // Log the full error response if available
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to initialize payment"
      );
    }
  },

  // Create order
  async createOrder(authToken, amount) {
    try {
      const response = await paymobAxios.post(
        "https://accept.paymob.com/api/ecommerce/orders",
        {
          auth_token: authToken,
          delivery_needed: false,
          amount_cents: Math.round(amount * 100),
          currency: "EGP",
          items: [],
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Get payment key
  async getPaymentKey(authToken, orderId, billingData) {
    try {
      // Get Paymob configuration from backend
      const configResponse = await axios.get("/api/paymob/config");
      const { integrationId } = configResponse.data;

      const response = await paymobAxios.post(
        "https://accept.paymob.com/api/acceptance/payment_keys",
        {
          auth_token: authToken,
          amount_cents: Math.round(billingData.amount * 100),
          expiration: 3600,
          order_id: orderId,
          billing_data: {
            apartment: "NA",
            email: billingData.email,
            floor: "NA",
            first_name: billingData.first_name,
            street: billingData.street,
            building: billingData.building,
            phone_number: billingData.phone_number,
            shipping_method: "NA",
            postal_code: "NA",
            city: billingData.city,
            country: billingData.country,
            last_name: billingData.last_name,
            state: billingData.state,
          },
          currency: "EGP",
          integration_id: integrationId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting payment key:", error);
      throw error;
    }
  },

  // Clear cached token (useful for testing or when token becomes invalid)
  clearAuthToken() {
    authToken = null;
    tokenExpiry = null;
  },
};

export default paymobService;
