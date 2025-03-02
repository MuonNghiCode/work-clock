import React from "react";

export const CircularBarsSpinnerLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="spinner-container">
        <div className="loading-spinner">
          <div style={{ background: '#FFB17A' }}></div>
          <div style={{ background: '#FF9147' }}></div>
          <div style={{ background: '#FFB17A' }}></div>
          <div style={{ background: '#FF9147' }}></div>
        </div>
      </div>
      <style>{`
        .spinner-container {
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          perspective: 800px;
          animation: spin 2s infinite linear;
        }
        .loading-spinner > div {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        .loading-spinner > div:nth-child(1) {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 0s;
        }
        .loading-spinner > div:nth-child(2) {
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          animation-delay: 0.2s;
        }
        .loading-spinner > div:nth-child(3) {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 0.4s;
        }
        .loading-spinner > div:nth-child(4) {
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          animation-delay: 0.6s;
        }
        @keyframes spin {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}; 