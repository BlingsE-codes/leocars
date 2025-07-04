import React from "react";
//import "./Pagination.css"; // ✅ Don't forget this!

function Pagination({ currentPage, totalPages, onPageChange, pageNeighbours = 1 }) {
  const range = (from, to, step = 1) => {
    let i = from;
    const range = [];
    while (i <= to) {
      range.push(i);
      i += step;
    }
    return range;
  };

  const getPageNumbers = () => {
    const totalNumbers = pageNeighbours * 2 + 3; // pages + current + prev/next
    const totalBlocks = totalNumbers + 2; // including first and last

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages = range(startPage, endPage);

      const hasLeftSpill = startPage > 2;
      const hasRightSpill = endPage < totalPages - 1;

      if (hasLeftSpill && !hasRightSpill) {
        const extraPages = range(startPage - (totalNumbers - pages.length - 1), startPage - 1);
        pages = [...extraPages, ...pages];
      } else if (!hasLeftSpill && hasRightSpill) {
        const extraPages = range(endPage + 1, endPage + (totalNumbers - pages.length - 1));
        pages = [...pages, ...extraPages];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        ⏮ First
      </button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        ⬅ Prev
      </button>

      {pages.map((page, idx) => (
        <button
          key={idx}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? "active" : ""}
        >
          {page}
        </button>
      ))}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next ➡
      </button>
      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        Last ⏭
      </button>
    </div>
  );
}

export default Pagination;
