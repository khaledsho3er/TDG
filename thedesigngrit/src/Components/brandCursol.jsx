import { useState } from "react";
import { FaPhone, FaQuoteRight, FaWhatsapp } from "react-icons/fa";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi";

const products = [
  {
    name: "Sofa",
    price: "LE 49.00",
    image: "/Assets/seatersofa.webp",
  },
  {
    name: "Chair",
    price: "LE 49.00",
    image: "/Assets/sofabrown.webp",
  },
  {
    name: "Couch",
    price: "LE 49.00",
    image: "/Assets/prodImg1.webp",
  },
];

export default function BrandCursol() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex flex-col gap-2 border-b pb-4">
        <button className="flex items-center gap-2 text-gray-700 font-medium">
          <FaQuoteRight /> Request a quotation
        </button>
        <button className="flex items-center gap-2 text-gray-700 font-medium">
          <FaPhone /> Call us at +39 080 554 3553
        </button>
        <button className="flex items-center gap-2 text-gray-700 font-medium">
          <FaWhatsapp /> Write to us or order on Whatsapp
        </button>
      </div>
      <div className="relative mt-4">
        <div className="flex items-center overflow-hidden">
          {products.map((product, index) => (
            <div
              key={index}
              className={`absolute w-full transition-opacity duration-500 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg"
              />
              <div className="mt-2 text-center text-gray-800">
                <p className="text-sm">Min. 250 units · Delivery: 2 weeks</p>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">from {product.price} per unit</p>
              </div>
            </div>
          ))}
        </div>
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          onClick={prevSlide}
        >
          <HiOutlineChevronLeft />
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          onClick={nextSlide}
        >
          <HiOutlineChevronRight />
        </button>
      </div>
    </div>
  );
}
