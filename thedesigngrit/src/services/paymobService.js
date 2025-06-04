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
  async initializePayment(orderData) {
    try {
      // Send order data to backend for processing
      const response = await axios.post(
        "https://api.thedesigngrit.com/api/paymob/create-payment",
        {
          orderData: {
            total: orderData.total,
            billingDetails: {
              first_name: orderData.billingDetails.first_name,
              last_name: orderData.billingDetails.last_name,
              email: orderData.billingDetails.email,
              street: orderData.billingDetails.street,
              building: orderData.billingDetails.building,
              phone_number: orderData.billingDetails.phone_number,
              city: orderData.billingDetails.city,
              country: orderData.billingDetails.country,
              state: orderData.billingDetails.state,
              floor: orderData.billingDetails.floor,
              apartment: orderData.billingDetails.apartment,
            },
          },
        }
      );

      return {
        paymentKey: response.data.paymentKey,
        orderId: response.data.orderId,
        iframeUrl: response.data.iframeUrl,
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
