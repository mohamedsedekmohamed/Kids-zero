import Select from "react-select";

const ParentSelect = ({ value, onChange, options ,placeholder }) => {


// console.log(value)
  return (
    <Select
    value={value}                                 // ← نستقبل الكائن مباشرة
      onChange={onChange}
      options={options}
      isClearable
      placeholder={placeholder}
    />
  );
};
export default ParentSelect;