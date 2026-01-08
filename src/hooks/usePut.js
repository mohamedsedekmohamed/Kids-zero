import { useState } from "react";
import api from "../api/api";
import { toast } from "react-hot-toast";

export default function usePut(defaultUrl = "") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (body = {}, customUrl = null, toastMessage = null) => {
    try {
      setLoading(true);
      setError(null);

      const url = customUrl || defaultUrl;
      const res = await api.put(url, body);

      if (toastMessage) toast.success(toastMessage);

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
