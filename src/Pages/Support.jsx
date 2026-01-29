import React, { useEffect, useState } from "react";

const Support = () => {
  const [policy, setPolicy] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const response = await fetch("https://Bcknd.Kidsero.com/api/information/support");
        const result = await response.json();

        if (result.success) {
          setPolicy(result.data.support);
        }
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacy();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Support </h1>

      <div className="whitespace-pre-line text-gray-700 leading-7">
        {policy}
      </div>
    </div>
  );
};


export default Support