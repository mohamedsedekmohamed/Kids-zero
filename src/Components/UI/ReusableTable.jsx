import React, { useState } from 'react';
import TruncatedText from "./TruncatedText";

const ReusableTable = ({ title, columns, data, onAddClick, titleAdd, renderActions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // 1. Search Logic
  const filteredData = data.filter((row) =>
    columns.some((col) =>
      String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentRows = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="w-full space-y-4 p-4 bg-background text-left">
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-auto">
          {title && (
            <h2 className="text-xl text-one md:text-2xl font-semibold">
              {title}
            </h2>
          )}
        </div>

        <div className="relative w-full md:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 pl-10 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-one outline-none transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <button
          onClick={onAddClick}
          className="w-full md:w-auto bg-one hover:opacity-90 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span> Add {titleAdd}
        </button>
      </div>

      {/* Table Container */}
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground border-b border-border">
                {columns.map((col, index) => (
                  <th key={index} className="p-4 font-bold text-one uppercase text-xs tracking-wider">
                    {col.header}
                  </th>
                ))}
                {renderActions && <th className="p-4 font-bold text-one uppercase text-xs tracking-wider text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-two/30 transition-colors border-b border-border last:border-0">
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="p-4 text-foreground text-sm">
                        {/* التعديل هنا: إذا كان هناك render function استخدمها، وإلا اعرض نص عادي */}
                        {col.render ? (
                          col.render(row[col.key], row)
                        ) : (
                          <TruncatedText text={String(row[col.key] || "")} />
                        )}
                      </td>
                    ))}
                    {renderActions && (
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          {renderActions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (renderActions ? 1 : 0)} className="p-10 text-center text-muted-foreground italic">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-muted/20 rounded-lg border border-border gap-3 md:gap-0">
        <div className="text-sm text-muted-foreground">
          Page{" "}
          <input
            type="number"
            min={1}
            max={totalPages || 1}
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="w-14 text-center border border-border rounded px-2 py-1 text-foreground font-bold focus:ring-2 focus:ring-one outline-none"
          />{" "}
          of <span className="text-foreground font-bold">{totalPages || 1}</span>
        </div>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-1.5 border border-border rounded bg-card hover:bg-two/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold"
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-1.5 border border-border rounded bg-card hover:bg-two/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;