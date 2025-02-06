import React, { useState, useEffect, useContext } from "react";
import { Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { LuPackage } from "react-icons/lu";
import InteractiveStarRating from "../Components/rating";
import { UserContext } from "../utils/userContext";

function TrackOrder() {
  const [ordersData, setOrdersData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSubOrder, setSelectedSubOrder] = useState(null);
  const { userSession } = useContext(UserContext);

  // Fetch orders based on userSession.id
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userSession?.id) return; // Ensure userSession is available

      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/orders/customer/${userSession.id}`
        ); // Adjust API endpoint as needed
        const data = await response.json();

        // Filter orders for the logged-in user
        const userOrders = data.filter(
          (order) => order.customerId._id === userSession.id
        );

        setOrdersData(userOrders);
        setSelectedOrder(userOrders[0] || null); // Default to the first order if available
        setSelectedSubOrder(userOrders[0]?.cartItems[0] || null); // Default to the first cart item
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userSession]);

  return (
    <Box sx={{ fontFamily: "Montserrat" }}>
      <Box sx={{ paddingBottom: "25rem" }}>
        <FormControl fullWidth sx={{ marginBottom: "20px" }}>
          <InputLabel>Select Order</InputLabel>
          <Select
            value={selectedOrder?._id || ""}
            onChange={(e) => {
              const order = ordersData.find(
                (order) => order._id === e.target.value
              );
              setSelectedOrder(order);
              setSelectedSubOrder(order?.cartItems[0] || null);
            }}
          >
            {ordersData.map((order) => (
              <MenuItem key={order._id} value={order._id}>
                Order No. : {order._id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="terms-container">
          {/* Sidebar */}

          {/* Content Section */}
          <div className="order-details">
            {selectedOrder && selectedSubOrder && (
              <>
                {/* Order Info */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <Box>
                    <h3 style={{ fontWeight: "bold", fontSize: "26px" }}>
                      Order :{selectedOrder._id}
                    </h3>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <p>
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </Box>
                  </Box>
                  <select
                    value={selectedSubOrder.productId.name}
                    onChange={(e) =>
                      setSelectedSubOrder(
                        selectedOrder.cartItems.find(
                          (item) => item.productId.name === e.target.value
                        )
                      )
                    }
                  >
                    {selectedOrder.cartItems.map((item) => (
                      <option key={item._id} value={item.productId.name}>
                        {item.productId.name}
                      </option>
                    ))}
                  </select>
                </Box>

                {/* Order Summary */}
                <div className="order-card">
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <h2>Order Summary</h2>
                      <span className="status paid">
                        {selectedOrder.orderStatus}
                      </span>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <ShoppingCartIcon />
                      <LocalShippingIcon />
                      <LuPackage />
                    </Box>
                  </Box>
                  <Box className="order-pays-subtotal">
                    <p>Subtotal:</p>
                    <p>{selectedOrder.subtotal} LE</p>
                  </Box>
                  <Box className="order-pays-subtotal">
                    <p>Shipping:</p>
                    <p>{selectedOrder.shippingFee} LE</p>
                  </Box>
                  <Box className="order-pays-subtotal">
                    <p className="total">Total:</p>
                    <p className="total">{selectedOrder.total} LE</p>
                  </Box>
                </div>

                {/* Order Items */}
                <div className="order-card">
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <h3>Order Item</h3>
                      <h4>{selectedSubOrder.productId.name}</h4>
                      <span className="status shipped">
                        {selectedOrder.orderStatus}
                      </span>
                    </Box>
                    <Box sx={{ paddingTop: "26px", display: "flex", gap: 2 }}>
                      <InteractiveStarRating />
                    </Box>
                  </Box>
                  <div className="item">
                    <div className="item-details">
                      <Box>
                        <h5>{selectedSubOrder.productId.name}</h5>
                        <p>{selectedSubOrder.totalPrice} LE</p>
                        <p>Quantity: {selectedSubOrder.quantity}</p>
                      </Box>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default TrackOrder;
