import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddPickuppoints = () => {
  const { postData, loading } = usePost("/api/admin/pickuppoints");
    const { data: zoneData } = useGet("/api/admin/students/selection");
   const zoneOptions =
    zoneData?.data?.zones?.map((p) => ({
      value: p.id,
      label: `${p.name}-cost(${p.cost})`,
    })) || [];
  const navigate = useNavigate();

  /* ================= Form Schema ================= */
const formSchema = [
  { name: "name", label: "Pickup Point Name", type: "text", placeholder: "Enter name", required: true },
  { name: "address", label: "Address", type: "text", placeholder: "Enter address", required: true },
  { name: "lat", label: "Latitude", type: "text", placeholder: "24.7136", required: true },
  { name: "lng", label: "Longitude", type: "text", placeholder: "46.6753", required: true },
   {
     name: "zoneId",
     label: "Select Zone",
     type: "autocomplete",
     options: zoneOptions,
     required: true,
     fullWidth: true,
   },
  { name: "map", type: "map",      fullWidth: true,
    
 },
];


  /* ================= Save Handler ================= */
  const handleSave = async (data) => {
    try {
      const payload = {
        name: data.name,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        zoneId: data.zoneId.value,
      };

      await postData(payload, null, "Pickup point added successfully!");
      navigate("/admin/pickuppoints");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add pickup point");
    }
  };

  return (
    <AddPage
      title="Add Pickup Point"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/pickuppoints")}
      loading={loading}
    />
  );
};

export default AddPickuppoints;
