import React, { useState } from "react";
import Images from "../../images";
import Icons from "../../icon";

const News: React.FC = () => {
  const [isPrimary, setIsPrimary] = useState(true);

  const toggleImages = () => {
    setIsPrimary(!isPrimary);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mb-5">
        <div className="flex items-end justify-center mt-5 ml-2 text-3xl text-gradient-color md:text-6xl">
          Featured News
        </div>

        <div className="flex items-center justify-center h-[500px] w-6xl mt-7 relative">
          {/* Nút Previous */}
          <button
            className="absolute left-0 z-10 p-2 text-white bg-gray-300 rounded-full transition-all duration-500 hover:bg-neutral-400"
            onClick={toggleImages}
          >
            <Icons.ChevronLeft />
          </button>

          {/* Ảnh chính */}
          <div className="mr-[30px] relative transition-all duration-500 hover:scale-105">
            <img
              className={`rounded-[20px] box-shadow-brand-orange transition-all duration-500 object-cover  ${
                isPrimary
                  ? "w-[745px] h-[450px] opacity-100"
                  : "w-[360px] h-[450px] opacity-50"
              }`}
              src={Images.Work1}
              alt=""
            />
            <div className="absolute bottom-5 left-5 bg-white/50 text-zinc-900 p-4 rounded-lg w-[90%]">
              <h3 className="text-lg font-bold">Title of the News</h3>
              <p className="text-sm">Short description about the news...</p>
            </div>
          </div>

          {/* Ảnh phụ */}
          <div className="relative transition-all duration-500 hover:scale-105">
            <img
              className={`rounded-[20px] box-shadow-brand-orange transition-all duration-500 object-cover ${
                isPrimary
                  ? "w-[360px] h-[450px] opacity-50"
                  : "w-[745px] h-[450px] opacity-100"
              }`}
              src={Images.Work1}
              alt=""
            />
            <div className="absolute bottom-5 left-5 bg-white/50 text-zinc-900 p-4 rounded-lg w-[90%]">
              <h3 className="text-lg font-bold">Another News</h3>
              <p className="text-sm">Some other news description...</p>
            </div>
          </div>

          {/* Nút Next */}
          <button
            className="absolute right-0 z-10 p-2 text-white bg-gray-300 rounded-full transition-all duration-500 hover:bg-neutral-400"
            onClick={toggleImages}
          >
            <Icons.ChevronRight />
          </button>
        </div>
      </div>
      <div>
        <p className="mb-5 ml-38 text-2xl text-gradient-color md:text-3xl">
          Popular Post
        </p>
        <div className=" flex justify-center gap-5 mb-5">
          <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white transition-all duration-500 hover:scale-105">
            {/* Hình ảnh */}
            <img className="w-full h-48 object-cover" src={Images.News1} />

            {/* Nội dung */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">
                Opening Day Of Boating Season, Seattle WA
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Of course, the Puget Sound is very watery, and where there is
                water, there are boats. Today is...
              </p>
            </div>

            {/* Thông tin tác giả */}
            <div className="flex items-center justify-between p-4 border-t bg-zinc-200">
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full"
                  src={Images.Auther1}
                  alt="Author"
                />
                <div>
                  <p className="text-sm font-medium">James</p>
                  <p className="text-xs text-gray-400">August 18, 2022</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 21l-5-3-5 3V5a2 2 0 012-2h6a2 2 0 012 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white transition-all duration-500 hover:scale-105">
            {/* Hình ảnh */}
            <img className="w-full h-48 object-cover" src={Images.News2} />

            {/* Nội dung */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">
                Opening Day Of Boating Season, Seattle WA
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Of course, the Puget Sound is very watery, and where there is
                water, there are boats. Today is...
              </p>
            </div>

            {/* Thông tin tác giả */}
            <div className="flex items-center justify-between p-4 border-t bg-zinc-200">
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full"
                  src={Images.Auther2}
                  alt="Author"
                />
                <div>
                  <p className="text-sm font-medium">James</p>
                  <p className="text-xs text-gray-400">August 18, 2022</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 21l-5-3-5 3V5a2 2 0 012-2h6a2 2 0 012 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white transition-all duration-500 hover:scale-105">
            {/* Hình ảnh */}
            <img className="w-full h-48 object-cover" src={Images.News3} />

            {/* Nội dung */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">
                Opening Day Of Boating Season, Seattle WA
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Of course, the Puget Sound is very watery, and where there is
                water, there are boats. Today is...
              </p>
            </div>

            {/* Thông tin tác giả */}
            <div className="flex items-center justify-between p-4 border-t bg-zinc-200">
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full"
                  src={Images.Auther3}
                  alt="Author"
                />
                <div>
                  <p className="text-sm font-medium">James</p>
                  <p className="text-xs text-gray-400">August 18, 2022</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 21l-5-3-5 3V5a2 2 0 012-2h6a2 2 0 012 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default News;
