import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import toast, { Toaster }  from "react-hot-toast";
import { data, useNavigate } from "react-router-dom";

const AddPromocodes = () => {
  const { postData, loading } = usePost("/api/superadmin/promocodes");
  const navigate = useNavigate();

  const formSchema = [
    {
      name: "name",
      label: "Promo Name",
      type: "text",
      placeholder: "Enter promo name",
      required: true,
    },
    {
      name: "code",
      label: "Promo Code",
      type: "text",
      placeholder: "Enter promo code",
      required: true,
    },
    {
      name: "promocode_type",
      label: "Promo Type",
      type: "select",
      required: true,
      options: [
        { label: "Percentage", value: "percentage" },
        { label: "Amount", value: "amount" },
      ],
    },
   {
  name: "amount",
  label: "Amount",
  type: "number",
  placeholder: "Enter discount amount",
  required: true,
  customValidator: (value, formData) => {  // <-- استخدم formData
    if (!value) return "Amount is required";
    if (Number(value) <= 0) return "Amount must be greater than 0";

    if (
      formData.promocode_type === "percentage" &&  // <-- بدل data
      Number(value) > 100
    ) {
      return "Percentage cannot exceed 100";
    }

    return null;
  },

}
,
    {
      name: "start_date",
      label: "Start Date",
      type: "datetwo",
      required: true,
    },
{
  name: "end_date",
  label: "End Date",
  type: "datetwo",
  required: true,
  customValidator: (value, formData) => {
    if (!value) return "End date is required";

    if (
      formData.start_date &&
      new Date(value) <= new Date(formData.start_date)
    ) {
      return "End date must be greater than start date";
    }

    return null;
  }
}
,
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description",
      fullWidth: true,
    },
  ];

  const handleSave = async (data) => {

    try {
      const payload = {
        name: data.name,
        code: data.code,
        promocode_type: data.promocode_type,
        amount: Number(data.amount),
        description: data.description,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
      };

      await postData(payload, null, "Promo code added successfully!");
      navigate("/super/promocodes");
    } catch (err) {
      console.error(err);
    }
  };

  return (
 <div>
     <AddPage
      title="Add New Promo Code"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/super/promocodes")}
      loading={loading}
    />
 <Toaster
        position="top-center"
        reverseOrder={false}
      /> </div>
  );
};

export default AddPromocodes;
