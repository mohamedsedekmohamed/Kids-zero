import { useState } from "react";
import api from "../api/api";
import { toast } from "react-hot-toast";

export default function usePut(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // قمنا بتغيير اسم المعامل من body إلى params
  const putData = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      
      const queryString = new URLSearchParams(params).toString();
      const finalUrl = queryString ? `${url}?${queryString}` : url;

      
      const res = await api.put(finalUrl, {}); 
      
      return res.data;
    } catch (err) {
      const errorsObj = err.response?.data?.errors;
      if (errorsObj && typeof errorsObj === "object") {
        const allErrors = Object.values(errorsObj).flat();
        allErrors.forEach((msg) => toast.error(msg));
        setError(allErrors);
        throw allErrors;
      }
      const generalError = err.response?.data?.message || "حدث خطأ ما";
      toast.error(generalError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { putData, loading, error };
}