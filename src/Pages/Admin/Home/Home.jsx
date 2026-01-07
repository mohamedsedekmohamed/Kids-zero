import React from 'react'
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import ReusableTable from "@/Components/UI/ReusableTable";
const Home = () => {
  const navigate = useNavigate();
  const columns = [
    { header: "Name", key: "name" },
    { header: "Role", key: "role" },
    { header: "Email", key: "email" }
  ];

  const data = [
    { id: 1, name: "John Doeklw wlkl qwklew ", role: "Admin", email: "john@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
  ];

  // دالة الحذف
  const handleDelete = (id) => {
    alert("Deleting item with ID: " + id);
  };

  // دالة التعديل
  const handleEdit = (row) => {
    alert("Editing: " + row.name);
  };

  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable 
      titleAdd="User"
        title="User Management"
        columns={columns} 
        data={data} 
        onAddClick={()=>navigate("home/add")} 
        renderActions={(row) => (
          <>
            <Button
  variant="delete"
  size="sm"
  onClick={() => handleDelete(row.id)}
  className=""
>
  <Trash2 className="size-4" />
  Delete
</Button>

<Button
  variant="edit"
  size="sm"
  onClick={() => handleEdit(row)}
  className=""
>
  <Pencil className="size-4" />
  Edit
</Button>

          </>
        )}
      />
    </div>
  );
}
export default Home