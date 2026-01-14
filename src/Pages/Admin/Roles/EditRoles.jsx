import React, { useEffect, useState } from "react";
import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditRoles = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: selectionData, error: selectionError } = useGet("/api/admin/roles/permissions");
  const { data, loading: loadingGet } = useGet(`/api/admin/roles/${id}`);
  const { putData, loading: loadingPut } = usePut(`/api/admin/roles/${id}`);

  const [modules, setModules] = useState([]);
  const [allActions, setAllActions] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // تجهيز الموديولات والأكشنات من الـ API
  useEffect(() => {
    if (selectionData?.data) {
      const { modules: apiModules, actions } = selectionData.data;
      setModules(apiModules);
      setAllActions(actions);
      setPermissions(apiModules.map((m) => ({ module: m, actions: [] })));
    }
  }, [selectionData]);

  // تحميل بيانات الـ Role الحالية
  useEffect(() => {
    if (data?.data?.role && modules.length) {
      const rolePermissions = data.data.role.permissions || [];
      const initialPermissions = modules.map((mod) => {
        const found = rolePermissions.find((p) => p.module === mod);
        return {
          module: mod,
          actions: found ? found.actions.map((a) => a.action) : [],
        };
      });
      setPermissions(initialPermissions);
    }
  }, [data, modules]);

  useEffect(() => {
    if (selectionError) toast.error("Failed to load permissions");
  }, [selectionError]);

  // تغيير الأكشنات الفردية
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

  // اختيار/إلغاء كل الأكشنات لموديول
  const handleToggleAll = (moduleName, checked) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.module === moduleName
          ? {
              ...perm,
              actions: checked ? [...allActions] : [],
            }
          : perm
      )
    );
  };

  const handleSave = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        status: formData.status,
        permissions: permissions
          .filter((p) => p.actions.length > 0)
          .map((p) => ({
            module: p.module,
            actions: p.actions.map((a) => ({ action: a })),
          })),
      };

      await putData(payload);
      toast.success("Role updated successfully!");
      navigate("/admin/roles");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  if (loadingGet || !modules.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

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
        <div className="grid grid-cols-1 gap-4">
          {modules.map((mod) => {
            const modulePerm = permissions.find((p) => p.module === mod);
            const allChecked = modulePerm?.actions.length === allActions.length;
            return (
              <div key={mod} className="border p-4 rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-blue-600 capitalize">{mod.replace("_", " ")}</div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={(e) => handleToggleAll(mod, e.target.checked)}
                    />
                    <span className="text-sm font-medium">All</span>
                  </label>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {allActions.map((action) => {
                    const isChecked = modulePerm?.actions.includes(action);
                    return (
                      <label key={action} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-2 py-1 rounded hover:bg-gray-100">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={!!isChecked}
                          onChange={(e) => handleActionChange(mod, action, e.target.checked)}
                        />
                        <span className="text-sm">{action}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
