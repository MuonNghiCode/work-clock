import React, { useState, useEffect } from "react";
import Images from "../../images";
import Icons from "../../icon";

const News: React.FC = () => {
  const [isPrimary, setIsPrimary] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

  const toggleImages = () => {
    setIsPrimary(!isPrimary);
  };

  // Khóa cuộn nền khi modal mở
  useEffect(() => {
    if (isModalOpen || isSecondModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen, isSecondModalOpen]);

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

  return (
    <>
      <div className="min-h-screen">
        {/* Phần Featured News */}
        <div className="flex flex-col items-center justify-center mb-5">
          <h1 className="text-3xl font-bold mb-6 text-center">
            News & Change Log
          </h1>

          {/* Desktop */}
          <div className="relative items-center justify-center hidden md:flex md:w-full w-6xl mt-7 gap-6">
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
                  src={Images.changelog}
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

          {/* Modal 1 */}
          {isModalOpen && (
            <div className="fixed inset-0  flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white overflow-y-auto h-20/21 w-14/15 p-6 rounded-xl shadow-2xl relative">
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
                  className="rounded-lg w-full h-2/3 object-cover mt-6 mb-4"
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
                  Additionally, we have introduced{" "}
                  <span className="font-bold text-red-500">
                    Real-Time Notifications
                  </span>{" "}
                  to keep users updated with important events and changes as
                  they happen. This ensures that you never miss critical
                  updates, whether it's a project milestone, a financial alert,
                  or an administrative task.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  The new{" "}
                  <span className="font-bold text-teal-500">
                    Customizable Dashboard
                  </span>{" "}
                  allows users to personalize their workspace, tailoring it to
                  their specific needs and preferences. This feature empowers
                  users to focus on what matters most, improving productivity
                  and satisfaction.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  For businesses, the{" "}
                  <span className="font-bold text-orange-500">
                    Advanced Analytics & Reporting
                  </span>{" "}
                  tools provide deeper insights into performance metrics,
                  enabling data-driven decision-making. With real-time data
                  visualization and detailed reports, businesses can identify
                  trends, track progress, and achieve their goals more
                  effectively.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  Security has also been a top priority in this update. We've
                  implemented{" "}
                  <span className="font-bold text-indigo-600">
                    Multi-Factor Authentication (MFA)
                  </span>{" "}
                  and upgraded our encryption protocols to ensure that user data
                  remains safe and secure. These enhancements provide peace of
                  mind for both individual users and organizations.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  Looking ahead, we are committed to continuous improvement and
                  innovation. Our roadmap includes exciting new features such as{" "}
                  <span className="font-bold text-pink-500">
                    AI-Powered Task Automation
                  </span>{" "}
                  and{" "}
                  <span className="font-bold text-yellow-500">
                    Enhanced Collaboration Tools
                  </span>{" "}
                  to further enhance the WorkClock experience.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  Thank you for being a part of our journey. We are excited to
                  bring you these updates and look forward to your feedback as
                  we continue to evolve and improve.
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

          {/* Modal 2 */}
          {isSecondModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white overflow-y-auto h-20/21 w-14/15 p-6 rounded-xl shadow-2xl relative">
                {/* Nút đóng */}
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold"
                  onClick={() => setIsSecondModalOpen(false)}
                >
                  ✖
                </button>

                {/* Ảnh tiêu đề */}
                <img
                  src={Images.group}
                  alt="News Banner"
                  className="rounded-lg w-full h-2/3 object-cover mt-6 mb-4"
                />

                {/* Tiêu đề */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-sans">
                  Happy March 8
                </h2>

                {/* Nội dung bài báo */}
                <p className="text-gray-700 leading-relaxed font-sans">
                  Today, the atmosphere in the
                  <span className="font-bold text-blue-600">
                    {" "}
                    [HCM25_CPL_REACT_03]
                  </span>{" "}
                  class is filled with joy as the male students come together to
                  organize a special celebration for the teacher and female
                  classmates on{" "}
                  <span className="text-red-500 font-semibold">
                    International Women's Day (March 8)
                  </span>
                  .
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  Heartfelt wishes and small but loving gifts have made this day
                  warmer than ever. Wishing all teachers and female students
                  always{" "}
                  <span className="font-semibold">
                    radiant, happy, and successful
                  </span>
                  !
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  The celebration began with a heartfelt speech from the{" "}
                  <span className="font-bold">class representative</span>,
                  expressing gratitude and admiration for the contributions of
                  the female students and the teacher. This was followed by a
                  series of fun activities, including games, singing, and
                  sharing stories that brought everyone closer together.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  A highlight of the event was the{" "}
                  <span className="font-bold">surprise gift presentation</span>,
                  where each female student and the teacher received a
                  beautifully wrapped gift along with a personalized note of
                  appreciation. These small gestures of kindness created an
                  atmosphere of warmth and unity within the class.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  The event concluded with a{" "}
                  <span className="font-bold">group photo session</span> to
                  capture the memorable moments of the day. Everyone left with
                  smiles on their faces, cherishing the bonds of friendship and
                  mutual respect that were strengthened through this
                  celebration.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed font-sans">
                  This celebration not only highlighted the importance of{" "}
                  <span className="font-bold">International Women's Day</span>{" "}
                  but also served as a reminder of the value of teamwork,
                  appreciation, and the joy of coming together as a community.
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
                    <p className="text-xs text-gray-500">March 8, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phần Popular Post */}
        <div>
          <p className="mb-5 text-2xl text-center text-gradient-color md:text-4xl md:text-center">
            Popular Post
          </p>

          <div className="flex flex-col items-center justify-center gap-15 mb-5 md:flex-row">
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
        </div>
      </div>
    </>
  );
};

export default News;
