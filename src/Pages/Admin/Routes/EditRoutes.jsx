  import React, { useState, useEffect } from "react";
  import AddPage from "@/components/AddPage";
  import useGet from "@/hooks/useGet";
  import usePut from "@/hooks/usePut";
  import toast from "react-hot-toast";
  import { useNavigate, useParams } from "react-router-dom";
  import Select from "react-select";
import Loading from "@/Components/Loading";

  const EditRoutes = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: pickupPointsData } = useGet("/api/admin/pickuppoints");
    const { data: routeData, loading: loadingRoute } = useGet(`/api/admin/routes/${id}`);
    const { putData, loading: loadingPut } = usePut("");

    const [initialData, setInitialData] = useState(null);

    // تحويل بيانات النقاط للاستخدام في react-select مع stopOrder
    useEffect(() => {
      if (routeData?.data?.route) {
        const route = routeData.data.route;
        setInitialData({
          name: route.name,
          description: route.description,
          pickupPoints: route.pickupPoints
            .sort((a, b) => a.stopOrder - b.stopOrder)
            .map((p) => ({
              value: p.pickupPoint.id,
              label: `${p.pickupPoint.name} - ${p.pickupPoint.address}`,
              stopOrder: p.stopOrder,
            })),
        });
      }
    }, [routeData]);

    // تحويل بيانات نقاط الوقوف للاستخدام في react-select
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
          const moveUp = (index) => {
            if (index === 0) return;
            const newPoints = [...value];
            [newPoints[index - 1], newPoints[index]] = [newPoints[index], newPoints[index - 1]];
            onChange(newPoints);
          };
          const moveDown = (index) => {
            if (index === value.length - 1) return;
            const newPoints = [...value];
            [newPoints[index + 1], newPoints[index]] = [newPoints[index], newPoints[index + 1]];
            onChange(newPoints);
          };
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
                      stopOrder: value[idx]?.stopOrder || idx + 1,
                    }))
                  )
                }
                placeholder="Select pickup points"
              />

              {value.length > 0 && (
                <div className="mt-2 space-y-2">
                  {value.map((point, index) => (
                    <div
                      key={point.value}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="font-medium">{point.label}</div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className={`p-1 rounded hover:bg-gray-200 transition ${
                            index === 0 ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDown(index)}
                          disabled={index === value.length - 1}
                          className={`p-1 rounded hover:bg-gray-200 transition ${
                            index === value.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          ▼
                        </button>
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
      },
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

        await putData(payload, `/api/admin/routes/${id}`, "Route updated successfully!");
        navigate("/admin/routes");
      } catch (err) {
        console.error(err);
        toast.error("Failed to update route");
      }
    };

    if (!initialData || loadingRoute) return <div><Loading/></div>;

    return (
      <AddPage
        title="Edit Route"
        fields={formSchema}
        initialData={initialData}
        onSave={handleSave}
        onCancel={() => navigate("/admin/routes")}
        loading={loadingPut}
      />
    );
  };

  export default EditRoutes;
