import axios from "axios";

// Create axios instance with default headers
const paymobAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

const paymobService = {
  // Initialize payment
  async initializePayment(orderData) {
    try {
      // First, get the Paymob configuration from your backend
      const configResponse = await axios.get("/api/paymob/config");
      const { token, integrationId } = configResponse.data;

      // Set the authorization header for this request
      paymobAxios.defaults.headers["Authorization"] = `Token ${token}`;

      // Step 1: Get authentication token
      const authToken = await this.getAuthToken();

      // Step 2: Create order
      const order = await this.createOrder(authToken, orderData.total);

      // Step 3: Get payment key
      const paymentKey = await this.getPaymentKey(authToken, order.id, {
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

  // Get authentication token
  async getAuthToken() {
    try {
      const response = await paymobAxios.post(
        "https://accept.paymob.com/api/auth/tokens",
        {
          api_key: process.env.PAYMOB_API_KEY,
        }
      );
      return response.data.token;
    } catch (error) {
      console.error("Error getting auth token:", error);
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
};

export default paymobService;
