import axios from "axios";

// Create axios instance with default headers
const paymobAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

const paymobService = {
  // Create payment intention
  async createPaymentIntention(orderData) {
    try {
      // First, get the Paymob configuration from your backend
      const configResponse = await axios.get("/api/paymob/config");
      const { token, integrationId } = configResponse.data;

      // Set the authorization header for this request
      paymobAxios.defaults.headers["Authorization"] = `Token ${token}`;

      const response = await paymobAxios.post(
        "https://accept.paymob.com/v1/intention/",
        {
          amount: Math.round(orderData.total * 100), // Convert to cents
          currency: "EGP",
          payment_methods: [integrationId, "card"],
          items: orderData.cartItems.map((item) => ({
            name: item.name,
            amount: Math.round(item.totalPrice * 100),
            description: item.name,
            quantity: item.quantity,
          })),
          billing_data: {
            apartment: "NA",
            first_name: orderData.billingDetails.firstName,
            last_name: orderData.billingDetails.lastName,
            street: orderData.billingDetails.address,
            building: "NA",
            phone_number: orderData.billingDetails.phoneNumber,
            country: orderData.billingDetails.country,
            email: orderData.billingDetails.email,
            floor: "NA",
            state: "NA",
          },
          customer: {
            first_name: orderData.billingDetails.firstName,
            last_name: orderData.billingDetails.lastName,
            email: orderData.billingDetails.email,
            extras: {
              order_id: orderData.parentOrderId,
            },
          },
          extras: {
            order_id: orderData.parentOrderId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating payment intention:", error);
      throw error;
    }
  },

  // Initialize payment
  async initializePayment(orderData) {
    try {
      const paymentIntention = await this.createPaymentIntention(orderData);

      // Get the integration ID from the backend
      const configResponse = await axios.get("/api/paymob/config");
      const { integrationId } = configResponse.data;

      // Create Paymob iframe URL
      const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${integrationId}?payment_token=${paymentIntention.token}`;

      return {
        paymentKey: paymentIntention.token,
        orderId: paymentIntention.id,
        iframeUrl: iframeUrl,
      };
    } catch (error) {
      console.error("Error initializing payment:", error);
      throw error;
    }
  },
};

export default paymobService;
