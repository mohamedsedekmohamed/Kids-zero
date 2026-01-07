import AddPage from '../../../components/AddPage';
import toast from "react-hot-toast";

function AddHome() {
  const formSchema = [
    { name: "fullName", label: "Full Name", type: "text", placeholder: "Enter name", required: true },
    { name: "userEmail", label: "Email Address", type: "email", placeholder: "mail@example.com" },
    { name: "userRole", label: "Position", type: "select", options: [
      { label: "Manager", value: "mgr" },
      { label: "Developer", value: "dev" }
    ]},
    { name: "birthDate", label: "Start Date", type: "date" },
    { name: "profilePic", label: "Upload Image", type: "file", fullWidth: true },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true },
  ];

  const handleSave = (data) => {
toast.promise(
  fetch("/api/data"),
  {
    loading: "Saving...",
    success: "Saved!",
    error: "Error occurred",
  }
);

  };

  return (
    <AddPage 
      title="Create New Employee"
      fields={formSchema} 
      onSave={handleSave} 
      onCancel={() => console.log("Back to Table")}
    />
  );
}
export default AddHome