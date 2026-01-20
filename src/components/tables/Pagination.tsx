"use client";

type PaginationProps = {
  currentPage: number;
  perPage: number;
  totalCount: number;
  onChange: (page: number, perPage: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  perPage,
  totalCount,
  onChange,
}) => {
  const totalPages = Math.ceil(totalCount / perPage);

  const pagesAroundCurrent = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => Math.max(1, currentPage - 1) + i
  ).filter((p) => p <= totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      
      {/* Per Page Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Rows per page:</span>
        <select
          value={perPage}
          onChange={(e) => onChange(1, Number(e.target.value))}
          className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center">
        <button
          onClick={() => onChange(currentPage - 1, perPage)}
          disabled={currentPage === 1}
          className="mr-2 h-10 rounded-lg border px-3 text-sm disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {currentPage > 3 && <span className="px-1">...</span>}

          {pagesAroundCurrent.map((page) => (
            <button
              key={page}
              onClick={() => onChange(page, perPage)}
              className={`h-10 w-10 rounded-lg text-sm font-medium ${
                currentPage === page
                  ? "bg-brand-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 2 && <span className="px-1">...</span>}
        </div>

        <button
          onClick={() => onChange(currentPage + 1, perPage)}
          disabled={currentPage === totalPages}
          className="ml-2 h-10 rounded-lg border px-3 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
