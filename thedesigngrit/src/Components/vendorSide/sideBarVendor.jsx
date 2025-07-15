import React, { useEffect, useState } from "react";
import { useVendor } from "../../utils/vendorContext";
import axios from "axios";
import { RiDashboard3Fill } from "react-icons/ri";
import { LuPackageOpen } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { FaMoneyBill } from "react-icons/fa6";
import { HiBuildingStorefront } from "react-icons/hi2";
import { MdAccountBalance } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { FaWpforms, FaBell, FaUsers, FaLock } from "react-icons/fa";
import LoadingScreen from "../../Pages/loadingScreen";
import { CiUndo } from "react-icons/ci";
import { useRef } from "react";
import { PiMoneyFill } from "react-icons/pi";

// import { RiFileExcel2Fill } from "react-icons/ri";

// Badge component for circled numbers
const Badge = ({ count }) =>
  count > 0 ? (
    <span
      style={{
        background: "red",
        color: "white",
        borderRadius: "50%",
        padding: "0.2em 0.6em",
        fontSize: "0.75em",
        marginLeft: "8px",
        display: "inline-block",
        minWidth: "20px",
        textAlign: "center",
      }}
    >
      {count}
    </span>
  ) : null;

// Tooltip for locked sidebar items
const LockedTooltip = ({ show, position }) =>
  show ? (
    <div
      style={{
        position: "fixed",
        top: position.y + 12,
        left: position.x + 16,
        background: "#2d2d2d",
        color: "#fff",
        padding: "8px 14px",
        borderRadius: 8,
        fontSize: 13,
        zIndex: 9999,
        pointerEvents: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        whiteSpace: "nowrap",
      }}
    >
      Your application must be approved before accessing this page
    </div>
  ) : null;

