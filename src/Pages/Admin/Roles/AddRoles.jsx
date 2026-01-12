import React, { useState } from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
  // { name: "zones", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  // { name: "cities", actions: ["View", "Add", "Edit", "Delete", "Status"] },
];


const AddRoles = () => {
  const navigate = useNavigate();
  const { postData, loading } = usePost("/api/admin/roles");

  const [permissions, setPermissions] = useState(
    modules.map((m) => ({
      module: m.name,
      actions: [],
    }))
  );

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

  const formSchema = [
    { name: "name", label: "Role Name", type: "text", required: true },
    {
      name: "permissions",
      label: "Permissions",
      type: "custom",
      fullWidth: true,
      render: () => (
        <div className="space-y-4">
          {modules.map((mod) => (
            <div key={mod.name} className="border p-3 rounded-lg bg-gray-50">
              <div className="font-semibold mb-2">{mod.name}</div>
              <div className="flex gap-4 flex-wrap">
                {mod.actions.map((action) => {
                  const checked = permissions.find((p) => p.module === mod.name)?.actions.includes(action);
                  return (
                    <label key={action} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => handleActionChange(mod.name, action, e.target.checked)}
                      />
                      <span>{action}</span>
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

  const handleSave = async (formData) => {
  try {
    const payload = {
      name: formData.name, // اسم الـ Role المدخل في الفورم
      permissions: permissions
        // 1. نفلتر الموديولات اللي مفيش فيها أي أكشن مختار
        .filter((p) => p.actions.length > 0)
        // 2. نحول شكل البيانات للمطلوب
        .map((p) => ({
          module: p.module,
          actions: p.actions.map((actionName) => ({
            action: actionName,
          })),
        })),
    };

    console.log("Payload to send:", payload); // للتأكد من الشكل قبل الإرسال

    await postData(payload, null, "Role added successfully!");
    navigate("/admin/roles");
  } catch (err) {
    console.error(err);
    toast.error("Failed to add role");
  }
};

  return (
    <AddPage
      title="Add New Role"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/roles")}
      loading={loading}
    />
  );
};

export default AddRoles;
