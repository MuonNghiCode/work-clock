import { useEffect } from "react";
import { toast } from "react-toastify";

const useToastStorage = () => {
  useEffect(() => {
    const toastData = sessionStorage.getItem("toastMessage");
    console.log("Reading toastMessage:", toastData); 
    if (toastData) {
      const { type, message } = JSON.parse(toastData);
      
      if (type === "success") toast.success(message);
      else if (type === "error") toast.error(message);

      setTimeout(() => {
        sessionStorage.removeItem("toastMessage");
        console.log("toastMessage removed!"); 
      }, 2000); 
    }
  }, []);
};

export default useToastStorage;
