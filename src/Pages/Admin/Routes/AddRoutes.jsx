import React from "react";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddRoutes = () => {
  const navigate = useNavigate();
  const { data: pickupPointsData } = useGet("/api/admin/pickuppoints");
  const { postData, loading } = usePost("/api/admin/routes");

  // تحويل البيانات لجعلها مناسبة لـ react-select
  const pickupOptions =
    pickupPointsData?.data?.pickupPoints?.map((p) => ({
      value: p.id,
      label: `${p.name} - ${p.address}`,
    })) || [];


  const formSchema = [
    { name: "name", label: "Route Name", type: "text", required: true },
    { name: "description", label: "Description", type: "text", required: true },
  {
  name: "pickupPoints",
  label: "Pickup Points",
  type: "custom",
  required: true,
  fullWidth: true,
  render: ({ value = [], onChange }) => {
    // نقل عنصر لأعلى
    const moveUp = (index) => {
      if (index === 0) return;
      const newPoints = [...value];
      [newPoints[index - 1], newPoints[index]] = [newPoints[index], newPoints[index - 1]];
      onChange(newPoints);
    };

    // نقل عنصر لأسفل
    const moveDown = (index) => {
      if (index === value.length - 1) return;
      const newPoints = [...value];
      [newPoints[index + 1], newPoints[index]] = [newPoints[index], newPoints[index + 1]];
      onChange(newPoints);
    };

    // إزالة عنصر
    const remove = (index) => {
      const newPoints = [...value];
      newPoints.splice(index, 1);
      onChange(newPoints);
    };

    return (
      <div className="space-y-4">
        <Select
          options={pickupOptions}
          isMulti
          value={value}
          onChange={(selected) =>
            onChange(
              selected.map((p, idx) => ({
                ...p,
                stopOrder: idx + 1,
              }))
            )
          }
          placeholder="Select pickup points"
        />

        {/* قائمة النقاط المختارة */}
        {value.length > 0 && (
          <div className="mt-2 space-y-2">
            {value.map((point, index) => (
              <div
                key={point.value}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="font-medium">{point.label}</div>

                <div className="flex items-center gap-2">
                  {/* أسهم للأعلى والأسفل */}
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className={`p-1 rounded hover:bg-gray-200 transition ${index === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === value.length - 1}
                    className={`p-1 rounded hover:bg-gray-200 transition ${index === value.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    ▼
                  </button>

                  {/* زر إزالة */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
}

  ];

  const handleSave = async (formData) => {
  try {
    if (!formData.pickupPoints || !formData.pickupPoints.length) {
      toast.error("Please select at least one pickup point");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      pickupPoints: formData.pickupPoints.map((p, index) => ({
        pickupPointId: p.value,
        stopOrder: index + 1,
      })),
    };

    await postData(payload, null, "Route added successfully!");
    toast.success("Route added successfully!");
    navigate("/admin/routes");
  } catch (err) {
    console.error(err);
    toast.error("Failed to add route");
  }
};

  return (
    <AddPage
      title="Add New Route"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/routes")}
      loading={loading}
    />
  );
};

export default AddRoutes;