const SidebarVendor = ({ setActivePage, activePage }) => {
  const { vendor } = useVendor();
  const [isVendorLoaded, setIsVendorLoaded] = useState(false);
  const [brandStatus, setBrandStatus] = useState(null);
  // Add state for counts
  const [notificationCount, setNotificationCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [quotationCount, setQuotationCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [variantsCount, setVariantsCount] = useState(0);
  const [viewInStoreCount, setViewInStoreCount] = useState(0);
  const [promotionsCount, setPromotionsCount] = useState(0);
  const [returnsCount, setReturnsCount] = useState(0);
  // Tooltip state for locked items
  const [lockedTooltip, setLockedTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const checkVendorAndBrand = async () => {
      if (vendor) {
        setIsVendorLoaded(true);
        // Check brand status if vendor has a brandId
        if (vendor.brandId) {
          try {
            const response = await axios.get(
              `https://api.thedesigngrit.com/api/brand/${vendor.brandId}`
            );
            setBrandStatus(response.data.status);
          } catch (error) {
            console.error("Error checking brand status:", error);
          }
        }
      } else {
        // Fallback: Check if vendor data is available in localStorage
        const storedVendor = JSON.parse(localStorage.getItem("vendor"));
        if (storedVendor) {
          setIsVendorLoaded(true);
          // Check brand status if stored vendor has a brandId
          if (storedVendor.brandId) {
            try {
              const response = await axios.get(
                `https://api.thedesigngrit.com/api/brand/${storedVendor.brandId}`
              );
              setBrandStatus(response.data.status);
            } catch (error) {
              console.error("Error checking brand status:", error);
            }
          }
        }
      }
    };
    checkVendorAndBrand();
  }, [vendor]);

  // Fetch counts for notifications, orders, and quotations
  useEffect(() => {
    const fetchCounts = async () => {
      if (!vendor?.brandId) return;
      // Notifications: count unread
      try {
        const notifRes = await fetch(
          `https://api.thedesigngrit.com/api/notifications/notifications?brandId=${vendor.brandId}`
        );
        const notifData = await notifRes.json();
        setNotificationCount(
          Array.isArray(notifData) ? notifData.filter((n) => !n.read).length : 0
        );
      } catch (e) {
        setNotificationCount(0);
      }
      // Orders: count pending
      try {
        const orderRes = await fetch(
          `https://api.thedesigngrit.com/api/orders/orders/brand/${vendor.brandId}`
        );
        const orderData = await orderRes.json();
        setOrderCount(
          Array.isArray(orderData)
            ? orderData.filter((o) => o.orderStatus === "Pending").length
            : 0
        );
      } catch (e) {
        setOrderCount(0);
      }
      // Quotations: count those not yet quoted (or needing action)
      try {
        const quoteRes = await fetch(
          `https://api.thedesigngrit.com/api/quotation/quotations/brand/${vendor.brandId}`
        );
        const quoteData = await quoteRes.json();
        setQuotationCount(
          Array.isArray(quoteData)
            ? quoteData.filter((q) => !q.quotePrice).length
            : 0
        );
      } catch (e) {
        setQuotationCount(0);
      }
      // Products: not approved (status === false)
      try {
        const res = await fetch(
          `https://api.thedesigngrit.com/api/products/getproducts/brand/${vendor.brandId}`
        );
        const data = await res.json();
        setProductsCount(
          Array.isArray(data)
            ? data.filter((p) => p.status === false).length
            : 0
        );
      } catch (e) {
        setProductsCount(0);
      }
      // Variants: total count (or filter for pending if you have such a status)
      try {
        const res = await fetch(
          `https://api.thedesigngrit.com/api/product-variants/brand/${vendor.brandId}`
        );
        const data = await res.json();
        setVariantsCount(Array.isArray(data) ? data.length : 0);
      } catch (e) {
        setVariantsCount(0);
      }
      // View In Store: pending count
      try {
        const res = await fetch(
          `https://api.thedesigngrit.com/api/view-in-store/brand/${vendor.brandId}`
        );
        const data = await res.json();
        setViewInStoreCount(
          Array.isArray(data)
            ? data.filter((v) => v.status === "pending").length
            : 0
        );
      } catch (e) {
        setViewInStoreCount(0);
      }
      // Promotions: current or upcoming
      try {
        const res = await fetch(
          `https://api.thedesigngrit.com/api/products/getproducts/brand/${vendor.brandId}`
        );
        const data = await res.json();
        const now = new Date();
        const count = Array.isArray(data)
          ? data.filter(
              (p) =>
                p.promotionStartDate &&
                p.promotionEndDate &&
                new Date(p.promotionEndDate) >= now
            ).length
          : 0;
        setPromotionsCount(count);
      } catch (e) {
        setPromotionsCount(0);
      }
      // Returned Orders: pending
      try {
        const res = await fetch(
          `https://api.thedesigngrit.com/api/returns-order/returns/brand/${vendor.brandId}`
        );
        const data = await res.json();
        setReturnsCount(
          Array.isArray(data)
            ? data.filter((r) => r.status === "Pending").length
            : 0
        );
      } catch (e) {
        setReturnsCount(0);
      }
    };
    fetchCounts();
  }, [vendor]);

  // Function to handle active page highlighting
  const getActiveClass = (page, locked) => {
    let base =
      activePage === page
        ? "sidebar-item-vendor active"
        : "sidebar-item-vendor";
    return locked ? base + " locked" : base;
  };

  // Helper to determine if an item should be locked
  const isLocked = (page) => {
    const locked =
      brandStatus === "pending" &&
      !(page === "BrandForm" || page === "BrandingPage");
    console.log(`isLocked('${page}')`, locked);
    return locked;
  };

  // Helper to check if vendor has access to a page by tier
  const hasTierAccess = (page) => {
    if (!vendor?.tier) return false;
    return vendor.tier >= (sidebarAccess[page] || 99);
  };

  // Mouse event handlers for locked items
  const handleLockedMouseEnter = (e) => {
    console.log("Hovered locked item", e.clientX, e.clientY);
    setLockedTooltip({ show: true, x: e.clientX, y: e.clientY });
  };
  const handleLockedMouseMove = (e) => {
    console.log("Moving on locked item", e.clientX, e.clientY);
    setLockedTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
  };
  const handleLockedMouseLeave = () => {
    console.log("Left locked item");
    setLockedTooltip({ show: false, x: 0, y: 0 });
  };

  // Return a loading spinner or message until vendor data is loaded
  // Debugging logs
  console.log("brandStatus", brandStatus);
  console.log("isLocked('allProducts')", isLocked("allProducts"));
  // Test always-on tooltip
  // Remove this after debugging
  // <LockedTooltip show={true} position={{ x: 200, y: 200 }} />

  if (!isVendorLoaded) {
    return <LoadingScreen />;
  }

  // If brand is deactivated, don't render the sidebar
  if (brandStatus === "deactivated") {
    return null;
  }

  // Access control: minimum tier required for each sidebar item
  const sidebarAccess = {
    dashboard: 2, // Manager+
    notifications: 1, // All
    allProducts: 2, // Manager+
    allProductsVariant: 2, // Manager+
    orderList: 1, // All
    ShippingFees: 2, // Manager+
    quotationsList: 1, // All
    ViewInStoreVendor: 1, // All
    promotionsPage: 2, // Manager+
    returnsOrdersPage: 1, // All
    BrandForm: 2, // Manager+
    BrandingPage: 2, // Manager+
    Accounting: 3, // Executive only
    EmployeePage: 2, // Manager+
  };

  return (
    <>
      <LockedTooltip
        show={lockedTooltip.show}
        position={{ x: lockedTooltip.x, y: lockedTooltip.y }}
      />
      <aside className="sidebar-vendor">
        <ul className="sidebar-menu-vendor">
          {/* Dashboard */}
          {hasTierAccess("dashboard") && (
            <li
              onClick={(e) => {
                if (isLocked("dashboard")) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                setActivePage("dashboard");
              }}
              className={getActiveClass("dashboard", isLocked("dashboard"))}
              style={
                isLocked("dashboard")
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}
              }
              onMouseEnter={
                isLocked("dashboard") ? handleLockedMouseEnter : undefined
              }
              onMouseMove={
                isLocked("dashboard") ? handleLockedMouseMove : undefined
              }
              onMouseLeave={
                isLocked("dashboard") ? handleLockedMouseLeave : undefined
              }
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <RiDashboard3Fill className="sidebar-item-icon" />
                  <span className="sidebar-item-text">Dashboard</span>
                </span>
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isLocked("dashboard") && <FaLock />}
                </span>
              </span>
            </li>
          )}
          {/* Notifications */}
          {hasTierAccess("notifications") && (
            <li
              onClick={(e) => {
                if (isLocked("notifications")) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                setActivePage("notifications");
              }}
              className={getActiveClass(
                "notifications",
                isLocked("notifications")
              )}
              style={
                isLocked("notifications")
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}
              }
              onMouseEnter={
                isLocked("notifications") ? handleLockedMouseEnter : undefined
              }
              onMouseMove={
                isLocked("notifications") ? handleLockedMouseMove : undefined
              }
              onMouseLeave={
                isLocked("notifications") ? handleLockedMouseLeave : undefined
              }
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  width: "100%",
                  paddingRight: "40px",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FaBell className="sidebar-item-icon" />
                  <span className="sidebar-item-text" style={{ marginLeft: 8 }}>
                    Notifications
                  </span>
                </span>
                {notificationCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      right: "0px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      minWidth: "22px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Badge count={notificationCount} />
                  </span>
                )}
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isLocked("notifications") && <FaLock />}
                </span>
              </span>
            </li>
          )}
          {/* All Products */}
          {hasTierAccess("allProducts") && (
            <li
              onClick={(e) => {
                if (isLocked("allProducts")) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                setActivePage("allProducts");
              }}
              className={getActiveClass("allProducts", isLocked("allProducts"))}
              style={
                isLocked("allProducts")
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}
              }
              onMouseEnter={
                isLocked("allProducts") ? handleLockedMouseEnter : undefined
              }
              onMouseMove={
                isLocked("allProducts") ? handleLockedMouseMove : undefined
              }
              onMouseLeave={
                isLocked("allProducts") ? handleLockedMouseLeave : undefined
              }
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  width: "100%",
                  paddingRight: "40px",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <LuPackageOpen className="sidebar-item-icon" />
                  <span className="sidebar-item-text" style={{ marginLeft: 8 }}>
                    All Products
                  </span>
                </span>
                {productsCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      right: "0px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      minWidth: "22px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Badge count={productsCount} />
                  </span>
                )}
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isLocked("allProducts") && <FaLock />}
                </span>
              </span>
            </li>
          )}
          {/* Variants Products */}
          {hasTierAccess("allProductsVariant") && (
            <li
              onClick={(e) => {
                if (isLocked("allProductsVariant")) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                setActivePage("allProductsVariant");
              }}
              className={getActiveClass(
                "allProductsVariant",
                isLocked("allProductsVariant")
              )}
              style={
                isLocked("allProductsVariant")
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}
              }
              onMouseEnter={
                isLocked("allProductsVariant")
                  ? handleLockedMouseEnter
                  : undefined
              }
              onMouseMove={
                isLocked("allProductsVariant")
                  ? handleLockedMouseMove
                  : undefined
              }
              onMouseLeave={
                isLocked("allProductsVariant")
                  ? handleLockedMouseLeave
                  : undefined
              }
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  width: "100%",
                  paddingRight: "40px",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <LuPackageOpen className="sidebar-item-icon" />
                  <span className="sidebar-item-text" style={{ marginLeft: 8 }}>
                    Variants Products
                  </span>
                </span>
                {variantsCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      right: "0px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      minWidth: "22px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Badge count={variantsCount} />
                  </span>
                )}
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isLocked("allProductsVariant") && <FaLock />}
                </span>
              </span>
            </li>
          )}
          {/* Order List */}
          {hasTierAccess("orderList") && (
            <li
              onClick={(e) => {
                if (isLocked("orderList")) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                setActivePage("orderList");
              }}
              className={getActiveClass("orderList", isLocked("orderList"))}
              style={
                isLocked("orderList")
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}
              }
              onMouseEnter={
                isLocked("orderList") ? handleLockedMouseEnter : undefined
              }
              onMouseMove={
                isLocked("orderList") ? handleLockedMouseMove : undefined
              }
              onMouseLeave={
                isLocked("orderList") ? handleLockedMouseLeave : undefined
              }
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  width: "100%",
                  paddingRight: "40px",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <TbTruckDelivery className="sidebar-item-icon" />
                  <span className="sidebar-item-text" style={{ marginLeft: 8 }}>
                    Order List
                  </span>
                </span>
                {orderCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      right: "0px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      minWidth: "22px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Badge count={orderCount} />
                  </span>
                )}
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isLocked("orderList") && <FaLock />}
                </span>
              </span>
            </li>
          )}
          {/* Shipping Fees */}
          {hasTierAccess("ShippingFees") && (
            <li
              onClick={(e) => {
                if (isLocked("ShippingFees")) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                setActivePage("ShippingFees");
              }}
              className={getActiveClass(
                "ShippingFees",
                isLocked("ShippingFees")
              )}
              style={
                isLocked("ShippingFees")
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}
              }
              onMouseEnter={
                isLocked("ShippingFees") ? handleLockedMouseEnter : undefined
              }
              onMouseMove={
                isLocked("ShippingFees") ? handleLockedMouseMove : undefined
              }
              onMouseLeave={
                isLocked("ShippingFees") ? handleLockedMouseLeave : undefined
              }
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <PiMoneyFill className="sidebar-item-icon" />
                  <span className="sidebar-item-text">Shipping Fees</span>
                </span>
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isLocked("ShippingFees") && <FaLock />}
                </span>
              </span>
            </li>
          )}
          {/* Quotations */}
          {hasTierAccess("quotationsList") && (
            <li
              onClick={(e) => {
                if (isLocked("quotationsList")) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                setActivePage("quotationsList");
              }}
              className={getActiveClass(
                "quotationsList",
                isLocked("quotationsList")
              )}
              style={
                isLocked("quotationsList")
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}
              }
              onMouseEnter={
                isLocked("quotationsList") ? handleLockedMouseEnter : undefined
              }
              onMouseMove={
                isLocked("quotationsList") ? handleLockedMouseMove : undefined
              }
              onMouseLeave={
                isLocked("quotationsList") ? handleLockedMouseLeave : undefined
              }
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  width: "100%",
                  paddingRight: "40px",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FaMoneyBill className="sidebar-item-icon" />
                  <span className="sidebar-item-text" style={{ marginLeft: 8 }}>
                    Quotations
                  </span>
                </span>
                {quotationCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      right: "0px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      minWidth: "22px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Badge count={quotationCount} />
                  </span>
                )}
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isLocked("quotationsList") && <FaLock />}
                </span>
              </span>
            </li>
          )}
          {/* View In Store */}
          {hasTierAccess("ViewInStoreVendor") && (
            <li
              onClick={(e) => {
                if (isLocked("ViewInStoreVendor")) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                setActivePage("ViewInStoreVendor");
              }}
              className={getActiveClass(
                "ViewInStoreVendor",
                isLocked("ViewInStoreVendor")
              )}
              style={
                isLocked("ViewInStoreVendor")
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}
              }
              onMouseEnter={
                isLocked("ViewInStoreVendor")
                  ? handleLockedMouseEnter
                  : undefined
              }
              onMouseMove={
                isLocked("ViewInStoreVendor")
                  ? handleLockedMouseMove
                  : undefined
              }
              onMouseLeave={
                isLocked("ViewInStoreVendor")
                  ? handleLockedMouseLeave
                  : undefined
              }
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  width: "100%",
                  paddingRight: "40px",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <HiBuildingStorefront className="sidebar-item-icon" />
                  <span className="sidebar-item-text" style={{ marginLeft: 8 }}>
                    View In Store
                  </span>
                </span>
                {viewInStoreCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      right: "0px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      minWidth: "22px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Badge count={viewInStoreCount} />
                  </span>
                )}
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isLocked("ViewInStoreVendor") && <FaLock />}
                </span>
              </span>
            </li>
          )}
          {/* Promotions */}
          {hasTierAccess("promotionsPage") && (
            <li
              onClick={(e) => {
                if (isLocked("promotionsPage")) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                setActivePage("promotionsPage");
              }}
              className={getActiveClass(
                "promotionsPage",
                isLocked("promotionsPage")
              )}
              style={
                isLocked("promotionsPage")
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}
              }
              onMouseEnter={
                isLocked("promotionsPage") ? handleLockedMouseEnter : undefined
              }
              onMouseMove={
                isLocked("promotionsPage") ? handleLockedMouseMove : undefined
              }
              onMouseLeave={
                isLocked("promotionsPage") ? handleLockedMouseLeave : undefined
              }
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  width: "100%",
                  paddingRight: "40px",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FaMoneyBill className="sidebar-item-icon" />
                  <span className="sidebar-item-text" style={{ marginLeft: 8 }}>
                    Promotions
                  </span>
                </span>
                {promotionsCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      right: "0px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      minWidth: "22px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Badge count={promotionsCount} />
                  </span>
                )}
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isLocked("promotionsPage") && <FaLock />}
                </span>
              </span>
            </li>
          )}
          {/* Returns Orders */}
          {hasTierAccess("returnsOrdersPage") && (
            <li
              onClick={(e) => {
                if (isLocked("returnsOrdersPage")) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                setActivePage("returnsOrdersPage");
              }}
              className={getActiveClass(
                "returnsOrdersPage",
                isLocked("returnsOrdersPage")
              )}
              style={
                isLocked("returnsOrdersPage")
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}
              }
              onMouseEnter={
                isLocked("returnsOrdersPage")
                  ? handleLockedMouseEnter
                  : undefined
              }
              onMouseMove={
                isLocked("returnsOrdersPage")
                  ? handleLockedMouseMove
                  : undefined
              }
              onMouseLeave={
                isLocked("returnsOrdersPage")
                  ? handleLockedMouseLeave
                  : undefined
              }
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  width: "100%",
                  paddingRight: "40px",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <CiUndo className="sidebar-item-icon" />
                  <span className="sidebar-item-text" style={{ marginLeft: 8 }}>
                    Returns Orders
                  </span>
                </span>
                {returnsCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      right: "0px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      minWidth: "22px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Badge count={returnsCount} />
                  </span>
                )}
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isLocked("returnsOrdersPage") && <FaLock />}
                </span>
              </span>
            </li>
          )}
          {/* Brand Form */}
          {hasTierAccess("BrandForm") && (
            <li
              onClick={() => setActivePage("BrandForm")}
              className={getActiveClass("BrandForm", false)}
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FaWpforms className="sidebar-item-icon" />
                  <span className="sidebar-item-text">Brand Form</span>
                </span>
                <span style={{ width: 24 }}></span>
              </span>
            </li>
          )}
          {/* Brand Profile */}
          {hasTierAccess("BrandingPage") && (
            <li
              onClick={() => setActivePage("BrandingPage")}
              className={getActiveClass("BrandingPage", false)}
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <ImProfile className="sidebar-item-icon" />
                  <span className="sidebar-item-text">Brand Profile</span>
                </span>
                <span style={{ width: 24 }}></span>
              </span>
            </li>
          )}
          {/* Accounting (Tier 3 only) */}
          {hasTierAccess("Accounting") && (
            <li
              onClick={() =>
                !isLocked("Accounting") && setActivePage("Accounting")
              }
              className={getActiveClass("Accounting", isLocked("Accounting"))}
              style={
                isLocked("Accounting")
                  ? { pointerEvents: "none", opacity: 0.5 }
                  : {}
              }
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <MdAccountBalance className="sidebar-item-icon" />
                  <span className="sidebar-item-text">Accounting</span>
                </span>
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isLocked("Accounting") && <FaLock />}
                </span>
              </span>
            </li>
          )}
          {/* Employees (Tier 2 and 3) */}
          {hasTierAccess("EmployeePage") && (
            <li
              onClick={() =>
                !isLocked("EmployeePage") && setActivePage("EmployeePage")
              }
              className={getActiveClass(
                "EmployeePage",
                isLocked("EmployeePage")
              )}
              style={
                isLocked("EmployeePage")
                  ? { pointerEvents: "none", opacity: 0.5 }
                  : {}
              }
            >
              <span
                className="sidebar-item-content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FaUsers className="sidebar-item-icon" />
                  <span className="sidebar-item-text">Employees</span>
                </span>
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isLocked("EmployeePage") && <FaLock />}
                </span>
              </span>
            </li>
          )}
        </ul>
      </aside>
    </>
  );
};

export default SidebarVendor;
