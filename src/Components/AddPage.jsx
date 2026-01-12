import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MapPicker from './UI/MapPicker';
import ParentSelect from './UI/ParentSelect';
// 1. إضافة initialData إلى الـ props
const AddPage = ({ title, fields, onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState(() => 
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {})
  );

  const [previews, setPreviews] = useState({});
  const [errors, setErrors] = useState({});
const navigate = useNavigate();
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));

      const newPreviews = {};
      fields.forEach(field => {
        if (field.type === 'file' && typeof initialData[field.name] === 'string') {
          newPreviews[field.name] = initialData[field.name];
        }
      });
      setPreviews(newPreviews);
    }
  }, [initialData, fields]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      if (type === "date") {
    // حول القيمة لصيغة ISO
    const isoDate = value ? new Date(value).toISOString() : "";
    setFormData(prev => ({ ...prev, [name]: isoDate }));
    return;
  }


    setErrors(prev => ({ ...prev, [name]: '' })); // مسح الخطأ عند التغيير
  };

  const handleFileChange = (e, name) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [name]: file }));
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
      setErrors(prev => ({ ...prev, [name]: '' })); // مسح الخطأ عند رفع ملف جديد
    }
  };

const validateField = (field, value, formData) => {
  let error = "";

  if (field.required && (!value || value.toString().trim() === "")) {
    error = "This field is required";
  }

  if (value && field.type === "number") {
    if (isNaN(value)) error = "Must be a number";
  }

  if (field.customValidator) {
    const customError = field.customValidator(value, formData);
    if (customError) error = customError;
  }

  return error;
};



const validateForm = () => {
  const newErrors = {};
  fields.forEach(field => {
    const error = validateField(field, formData[field.name], formData);
    if (error) newErrors[field.name] = error;
  });
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  return (
    <div className="p-6 bg-background overflow-auto">
      <div className="mb-8 border-b border-border pb-4 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-one">{title}</h1>
      
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 bg-one/10 text-one rounded-lg hover:bg-one/20 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
    </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (validateForm()) onSave(formData);
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card p-8 rounded-2xl border border-border">
          {fields.map((field) => (
            <div key={field.name} className={`flex flex-col gap-2 ${field.fullWidth ? 'md:col-span-2' : ''}`}>
              <label className="text-sm font-semibold uppercase tracking-wider text-four">
                {field.label} {field.required && <span className="text-one">*</span>}
              </label>

              {['text','email','number','password'].includes(field.type) && (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  placeholder={field.placeholder}
                  className="p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-one outline-none transition-all"
                  onChange={handleChange}
                  required={field.required}
                />
              )}


  {field.type === "date" && (
  <div className="flex flex-col w-full">
   <DatePicker
  selected={formData[field.name] ? new Date(formData[field.name]) : null}
  onChange={(date) => setFormData(prev => ({
    ...prev,
    [field.name]: date ? date.toISOString() : ""
  }))}
  dateFormat="yyyy-MM-dd" // هنا تحدد ترتيب العرض
  minDate={new Date()} // يمنع تواريخ قبل اليوم
  placeholderText={field.placeholder}
  className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-900"
/>
  </div>
)}
 {field.type === "datetwo" && (
  <div className="flex flex-col w-full">
    <DatePicker
      selected={formData[field.name] ? new Date(formData[field.name]) : null}
      onChange={(date) => {
        if (date) {
          // استخراج السنة والشهر واليوم يدوياً لضمان عدم حدوث تغيير بسبب التوقيت
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
          
          setFormData(prev => ({
            ...prev,
            [field.name]: formattedDate
          }));
        } else {
          setFormData(prev => ({ ...prev, [field.name]: "" }));
        }
      }}
      dateFormat="yyyy-MM-dd"
      minDate={new Date()}
      placeholderText={field.placeholder}
      className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-900"
    />
  </div>
)}
{field.type === 'map' && (
  <div className=" md:col-span-2 w-full flex flex-col gap-2">
    <label className="text-sm font-semibold uppercase tracking-wider text-four mb-2">
      Select Location on Map
    </label>
    <div className="w-full h-80"> {/* تحديد ارتفاع ثابت */}
      <MapPicker
        lat={Number(formData.lat)}
        lng={Number(formData.lng)}
        onChange={(lat, lng) =>
          setFormData(prev => ({
            ...prev,
            lat: lat.toFixed(6),
            lng: lng.toFixed(6),
          }))
        }
      />
    </div>
  </div>
)}


{field.type === 'autocomplete' && (
  <ParentSelect
    value={formData[field.name]}                    // ← object أو null
  onChange={(selectedOption) =>                   // ← selectedOption → object كامل أو null
    setFormData(prev => ({ ...prev, [field.name]: selectedOption }))
  }
    options={field.options || []}
  />
)}
{field.type === 'switch' && (
  <div className="flex items-center gap-3 mt-2">
    <span className="text-sm font-medium text-four">{field.label}</span>
    <button
      type="button"
      onClick={() =>
        setFormData(prev => ({ ...prev, [field.name]: !prev[field.name] }))
      }
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        formData[field.name] ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          formData[field.name] ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  </div>
)}


              {field.type === 'select' && (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  className="p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-one outline-none cursor-pointer"
                  onChange={handleChange}
                  required={field.required}
                >
                  <option value="">Select Option</option>
                  {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              )}

              {field.type === 'textarea' && (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ''}
                  rows="4"
                  className="p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-one outline-none"
                  onChange={handleChange}
                />
              )}
{field.type === 'custom' && field.render && (
  <div>
    {/* أضفنا formData هنا كخيار ثالث لكي نتمكن من قراءة أي قيمة أخرى بالنموذج */}
    {field.render({ 
      value: formData[field.name], 
      onChange: (val) => setFormData(prev => ({ ...prev, [field.name]: val })),
      formData: formData // <--- أضف هذا السطر
    })}
  </div>
)}
              {field.type === 'file' && (
                <div className="flex items-center gap-4 p-4 border-2 border-dashed border-border rounded-xl bg-muted/5">
                  {previews[field.name] ? (
                    <img src={previews[field.name]} 
                    alt="preview" className="w-16 h-16 rounded-lg object-cover" 
                    accept="image/*"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">🖼️</div>
                  )}
                  <input type="file" onChange={(e) => handleFileChange(e, field.name)} className="text-sm" />
                </div>
              )}

              {errors[field.name] && <span className="text-red-500 text-sm">{errors[field.name]}</span>}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 border border-border rounded-xl cursor-pointer">Cancel</button>
          <button type="submit" className="px-10 py-2 bg-one text-white rounded-xl font-bold shadow-lg cursor-pointer">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default AddPage; 