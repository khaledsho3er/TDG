// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardMedia,
//   CardContent,
//   IconButton,
// } from "@mui/material";
// import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";

// const BestSellersSlider = () => {
//   const cards = [
//     {
//       id: 1,
//       image: "Assets/bestseller/product4.png", // Replace with actual paths
//       badge: "Badge",
//       deliveryInfo: "Min. 250 units · Delivery: 2 weeks",
//       title: "Product title",
//       price: "From LE 49.00 per unit",
//     },
//     {
//       id: 2,
//       image: "Assets/bestseller/product1.png",
//       badge: "Badge",
//       deliveryInfo: "Min. 250 units · Delivery: 2 weeks",
//       title: "Product title",
//       price: "From LE 49.00 per unit",
//     },
//     {
//       id: 3,
//       image: "Assets/bestseller/product2.png",
//       badge: "Badge",
//       deliveryInfo: "Min. 250 units · Delivery: 2 weeks",
//       title: "Product title",
//       price: "From LE 49.00 per unit",
//     },
//     {
//       id: 4,
//       image: "Assets/bestseller/product3.png",
//       badge: "Badge",
//       deliveryInfo: "Min. 250 units · Delivery: 2 weeks",
//       title: "Product title",
//       price: "From LE 49.00 per unit",
//     },
//   ];

//   const [startIndex, setStartIndex] = useState(0);

//   const handleNext = () => {
//     setStartIndex((prevIndex) => (prevIndex + 1) % cards.length);
//   };

//   const handlePrev = () => {
//     setStartIndex((prevIndex) =>
//       prevIndex === 0 ? cards.length - 1 : prevIndex - 1
//     );
//   };

//   const visibleCards = [
//     cards[startIndex],
//     cards[(startIndex + 1) % cards.length],
//     cards[(startIndex + 2) % cards.length],
//     cards[(startIndex + 3) % cards.length],
//   ];

//   return (
//     <Box className="BestSeller-HomePage-slider-container">
//       <Box className="BestSeller-HomePage-slider-container-h2">
//         <h2> Best Seller</h2>
//       </Box>
//       <Box className="BestSeller-HomePage-cards-wrapper">
//         {visibleCards.map((card, index) => (
//           <Card key={card.id} className="BestSeller-HomePage-card">
//             <CardMedia
//               component="img"
//               image={card.image}
//               alt={card.title}
//               className="BestSeller-HomePage-card-image"
//             />
//             <CardContent className="BestSeller-HomePage-card-content">
//               <Typography className="BestSeller-HomePage-badge">
//                 {card.badge}
//               </Typography>
//               <Typography className="BestSeller-HomePage-delivery-info">
//                 {card.deliveryInfo}
//               </Typography>
//               <Typography className="BestSeller-HomePage-product-title">
//                 {card.title}
//               </Typography>
//               <Typography className="BestSeller-HomePage-price">
//                 {card.price}
//               </Typography>
//             </CardContent>
//           </Card>
//         ))}
//       </Box>
//       <Box className="BestSeller-HomePage-navigation-buttons">
//         <IconButton
//           onClick={handlePrev}
//           className="BestSeller-HomePage-nav-button"
//         >
//           <BsArrowLeftCircle size="30px" />
//         </IconButton>
//         <IconButton
//           onClick={handleNext}
//           className="BestSeller-HomePage-nav-button"
//         >
//           <BsArrowRightCircle size="30px" />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// };

// export default BestSellersSlider;
import React, { useState } from "react";

const ProductSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const products = [
    {
      image: "Assets/bestseller/product1.png",
      badge: "Badge",
      minUnits: 250,
      delivery: "2 weeks",
      title: "Product title",
      price: 49.0,
    },
    {
      image: "Assets/bestseller/product2.png",
      badge: "Badge",
      minUnits: 250,
      delivery: "2 weeks",
      title: "Product title",
      price: 49.0,
    },
    {
      image: "Assets/bestseller/product3.png",
      badge: "Badge",
      minUnits: 250,
      delivery: "2 weeks",
      title: "Product title",
      price: 49.0,
    },
    {
      image: "Assets/bestseller/product4.png",
      badge: "Badge",
      minUnits: 250,
      delivery: "2 weeks",
      title: "Product title",
      price: 49.0,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  return (
    <div className="slider-container">
      <h1 className="slider-title">BEST SELLERS</h1>

      <div className="slider-content">
        {products.map((product, index) => (
          <div
            key={index}
            className="product-card"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            <div className="product-image">
              <img src={product.image} alt={product.title} />
            </div>

            <div className="product-info">
              <span className="badge">{product.badge}</span>
              <div className="product-metadata">
                Min. {product.minUnits} units · Delivery: {product.delivery}
              </div>
              <h3 className="product-title">{product.title}</h3>
              <div className="product-price">
                from LE {product.price.toFixed(2)} per unit
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-controls">
        <div className="dots">
          {products.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <div className="arrows">
          <button className="arrow prev" onClick={prevSlide}>
            ←
          </button>
          <button className="arrow next" onClick={nextSlide}>
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
