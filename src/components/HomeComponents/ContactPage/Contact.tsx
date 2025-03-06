import React from "react";
import emailjs from "@emailjs/browser";
import Icons from "../../icon";
import { toast } from "react-toastify";

const Contact: React.FC = () => {
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const templateParams = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    emailjs
      .send(
        "service_l9qbtvf",
        "template_sg5shq7",
        templateParams,
        "EV-tXrDmzrcr5DOwr"
      )
      .then((response) => {
        console.log("Email sent successfully!", response.status, response.text);
        toast.success("Email sent successfully!");
      })
      .catch((error) => {
        console.error("Failed to send email:", error);
        toast.error("Failed to send email");
      });
    e.currentTarget.reset();
  };

  const sendRequestEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const templateParams = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      cc_email: "tylum123@gmail.com, meme91men@gmail.com",
    };

    emailjs
      .send(
        "service_05enpzu",
        "template_661t2y1",
        templateParams,
        "EV-tXrDmzrcr5DOwr"
      )
      .then((response) => {
        console.log(
          "Request email sent successfully!",
          response.status,
          response.text
        );
      })
      .catch((error) => {
        console.error("Failed to send request email:", error);
      });
    e.currentTarget.reset();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendEmail(e);
    sendRequestEmail(e);
  };

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
            <p className="mb-6">Start a live chat with us!</p>
            <div className="space-y-4">
              <div className="flex items-center justify-start space-x-3 md:justify-start">
                <span>
                  <Icons.Phone />
                </span>
                <span>+84 1012 3456 789</span>
              </div>
              <div className="flex items-center justify-start space-x-3 md:justify-start">
                <span>
                  <Icons.Mail />
                </span>
                <span>contact@workclock.com</span>
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

          <div className="p-6 md:p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-gray-700">First Name</label>
                  <div className="flex items-center space-x-2">
                    <Icons.User className="text-gray-500" />
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      className="w-full p-2 border-b border-gray-300 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">Last Name</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      className="w-full p-2 border-b border-gray-300 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700">Email</label>
                <div className="flex items-center space-x-2">
                  <Icons.Mail className="text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 border-b border-gray-300 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700">Phone Number</label>
                <div className="flex items-center space-x-2">
                  <Icons.Phone className="text-gray-500" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full p-2 border-b border-gray-300 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700">Message</label>
                <div className="flex items-center space-x-2">
                  <textarea
                    name="message"
                    placeholder="Write your message.."
                    className="w-full p-2 border-b border-gray-300 focus:outline-none"
                    rows={3}
                    required
                  ></textarea>
                </div>
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
