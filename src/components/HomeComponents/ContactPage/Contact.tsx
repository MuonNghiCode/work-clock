import React from "react";
import Icons from "../../icon";

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen px-4 py-6 md:px-0">
      <h1 className="text-3xl font-bold text-center md:text-5xl text-gradient-color">
        CONTACT US
      </h1>
      <div className="flex items-center justify-center min-h-screen">
        <div className="grid w-full grid-cols-1 overflow-hidden bg-white shadow-lg md:grid-cols-2 md:max-w-6xl rounded-xl">
          {/* Left Side - Contact Information */}
          <div className="p-6 text-center text-white md:p-8 bg-brand-grandient md:text-left">
            <h2 className="mb-4 text-xl font-bold md:text-2xl">
              Contact Information
            </h2>
            <p className="mb-6">Say something to start a live chat!</p>
            <div className="space-y-4">
              <div className="flex items-center justify-start space-x-3 md:justify-start">
                <span>
                  <Icons.Phone />
                </span>
                <span>+1012 3456 789</span>
              </div>
              <div className="flex items-center justify-start space-x-3 md:justify-start">
                <span>
                  <Icons.Mail />
                </span>
                <span>demo@gmail.com</span>
              </div>
              <div className="flex items-start justify-start space-x-3 md:justify-start">
                <span>
                  <Icons.MapPin />
                </span>
                <span className="text-sm">
                  Saigon Hitech Park, Phường Tân Phú, Thủ Đức, Hồ Chí Minh, Việt
                  Nam
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-6 md:p-8">
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-gray-700">First Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border-b border-gray-300 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Last Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border-b border-gray-300 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border-b border-gray-300 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  className="w-full p-2 border-b border-gray-300 focus:outline-none"
                  required
                  defaultValue="+1 012 3456 789"
                />
              </div>

              <div>
                <label className="block text-gray-700">Message</label>
                <textarea
                  className="w-full p-2 border-b border-gray-300 focus:outline-none"
                  rows={3}
                  placeholder="Write your message.."
                  required
                ></textarea>
              </div>

              <div className="flex justify-center md:justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 text-white transition rounded-full bg-brand-grandient hover:bg-orange-500"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
