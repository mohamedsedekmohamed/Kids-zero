import React, { useState, useEffect } from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet"; // افتراضياً موجود
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddRoles = () => {
  const navigate = useNavigate();
  const { postData, loading } = usePost("/api/admin/roles");

  // جلب البيانات من الـ API
  const { data: selectionData, error } = useGet("/api/admin/roles/permissions");

  const [modules, setModules] = useState([]);
  const [allActions, setAllActions] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // تحديث state عند وصول البيانات
  useEffect(() => {
    if (selectionData?.data) {
      const { modules: apiModules, actions } = selectionData.data;
      setModules(apiModules);
      setAllActions(actions);
      setPermissions(apiModules.map((m) => ({ module: m, actions: [] })));
    }
  }, [selectionData]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load permissions");
    }
  }, [error]);

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
            <div key={mod} className="border p-3 rounded-lg bg-gray-50">
              <div className="font-semibold mb-2">{mod}</div>
              <div className="flex gap-4 flex-wrap">
                {allActions.map((action) => {
                  const checked = permissions.find((p) => p.module === mod)?.actions.includes(action);
                  return (
                    <label key={action} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => handleActionChange(mod, action, e.target.checked)}
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
          .filter((p) => p.actions.length > 0)
          .map((p) => ({
            module: p.module,
            actions: p.actions.map((actionName) => ({ action: actionName })),
          })),
      };

      console.log("Payload to send:", payload);
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
