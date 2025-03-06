import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularBarsSpinnerLoader } from "../../components/common/Spinner";
import { motion, AnimatePresence } from "framer-motion";
import { verifyToken, resendToken } from "../../services/authService";
import Icons from "../../components/icon";
const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying email...");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [resendEmail, setResendEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          setMessage(
            "Invalid token. Please enter your email to receive a new one."
          );
          setIsSuccess(false);
          setIsLoading(false);
          return;
        }

        const verifyResponse = await verifyToken(token);

        setMessage(verifyResponse.message || "Email verified successfully!");
        setIsSuccess(verifyResponse.success);

        if (verifyResponse.success) {
          setTimeout(() => {
            setIsRedirecting(true);
            setTimeout(() => navigate("/login"), 800);
          }, 2000);
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Verification failed";
        setMessage(errorMessage);
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifyEmail();
  }, [token, navigate]);

  const handleResendToken = async () => {
    if (!resendEmail) {
      setResendMessage("Please enter your email.");
      return;
    }

    try {
      const response = await resendToken(resendEmail);
      setResendMessage(
        response.message || "Token has been resent. Please check your email."
      );
    } catch (error: any) {
      setResendMessage(
        error.response?.data?.message || "Resending token failed."
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center min-h-screen bg-orange-50"
    >
      <AnimatePresence mode="wait">
        {isRedirecting ? (
          <motion.div
            key="redirecting"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-orange-50 bg-opacity-90 z-50"
          >
            <div className="text-center">
              <CircularBarsSpinnerLoader />
              <p className="mt-4 text-orange-600 font-medium">
                Redirecting to login...
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">
              Email Verification
            </h2>

            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-6"
              >
                <CircularBarsSpinnerLoader />
                <p className="mt-4 text-gray-600 text-center">{message}</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`p-6 rounded-lg ${
                  isSuccess ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      duration: 0.5,
                    }}
                  >
                    {isSuccess ? (
                      <svg
                        className="w-12 h-12 text-green-500 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-12 h-12 text-red-500 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    )}
                  </motion.div>
                  <p
                    className={`text-center ${
                      isSuccess ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {message}
                  </p>

                  {!isSuccess && !isLoading && (
                    <div className="mt-4 w-full">
                      <div className="relative">
                        <input
                          type="email"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter your email to receive a new token"
                          value={resendEmail}
                          onChange={(e) => setResendEmail(e.target.value)}
                        />
                        <Icons.Mail className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                      <button
                        className="mt-3 w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                        onClick={handleResendToken}
                      >
                        Resend Token
                      </button>
                      {resendMessage && (
                        <p className="text-sm text-center mt-2 text-red-600">
                          {resendMessage}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(VerifyEmail);
