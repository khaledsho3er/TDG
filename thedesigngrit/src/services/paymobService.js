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
      const response = await paymobAxios.post(
        "https://accept.paymob.com/api/auth/tokens",
        {
          api_key: process.env.PAYMOB_API_KEY,
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
  async initializePayment(orderData) {
    try {
      // First, get the Paymob configuration from your backend
      const configResponse = await axios.get("/api/paymob/config");
      const { integrationId } = configResponse.data;

      // Get authentication token (will use cached token if available)
      const token = await this.getAuthToken();

      // Set the authorization header for this request
      paymobAxios.defaults.headers["Authorization"] = `Token ${token}`;

      // Step 1: Create order
      const order = await this.createOrder(token, orderData.total);

      // Step 2: Get payment key
      const paymentKey = await this.getPaymentKey(token, order.id, {
        amount: orderData.total,
        ...orderData.billingDetails,
      });

      // Create Paymob iframe URL
      const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${integrationId}?payment_token=${paymentKey.token}`;

      return {
        paymentKey: paymentKey.token,
        orderId: order.id,
        iframeUrl: iframeUrl,
      };
    } catch (error) {
      console.error("Error initializing payment:", error);
      throw error;
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
          integration_id: process.env.PAYMOB_INTEGRATION_ID,
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
