import { useState } from "react";

interface IProps {
  images: string[] | [];
}

function Slider({ images }: IProps) {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [openPreview, setOpenPreview] = useState(false);
  const changeSlide = (direction: "left" | "right") => {
    if (direction === "left") {
      if (imageIndex === 0) {
        setImageIndex(images.length - 1);
      } else {
        setImageIndex(imageIndex - 1);
      }
    } else {
      if (imageIndex === images.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }
  };

  const handleOpenPreview = (index: number) => {
    setOpenPreview(true);
    setImageIndex(index);
  };

  return (
    <div className="flex w-full h-[350px] gap-5 max-sm:h-[280px]">
      {openPreview && (
        <div className="flex-center w-screen h-screen top-0 left-0 absolute bg-black z-[9999]">
          <button
            className="flex-center flex-1 mx-3 p-2 border-0 outline-0"
            onClick={() => changeSlide("left")}
          >
            <i className="fa-solid fa-chevron-left text-3xl sm:text-5xl text-white"></i>
          </button>
          <div className="flex-10">
            <img
              className="w-full h-full object-cover"
              src={images[imageIndex]}
              alt=""
            />
          </div>
          <button
            className="flex-center flex-1 mx-3 p-2 border-0 outline-0"
            onClick={() => changeSlide("right")}
          >
            <i className="fa-solid fa-chevron-right text-3xl sm:text-5xl text-white"></i>
          </button>
          <button
            className="absolute top-0 right-0 m-5 p-3"
            onClick={() => setOpenPreview(false)}
          >
            <i className="fa-solid fa-times text-3xl text-white" />
          </button>
        </div>
      )}
      <div className="flex-3 max-sm:flex-2">
        <img
          className="w-full h-full object-cover rounded-xl cursor-pointer"
          src={images[0]}
          alt=""
          onClick={() => handleOpenPreview(0)}
        />
      </div>
      <div className="flex flex-col flex-1 justify-center gap-5">
        {images.slice(1).map((image, index) => (
          <img
            className="h-[100px] max-sm:h-20 rounded-md cursor-pointer"
            src={image}
            alt="apartment image"
            key={index}
            onClick={() => handleOpenPreview(index + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
