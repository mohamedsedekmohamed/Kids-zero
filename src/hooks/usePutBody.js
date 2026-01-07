// src/hooks/usePut.js
import { useState } from "react";
import api from "../api/api";
import { toast } from "react-hot-toast";

export default function usePutBody(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (body) => {
    try {
      setLoading(true);
      const res = await api.put(url, body);
      return res.data;
    }  catch (err) {
     const errorsObj = err.response?.data?.errors;

  if (errorsObj && typeof errorsObj === "object") {
    // جمع كل رسائل الأخطاء في Array واحدة
    const allErrors = Object.values(errorsObj).flat();

    // عرض كل خطأ في Toast لوحده
    allErrors.forEach((msg) => toast.error(msg));

    // أو لو حابب تخزنهم في state
    setError(allErrors)

      
      throw allErrors;
    } }finally {
      setLoading(false);
    }
  };

  return { putData, loading, error };
}