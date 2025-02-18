import React from "react";
import Images from "../../components/images";
import { Link } from "react-router-dom";

const ErrorPage: React.FC = () => {
  return (
    <>
      <div className="error-page relative flex items-center justify-center min-h-screen overflow-hidden pb-10 bg-brand-orange-light">
        {/* <div
          className="absolute inset-0 bg-cover bg-center z-[-1]"
          style={{
            backgroundImage: `url(${Images.backgroundLayout})`,
            opacity: 0.2,
            backgroundSize: "cover",
            backgroundPosition: "bottom",
          }}
        ></div>{" "} */}
        <img
          src={Images.Error}
          alt="404"
          className="w-[60%] max-w-[400px] h-auto mb-6 md:max-w-[500px]"
        />
        <div
          className="absolute flex flex-col text-center gap-1"
          style={{ bottom: "10%" }}
        >
          <h1 className="text-5xl font-bold text-black mb-2">
            Oops, Page Not Found!
          </h1>
          <Link to="/" className="text-white">
            <button className="text-xl bg-brand-grandient p-2 rounded-2xl cursor-pointer">
              Return to Home Page
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
