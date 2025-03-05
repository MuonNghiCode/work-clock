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
      <div className="min-h-screen">
        <div className="flex flex-col items-center justify-center mb-5">
          <div className="flex items-end justify-center mt-5 ml-2 text-3xl text-gradient-color md:text-6xl">
            Featured News
          </div>

          {/* Desktop */}
          <div className="relative items-center justify-center hidden md:flex md:w-full w-6xl mt-7">
            {/* Nút Previous */}
            <button
              className="absolute z-10 p-2 text-white transition-all duration-500 bg-gray-300 rounded-full left-15 hover:bg-neutral-400"
              onClick={toggleImages}
            >
              <Icons.ChevronLeft />
            </button>

            {/* Ảnh chính */}
            <div className="mr-[25px] relative transition-all duration-500 hover:scale-105">
              <img
                className={`rounded-[20px] box-shadow-brand-orange transition-all duration-500 object-cover ${
                  isPrimary
                    ? "w-[800px] h-[450px] opacity-100"
                    : "w-[500px] h-[450px] opacity-50"
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
                    ? "w-[500px] h-[450px] opacity-50"
                    : "w-[800px] h-[450px] opacity-100"
                }`}
                src={Images.News1}
                alt=""
              />
              <div className="absolute bottom-5 left-5 bg-white/50 text-zinc-900 p-4 rounded-lg w-[90%]">
                <h3 className="text-lg font-bold">Another News</h3>
                <p className="text-sm">Some other news description...</p>
              </div>
            </div>

            {/* Nút Next */}
            <button
              className="absolute z-10 p-2 text-white transition-all duration-500 bg-gray-300 rounded-full right-15 hover:bg-neutral-400"
              onClick={toggleImages}
            >
              <Icons.ChevronRight />
            </button>
          </div>

          {/* Mobile */}
          <div className="relative block w-full mt-5 overflow-hidden md:hidden">
            {/* Ảnh cho mobile */}
            <div className="relative w-full h-[400px]">
              <img
                className={`absolute top-0 left-0 w-full h-[400px] rounded-[20px] box-shadow-brand-orange object-cover transition-all duration-700 ease-in-out ${
                  isPrimary
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-full"
                }`}
                src={Images.Work1}
                alt="Work1"
              />
              <img
                className={`absolute top-0 left-0 w-full h-[400px] rounded-[20px] box-shadow-brand-orange object-cover transition-all duration-700 ease-in-out ${
                  isPrimary
                    ? "opacity-0 translate-x-full"
                    : "opacity-100 translate-x-0"
                }`}
                src={Images.News1}
                alt="News1"
              />

              {/* Phần text */}
              <div
                className={`absolute bottom-5 left-5 bg-white/50 text-zinc-900 p-4 rounded-lg w-[90%] transition-all duration-700 ${
                  isPrimary ? "opacity-100" : "opacity-0"
                }`}
              >
                <h3 className="text-lg font-bold">
                  {isPrimary ? "Title of the News" : "Another News"}
                </h3>
                <p className="text-sm">
                  {isPrimary
                    ? "Short description about the news..."
                    : "Some other news description..."}
                </p>
              </div>
            </div>

            {/* Nút Previous và Next */}
            <div className="absolute left-0 right-0 flex justify-between px-4 -translate-y-1/2 top-1/2">
              <button
                className="p-2 text-white transition-all duration-500 bg-gray-300 rounded-full hover:bg-neutral-400"
                onClick={toggleImages}
              >
                <Icons.ChevronLeft />
              </button>

              <button
                className="p-2 text-white transition-all duration-500 bg-gray-300 rounded-full hover:bg-neutral-400"
                onClick={toggleImages}
              >
                <Icons.ChevronRight />
              </button>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-5 text-2xl text-center text-gradient-color md:text-4xl md:text-center">
            Popular Post
          </p>

          <div className="flex flex-col items-center justify-center gap-5 mb-5 md:flex-row">
            {/* Card 1 */}
            <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white transition-all duration-500 hover:scale-105 w-[90%] md:w-auto">
              <img className="object-cover w-full h-48" src={Images.News1} />
              <div className="p-4">
                <h2 className="text-lg font-semibold">
                  Opening Day Of Boating Season, Seattle WA
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Of course, the Puget Sound is very watery, and where there is
                  water, there are boats. Today is...
                </p>
              </div>
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

            {/* Card 2 */}
            <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white transition-all duration-500 hover:scale-105 w-[90%] md:w-auto">
              <img className="object-cover w-full h-48" src={Images.News2} />
              <div className="p-4">
                <h2 className="text-lg font-semibold">
                  Opening Day Of Boating Season, Seattle WA
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Of course, the Puget Sound is very watery, and where there is
                  water, there are boats. Today is...
                </p>
              </div>
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

            {/* Card 3 */}
            <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white transition-all duration-500 hover:scale-105 w-[90%] md:w-auto">
              <img className="object-cover w-full h-48" src={Images.News3} />
              <div className="p-4">
                <h2 className="text-lg font-semibold">
                  Opening Day Of Boating Season, Seattle WA
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Of course, the Puget Sound is very watery, and where there is
                  water, there are boats. Today is...
                </p>
              </div>
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

            {/* Card 4 */}
            <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white transition-all duration-500 hover:scale-105 w-[90%] md:w-auto">
              <img className="object-cover w-full h-48" src={Images.News1} />
              <div className="p-4">
                <h2 className="text-lg font-semibold">
                  Opening Day Of Boating Season, Seattle WA
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Of course, the Puget Sound is very watery, and where there is
                  water, there are boats. Today is...
                </p>
              </div>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default News;
