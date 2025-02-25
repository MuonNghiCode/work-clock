import React from "react";
import Icons from "../../components/icon";

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-100">
      <div className="w-[900px] bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-2">
        {/* Left Side - Contact Information */}
        <div className="bg-brand-grandient text-white p-8">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          <p className="mb-6">Say something to start a live chat!</p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span>
                <Icons.Phone />
              </span>
              <span>+1012 3456 789</span>
            </div>
            <div className="flex items-center space-x-3">
              <span>
                <Icons.Mail />
              </span>
              <span>demo@gmail.com</span>
            </div>
            <div className="flex items-start space-x-3">
              <span>
                <Icons.MapPin />
              </span>
              <span>
                Saigon Hitech Park, Phường Tân Phú, Thủ Đức, Hồ Chí Minh, Việt
                Nam
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gradient-color text-center mb-6">
            CONTACT US
          </h1>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  className="w-full border-b border-gray-400 p-1 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="w-full border-b border-gray-400 p-1 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full border-b border-gray-400 p-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                className="w-full border-b border-gray-400 p-1 focus:outline-none"
                defaultValue="+1 012 3456 789"
              />
            </div>

            <div>
              <label className="block text-gray-700">Message</label>
              <textarea
                className="w-full border-b border-gray-400 p-1 focus:outline-none"
                rows={3}
                placeholder="Write your message.."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-brand-grandient text-white py-2 px-6 rounded-full hover:bg-orange-500 transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
