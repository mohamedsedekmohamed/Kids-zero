import React, { useState } from 'react';

const AddPage = ({ title, fields, onSave, onCancel }) => {
  // إنشاء الـ state تلقائياً بناءً على الحقول المرسلة
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {})
  );
  const [previews, setPreviews] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e, name) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [name]: file }));
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  return (
    <div className="  p-6 bg-background overflow-auto" >
      <div className="mb-8 border-b border-border pb-4">
        <h1 className="text-3xl font-bold text-one">{title}</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card p-8 rounded-2xl border border-border">
          
          {fields.map((field) => (
            <div key={field.name} className={`flex flex-col gap-2 ${field.fullWidth ? 'md:col-span-2' : ''}`}>
              <label className="text-sm font-semibold  uppercase tracking-wider  text-four">
                {field.label} {field.required && <span className="text-one">*</span>}
              </label>

              {/* Input Text / Email / Date / Number */}
              {['text', 'email', 'date', 'number', 'password'].includes(field.type) && (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  className="p-3 rounded-xl border border-border  bg-background focus:ring-2 focus:ring-one outline-none transition-all"
                  onChange={handleChange}
                  required={field.required}
                />
              )}

              {/* Select Dropdown */}
              {field.type === 'select' && (
                <select
                  name={field.name}
                  className="p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-one outline-none cursor-pointer"
                  onChange={handleChange}
                  required={field.required}
                >
                  <option value="">Select Option</option>
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}

              {/* Textarea */}
              {field.type === 'textarea' && (
                <textarea
                  name={field.name}
                  rows="4"
                  className="p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-one outline-none"
                  onChange={handleChange}
                ></textarea>
              )}

              {/* File Upload */}
              {field.type === 'file' && (
                <div className="flex items-center gap-4 p-4 border-2 border-dashed border-border rounded-xl bg-muted/5">
                  {previews[field.name] ? (
                    <img src={previews[field.name]} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">🖼️</div>
                  )}
                  <input type="file" onChange={(e) => handleFileChange(e, field.name)} className="text-sm" />
                </div>
              )}
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