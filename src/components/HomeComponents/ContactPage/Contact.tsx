import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Icons from "../../icon";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

// Component Form riêng với ReCaptcha
const ContactForm = () => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmail = async (templateParams: any) => {
    try {
      await emailjs.send(
        "service_l9qbtvf",
        "template_sg5shq7",
        templateParams,
        "EV-tXrDmzrcr5DOwr"
      );
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("Failed to send email");
    }
  };

  const sendRequestEmail = async (templateParams: any) => {
    try {
      await emailjs.send(
        "service_05enpzu",
        "template_661t2y1",
        {
          ...templateParams,
          cc_email:
            "tylum123@gmail.com, meme91men@gmail.com, phamdanh0305@gmail.com, miruhinana@gmail.com, haitrilehuu@gmail.com, kietvippro123009@gmail.com, nguyenducthinh06092004@gmail.com, buiquangvinhvt2709@gmail.com, minhquanpm1610@gmail.com,",
        },
        "aH8eHJqYKgYrG2SB8"
      );
      toast.success("Request email sent successfully!");
    } catch (error) {
      console.error("Failed to send request email:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = recaptchaRef.current?.getValue();
    if (!token) {
      toast.error("Please complete the reCAPTCHA");
      return;
    }

    const templateParams = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    };

    await sendEmail(templateParams);
    await sendRequestEmail(templateParams);

    // Reset form fields and reCAPTCHA
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      message: "",
    });
    recaptchaRef.current?.reset();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-gray-700">First Name</label>
          <div className="flex items-center space-x-2">
            <Icons.User className="text-gray-500" />
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
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
              value={formData.last_name}
              onChange={handleChange}
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
            value={formData.email}
            onChange={handleChange}
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
            value={formData.phone}
            onChange={handleChange}
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
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message.."
            className="w-full p-2 border-b border-gray-300 focus:outline-none"
            rows={3}
            required
          ></textarea>
        </div>
      </div>

      <div className="flex justify-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={
            import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
            "6LdZXgErAAAAAJb7fOPM8XeojiNLQV7Ih-MKVKHy"
          }
          theme="light"
        />
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
  );
};

// Main component
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
                <div className="flex flex-col">
                  <span className="text-sm">
                    Saigon Hitech Park, Phường Tân Phú, Thủ Đức, Hồ Chí Minh,
                    Việt Nam
                  </span>
                  <div className="w-full h-48 mt-2 overflow-hidden rounded-lg">
                    <iframe
                      title="WorkClock Office Location"
                      src="https://maps.google.com/maps?q=10.850889,106.798331&hl=vi&z=18&ie=UTF8&t=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
