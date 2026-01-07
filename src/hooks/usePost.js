import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/api";

export default function usePost(defaultUrl = "") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const postData = async (body = {}, customUrl = null, toastMessage = "Success") => {
    try {
      setLoading(true);

      const url = String(customUrl || defaultUrl);

  
      const res = await api.post(url, body);

      // ✅ استخدم النص اللي وصل من props
      toast.success(toastMessage);

      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors ||
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "فشل الطلب";

      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
}
