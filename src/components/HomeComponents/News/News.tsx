import React, { useState } from "react";
import Images from "../../images";
import Icons from "../../icon";

const News: React.FC = () => {
  const [isPrimary, setIsPrimary] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

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
            <button
              onClick={() => isPrimary && setIsModalOpen(true)}
              disabled={!isPrimary}
            >
              <div className="mr-[25px] relative transition-all duration-500 hover:scale-105">
                <img
                  className={`rounded-[20px] box-shadow-brand-orange transition-all duration-500 object-cover ${
                    isPrimary
                      ? "w-[800px] h-[450px] opacity-100"
                      : "w-[500px] h-[450px] opacity-50"
                  }`}
                  src={Images.News1}
                  alt=""
                />
                <div className="absolute bottom-5 left-5 bg-white/50 text-zinc-900 p-4 rounded-lg w-[90%]">
                  <h3 className="text-xl font-bold font-sans text-gray-800">
                    Change Log
                  </h3>

                  <p className="text-sm font-sans">
                    Webs now have a new features, check it out!
                  </p>
                </div>
              </div>
            </button>

            {/* Ảnh phụ */}
            <button
              onClick={() => !isPrimary && setIsSecondModalOpen(true)}
              disabled={isPrimary}
            >
              <div className="relative transition-all duration-500 hover:scale-105">
                <img
                  className={`rounded-[20px] box-shadow-brand-orange transition-all duration-500 object-cover ${
                    isPrimary
                      ? "w-[500px] h-[450px] opacity-50"
                      : "w-[800px] h-[450px] opacity-100"
                  }`}
                  src={Images.news2}
                  alt=""
                />
                <div className="absolute bottom-5 left-5 bg-white/50 text-zinc-900 p-4 rounded-lg w-[90%]">
                  <h3 className="text-lg font-bold font-sans">Happy March 8</h3>
                  <p className="text-sm font-sans">
                    Today, the atmosphere in class...
                  </p>
                </div>
              </div>
            </button>

            {/* Nút Next */}
            <button
              className="absolute z-10 p-2 text-white transition-all duration-500 bg-gray-300 rounded-full right-15 hover:bg-neutral-400"
              onClick={toggleImages}
            >
              <Icons.ChevronRight />
            </button>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white max-w-3xl w-full p-6 rounded-xl shadow-2xl relative">
                {/* Nút đóng */}
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✖
                </button>

                {/* Ảnh tiêu đề */}
                <img
                  src={Images.Logo}
                  alt="News Banner"
                  className="rounded-lg w-full h-56 object-cover mb-4"
                />

                {/* Tiêu đề */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-sans">
                  WorkClock New Features
                </h2>

                {/* Nội dung bài báo */}
                <p className="text-gray-700 leading-relaxed font-sans">
                  The new features of{" "}
                  <span className="font-bold text-amber-600">WorkClock</span>{" "}
                  are now live, enhancing user experience with greater
                  convenience and efficiency.
                </p>

                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  Key updates include{" "}
                  <span className="font-bold text-blue-600">
                    Admin Management CRUD
                  </span>
                  ,{" "}
                  <span className="font-bold text-green-600">
                    Project Management CRUD
                  </span>
                  , and{" "}
                  <span className="font-bold text-purple-600">
                    Finance Status Control
                  </span>
                  . These features simplify user management, streamline
                  projects, and optimize finances.
                </p>

                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  <span className="font-bold text-amber-600">WorkClock</span>{" "}
                  continues to enhance productivity and business operations.
                </p>

                {/* Footer - Tác giả */}
                <div className="mt-6 flex items-center border-t pt-4">
                  <img
                    src={Images.auth}
                    alt="Author"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-gray-900 font-medium">
                      Wrote by <span className="font-bold">Admin</span>
                    </p>
                    <p className="text-xs text-gray-500">March 10, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isSecondModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white max-w-3xl w-full p-6 rounded-xl shadow-2xl relative">
                {/* Nút đóng */}
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold"
                  onClick={() => setIsSecondModalOpen(false)}
                >
                  ✖
                </button>

                {/* Ảnh tiêu đề */}
                <img
                  src={Images.group} // Cập nhật ảnh tiêu đề nếu cần
                  alt="News Banner"
                  className="rounded-lg w-full h-56 object-cover mb-4"
                />

                {/* Tiêu đề */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-sans">
                  Happy March 8
                </h2>

                {/* Nội dung bài báo */}
                <p className="text-gray-700 leading-relaxed font-sans">
                  Today, the atmosphere in the
                  <span className="font-bold"> [HCM25_CPL_REACT_03]</span> class
                  is filled with joy as the male students come together to
                  organize a special celebration for the teacher and female
                  classmates on {""}
                  <span className="text-red-400">
                    International Women's Day (March 8)
                  </span>
                  .
                </p>

                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  Heartfelt wishes and small but loving gifts have made this day
                  warmer than ever. Wishing all teachers and female students
                  always radiant, happy, and successful!
                </p>

                {/* Footer - Tác giả */}
                <div className="mt-6 flex items-center border-t pt-4">
                  <img
                    src={Images.auth} // Cập nhật ảnh tác giả nếu cần
                    alt="Author"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-gray-900 font-medium">
                      Wrote by <span className="font-bold">Admin</span>
                    </p>
                    <p className="text-xs text-gray-500">March 8, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
