import React, { useState } from "react";
import Images from "../../images";
import Icons from "../../icon";

const News: React.FC = () => {
  // Tạo mảng chứa thông tin các ảnh cho Featured News
  const newsItems = [
    {
      id: 1,
      image: Images.Work1,
      title: "Title of the News",
      description: "Short description about the news...",
    },
    {
      id: 2,
      image: Images.News1,
      title: "Another News",
      description: "Some other news description...",
    },
    // Có thể thêm các mục tin tức khác nếu cần
  ];

  // Tạo mảng chứa thông tin cho Popular Posts
  const popularPosts = [
    {
      id: 1,
      image: Images.News1,
      title: "Opening Day Of Boating Season, Seattle WA",
      description:
        "Of course, the Puget Sound is very watery, and where there is water, there are boats. Today is...",
      authorImage: Images.Auther1,
      authorName: "James",
      date: "August 18, 2022",
    },
    {
      id: 2,
      image: Images.News2,
      title: "Opening Day Of Boating Season, Seattle WA",
      description:
        "Of course, the Puget Sound is very watery, and where there is water, there are boats. Today is...",
      authorImage: Images.Auther2,
      authorName: "James",
      date: "August 18, 2022",
    },
    {
      id: 3,
      image: Images.News3,
      title: "Opening Day Of Boating Season, Seattle WA",
      description:
        "Of course, the Puget Sound is very watery, and where there is water, there are boats. Today is...",
      authorImage: Images.Auther3,
      authorName: "James",
      date: "August 18, 2022",
    },
  ];

  // Thay vì isPrimary, sử dụng currentIndex để xác định ảnh hiện tại
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hàm chuyển đến ảnh tiếp theo
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  };

  // Hàm chuyển đến ảnh trước đó
  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length
    );
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Phần Featured News */}
        <div className="flex flex-col items-center justify-center mb-5">
          <div className="flex items-end justify-center mt-5 ml-2 text-3xl text-gradient-color md:text-6xl">
            Featured News
          </div>

          {/* Desktop */}
          <div className="relative items-center justify-center hidden gap-6 md:flex md:w-full w-6xl mt-7">
            {/* Nút Previous */}
            <button
              className="absolute z-10 p-2 text-white transition-all duration-500 bg-gray-300 rounded-full left-15 hover:bg-neutral-400"
              onClick={prevImage}
            >
              <Icons.ChevronLeft />
            </button>

            {/* Hiển thị tất cả các ảnh với trạng thái phù hợp */}
            {newsItems.map((item, index) => {
              const isPrimary = index === currentIndex;
              const nextIndex = (index + 1) % newsItems.length;
              const isSecondary = nextIndex === currentIndex;

              // Chỉ hiển thị ảnh hiện tại và ảnh kế tiếp
              if (!isPrimary && !isSecondary) return null;

              return (
                <div
                  key={item.id}
                  className={`relative transition-all duration-500 hover:scale-105`}
                >
                  <img
                    className={`rounded-[20px] box-shadow-brand-orange transition-all duration-500 object-cover ${
                      isPrimary
                        ? "w-[800px] h-[450px] opacity-100"
                        : "w-[500px] h-[450px] opacity-50"
                    }`}
                    src={item.image}
                    alt={item.title}
                  />
                  <div className="absolute bottom-5 left-5 bg-white/50 text-zinc-900 p-4 rounded-lg w-[90%]">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
              );
            })}

            {/* Nút Next */}
            <button
              className="absolute z-10 p-2 text-white transition-all duration-500 bg-gray-300 rounded-full right-15 hover:bg-neutral-400"
              onClick={nextImage}
            >
              <Icons.ChevronRight />
            </button>
          </div>

          {/* Mobile */}
          <div className="relative block w-full mt-5 overflow-hidden md:hidden">
            {/* Ảnh cho mobile */}
            <div className="relative w-full h-[400px]">
              {newsItems.map((item, index) => (
                <img
                  key={item.id}
                  className={`absolute top-0 left-0 w-full h-[400px] rounded-[20px] box-shadow-brand-orange object-cover transition-all duration-700 ease-in-out ${
                    index === currentIndex
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-full"
                  }`}
                  src={item.image}
                  alt={item.title}
                />
              ))}

              {/* Phần text */}
              <div className="absolute bottom-5 left-5 bg-white/50 text-zinc-900 p-4 rounded-lg w-[90%] transition-all duration-700">
                <h3 className="text-lg font-bold">
                  {newsItems[currentIndex].title}
                </h3>
                <p className="text-sm">{newsItems[currentIndex].description}</p>
              </div>
            </div>

            {/* Nút Previous và Next */}
            <div className="absolute left-0 right-0 flex justify-between px-4 -translate-y-1/2 top-1/2">
              <button
                className="p-2 text-white transition-all duration-500 bg-gray-300 rounded-full hover:bg-neutral-400"
                onClick={prevImage}
              >
                <Icons.ChevronLeft />
              </button>

              <button
                className="p-2 text-white transition-all duration-500 bg-gray-300 rounded-full hover:bg-neutral-400"
                onClick={nextImage}
              >
                <Icons.ChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Phần Popular Post */}
        <div>
          <p className="mb-5 text-2xl text-center text-gradient-color md:text-4xl md:text-center">
            Popular Post
          </p>

          <div className="flex flex-col items-center justify-center mb-5 gap-15 md:flex-row">
            {/* Render Popular Posts */}
            {popularPosts.map((post) => (
              <div
                key={post.id}
                className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white transition-all duration-500 hover:scale-105 w-[90%] md:w-auto mb-6 md:mb-0"
              >
                <img
                  className="object-cover w-full h-48"
                  src={post.image}
                  alt={post.title}
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    {post.description}
                  </p>
                </div>
                <div className="flex items-center justify-between p-4 border-t bg-zinc-200">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={post.authorImage}
                      alt="Author"
                    />
                    <div>
                      <p className="text-sm font-medium">{post.authorName}</p>
                      <p className="text-xs text-gray-400">{post.date}</p>
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
            ))}
          </div>

          {/* Circular Gallery */}
          {/* <CircularGallery
            items={popularPosts.map((post) => ({
              image: post.image,
              text: post.title,
            }))}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            font="bold 30px DM Sans"
          /> */}
        </div>
      </div>
    </>
  );
};

export default News;
