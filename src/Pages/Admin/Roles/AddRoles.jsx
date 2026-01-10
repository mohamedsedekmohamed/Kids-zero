import React, { useState } from "react";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const modules = [
  { name: "admins", actions: ["View", "Add", "Edit", "Delete", "Status"] },
  // { name: "buses", actions: ["View", "Add", "Edit"] },
  // { name: "drivers", actions: ["View"] },
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
              <div className="font-semibold mb-2">Model</div>
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
  name: formData.name,
  permissions: permissions
    .filter(p => p.actions.length > 0)
    .map(p => ({
      module: p.module,
      actions: p.actions.map(a => ({ action: a }))  // تحويل كل string لكائن
    }))
};


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
