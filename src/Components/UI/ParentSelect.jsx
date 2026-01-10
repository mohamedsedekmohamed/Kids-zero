import Select from "react-select";

const ParentSelect = ({ value, onChange, options }) => {


// console.log(value)
  return (
    <Select
    value={value}                                 // ← نستقبل الكائن مباشرة
      onChange={onChange}
      options={options}
      isClearable
      placeholder="Select or search parent..."
    />
  );
};
export default ParentSelect;