import React from "react";
import Images from "../../images";

const Carousel: React.FC = () => {
  return (
    <>
      <div className="relative w-full min-h-screen bg-white px-8">
        <img
          src={Images.Background}
          alt="Background"
          className="w-300 h-auto"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-start px-10">
          <div className=" flex items-center">
            <img src={Images.Logo} alt="logo" className="max-w-70 h-40" />
            <h1 className="text-gradient-color text-5xl ml-2">| GR-1</h1>
          </div>
          <p className="text-black text-base px-5 w-150">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
          </p>
        </div>
      </div>
    </>
  );
};

export default Carousel;
