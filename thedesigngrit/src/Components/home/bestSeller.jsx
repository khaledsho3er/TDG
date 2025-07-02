import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { UserContext } from "../../utils/userContext";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  const navigate = useNavigate();
  const { userSession } = useContext(UserContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const swiperRef = useRef(null);
  const sliderContainerRef = useRef(null);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  const visibleCount = isMobile ? 1 : isTablet ? 3 : 5;

  // Fetch the user's favorite products on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userSession) return;

      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/favorites/${userSession.id}`
        );
        if (response.ok) {
          const favoritesData = await response.json();
          const favoriteIds = favoritesData.map((prod) => prod._id);
          const favoritesMap = {};
          favoriteIds.forEach((id) => {
            favoritesMap[id] = true;
          });
          setFavorites(favoritesMap);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, [userSession]);

  // Toggle the favorite status
  const toggleFavorite = async (event, productId) => {
    event.stopPropagation(); // Prevent triggering card click

    if (!userSession) return; // If there's no user session, prevent posting

    const isFavorite = favorites[productId];
    const endpoint = isFavorite ? "/remove" : "/add";
    const requestPayload = {
      userSession,
      productId: productId,
    };

    try {
      const response = await fetch(
        `https://api.thedesigngrit.com/api/favorites${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        }
      );

      if (response.ok) {
        setFavorites((prev) => ({
          ...prev,
          [productId]: !isFavorite,
        }));
      } else {
        console.error("Error: Unable to update favorite status.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchBestSellers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://api.thedesigngrit.com/api/orders/bestsellers"
      );
      const data = response.data;
      setProducts(data);
    } catch (error) {
      console.error("Error fetching bestsellers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

  // Handle wheel events for the entire slider container
  useEffect(() => {
    const handleWheel = (event) => {
      if (!swiperRef.current || !sliderContainerRef.current) return;

      const swiper = swiperRef.current;
      const { deltaX, deltaY } = event;

      // Determine if we should scroll horizontally or vertically
      const isHorizontalScroll = Math.abs(deltaX) > Math.abs(deltaY);
      const isAtBeginning = swiper.isBeginning;
      const isAtEnd = swiper.isEnd;

      // If scrolling horizontally or within the slider's bounds
      if (isHorizontalScroll || (!isAtBeginning && !isAtEnd)) {
        // Let the swiper handle horizontal scrolling
        swiper.mousewheel.handleMouseWheel(event);
        event.preventDefault();
      }
      // Otherwise, let the page scroll naturally (vertical scrolling)
    };

    const container = sliderContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="slider-container-home">
        <h1 className="slider-title">BEST SELLERS</h1>
        <div className="loading-placeholder" style={{ height: "400px" }} />
      </div>
    );
  }

  return (
    <div className="slider-container-home" ref={sliderContainerRef}>
      <h2 className="slider-title">BEST SELLERS</h2>

      <Swiper
        modules={[Navigation, Pagination, Keyboard, Mousewheel]}
        spaceBetween={isMobile ? 10 : 20}
        slidesPerView={visibleCount}
        navigation={!isMobile}
        pagination={isMobile ? { clickable: true } : false}
        keyboard={{ enabled: true }}
        mousewheel={{
          enabled: true,
          forceToAxis: true,
          sensitivity: 1,
          thresholdDelta: 50,
          thresholdTime: 300,
        }}
        grabCursor={true}
        loop={true}
        className="bestseller-swiper"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        // breakpoints={{
        //   // When window width is >= 0px (mobile)
        //   0: {
        //     slidesPerView: 1,
        //     spaceBetween: 10,
        //   },
        //   426: {
        //     slidesPerView: 2,
        //     spaceBetween: 10,
        //   },
        //   769: {
        //     slidesPerView: 3,
        //     spaceBetween: 20,
        //   },
        //   961: {
        //     slidesPerView: 3,
        //     spaceBetween: 30,
        //   },
        //   // When window width is >= 1024px (desktop)
        //   1024: {
        //     slidesPerView: 4,
        //     spaceBetween: 20,
        //   },
        //   1025: {
        //     slidesPerView: 5,
        //     spaceBetween: 20,
        //   },
        // }}
      >
        {products
          .filter(
            (product) =>
              product && product._id && product.mainImage && product.name
          )
          .map((product, index) => (
            <SwiperSlide key={product._id || index}>
              <div
                className="product-card-bestseller"
                style={{
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Favorite Icon */}
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    zIndex: 10,
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                  }}
                  onClick={(event) => toggleFavorite(event, product._id)}
                >
                  {favorites[product._id] ? (
                    <FavoriteIcon style={{ color: "red", fontSize: "20px" }} />
                  ) : (
                    <FavoriteBorderIcon
                      style={{ color: "#000", fontSize: "20px" }}
                    />
                  )}
                </div>

                <div className="product-image-home">
                  <img
                    src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}?width=250&height=200&format=webp`}
                    alt={product.name}
                    loading={index < visibleCount ? "eager" : "lazy"}
                    width="300"
                    height="200"
                  />
                </div>

                <div className="related-info">
                  <p className="related-category">{product?.brandName}</p>
                  <h3 className="related-name">{product.name}</h3>
                  {product.salePrice ? (
                    <>
                      <p
                        className="related-price"
                        style={{
                          textDecoration: "line-through",
                          color: "#999",
                        }}
                      >
                        {product.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        E£
                      </p>
                      <p
                        className="related-price"
                        style={{ color: "#e74c3c", fontWeight: "bold" }}
                      >
                        {product.salePrice.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        E£
                      </p>
                    </>
                  ) : (
                    <p className="related-price">
                      {product.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      E£
                    </p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
