import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box } from "@mui/material";

const images = [
  "/images/slide1.jpg",
  "/images/slide2.jpg",
  "/images/slide3.jpg"
];

const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", mt: 5 }}>
      <Slider {...settings}>
        {images.map((img, index) => (
          <Box
            key={index}
            component="img"
            src={img}
            sx={{ width: "100%", height: 500, objectFit: "cover", borderRadius: 2 }}
          />
        ))}
      </Slider>
    </Box>
  );
};

export default ImageSlider;
