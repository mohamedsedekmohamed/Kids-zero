import React, { useEffect, useState } from "react";
import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

// القائمة المعتمدة من السيرفر بناءً على الخطأ السابق
const modules = [
  { name: "admins", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  { name: "roles", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  { name: "bus_types", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  { name: "buses", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  { name: "drivers", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  { name: "codrivers", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  { name: "pickup_points", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  { name: "routes", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  { name: "rides", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  { name: "notes", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  { name: "reports", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  { name: "settings", actions: ["View", "Add", "Edit", "Delete", "Status"] },
];

const EditRoles = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // جلب البيانات الحالية للـ Role
  const { data, loading: loadingGet } = useGet(`/api/admin/roles/${id}`);
  const { putData, loading: loadingPut } = usePut(`/api/admin/roles/${id}`);

  const [permissions, setPermissions] = useState([]);

  // تحديث حالة الـ permissions عند وصول البيانات من السيرفر
  useEffect(() => {
    if (data?.data?.role) {
      const serverPermissions = data.data.role.permissions || [];
      
      // نقوم بإنشاء الحالة بناءً على قائمة الموديولات الشاملة
      const initialPermissions = modules.map((m) => {
        const found = serverPermissions.find((p) => p.module === m.name);
        return {
          module: m.name,
          // استخراج أسماء الأكشنز فقط من المصفوفة المعقدة القادمة من السيرفر
          actions: found ? found.actions.map((a) => a.action) : [],
        };
      });
      setPermissions(initialPermissions);
    }
  }, [data]);

  const handleActionChange = (moduleName, action, checked) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.module === moduleName
          ? {
              ...perm,
              actions: checked
                ? [...perm.actions, action]
                : perm.actions.filter((a) => a !== action),
            }
          : perm
      )
    );
  };

  const handleSave = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        permissions: permissions
          .filter((p) => p.actions.length > 0)
          .map((p) => ({
            module: p.module,
            actions: p.actions.map((a) => ({ action: a })),
          })),
        status: formData.status
      };

      await putData(payload);
      toast.success("Role updated successfully!");
      navigate("/admin/roles");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  if (loadingGet) return <div className="flex justify-center items-center h-screen"><Loading /></div>;

  const roleData = data?.data?.role;

  const formSchema = [
    { 
      name: "name", 
      label: "Role Name", 
      type: "text", 
      required: true 
    },
   
    {
      name: "permissions",
      label: "Permissions",
      type: "custom",
      fullWidth: true,
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod) => (
            <div key={mod.name} className="border p-4 rounded-lg bg-white shadow-sm">
              <div className="font-bold text-blue-600 mb-3 capitalize">
                {mod.name.replace("_", " ")}
              </div>
              <div className="flex gap-3 flex-wrap">
                {mod.actions.map((action) => {
                  const isChecked = permissions
                    .find((p) => p.module === mod.name)
                    ?.actions.includes(action);
                  return (
                    <label key={action} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-2 py-1 rounded hover:bg-gray-100">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={!!isChecked}
                        onChange={(e) => handleActionChange(mod.name, action, e.target.checked)}
                      />
                      <span className="text-sm">{action}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <AddPage
      title="Edit Role"
      fields={formSchema}
      initialData={{
        name: roleData?.name || "",
        status: roleData?.status || "active",
      }}
      onSave={handleSave}
      onCancel={() => navigate("/admin/roles")}
      loading={loadingPut}
    />
  );
};

export default EditRoles;