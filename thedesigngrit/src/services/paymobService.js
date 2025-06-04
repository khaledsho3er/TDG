import axios from "axios";

// Axios instance for Paymob requests
const paymobAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Token cache and expiry logic
let authToken = null;
let tokenExpiry = null;
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer

const paymobService = {
  /** ------------------------------
   * Get or refresh Paymob auth token
   * ------------------------------ */
  async getAuthToken() {
    try {
      const isTokenValid =
        authToken &&
        tokenExpiry &&
        Date.now() < tokenExpiry - TOKEN_EXPIRY_BUFFER;

      if (isTokenValid) {
        console.log("✅ Using cached Paymob token");
        return authToken;
      }

      console.log("🔄 Fetching new Paymob token...");

      const { data: config } = await axios.get(
        "https://api.thedesigngrit.com/api/paymob/config"
      );

      const response = await paymobAxios.post(
        "https://accept.paymob.com/api/auth/tokens",
        {
          api_key: config.apiKey,
        }
      );

      authToken = response.data.token;
      tokenExpiry = Date.now() + 60 * 60 * 1000; // Valid for 1 hour

      return authToken;
    } catch (error) {
      console.error("❌ Failed to get Paymob auth token:", error);
      authToken = null;
      tokenExpiry = null;
      throw error;
    }
  },

  /** ------------------------------
   * Initialize payment via backend
   * ------------------------------ */
  async initializePayment(paymentData) {
    try {
      const { billingDetails, total, cartItems, shippingDetails } = paymentData;

      const orderData = {
        orderData: {
          total,
          billingDetails: {
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
            amount_cents: Math.round(item.totalPrice * 100),
            description: item.description || "",
            quantity: item.quantity,
          })),
        },
      };

      console.log(
        "📦 Sending order data to backend:",
        JSON.stringify(orderData, null, 2)
      );

      const response = await paymobAxios.post(
        "https://api.thedesigngrit.com/api/paymob/create-payment",
        orderData
      );

      if (response.data.success) {
        return {
          iframeUrl: response.data.iframe_url,
          orderId: response.data.order_id,
        };
      }

      throw new Error(response.data.message || "Failed to initialize payment");
    } catch (error) {
      console.error("❌ Error during payment initialization:", error);

      if (error.response) {
        console.error("🔍 Response Data:", error.response.data);
        console.error("🔍 Status:", error.response.status);
        console.error("🔍 Headers:", error.response.headers);
      }

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Payment initialization failed"
      );
    }
  },

  /** ------------------------------
   * Create Paymob Order
   * ------------------------------ */
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
      console.error("❌ Failed to create order:", error);
      throw error;
    }
  },

  /** ------------------------------
   * Get Payment Key
   * ------------------------------ */
  async getPaymentKey(authToken, orderId, billingData) {
    try {
      const { data: config } = await axios.get("/api/paymob/config");

      const response = await paymobAxios.post(
        "https://accept.paymob.com/api/acceptance/payment_keys",
        {
          auth_token: authToken,
          amount_cents: Math.round(billingData.amount * 100),
          expiration: 3600,
          order_id: orderId,
          billing_data: {
            apartment: billingData.apartment || "NA",
            email: billingData.email,
            floor: billingData.floor || "NA",
            first_name: billingData.first_name,
            street: billingData.street || "NA",
            building: billingData.building || "NA",
            phone_number: billingData.phone_number,
            shipping_method: "NA",
            postal_code: "NA",
            city: billingData.city,
            country: billingData.country,
            last_name: billingData.last_name,
            state: billingData.state || "NA",
          },
          currency: "EGP",
          integration_id: config.integrationId,
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Failed to get payment key:", error);
      throw error;
    }
  },

  /** ------------------------------
   * Clear cached token
   * ------------------------------ */
  clearAuthToken() {
    authToken = null;
    tokenExpiry = null;
    console.log("🧹 Auth token cleared");
  },
};

export default paymobService;
