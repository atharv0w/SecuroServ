import React from "react";

export default function Breadcrumb({ crumbs = [], onRoot, onClickCrumb }) {
  
  if (!Array.isArray(crumbs)) crumbs = [];

  return (
    <nav
      className="text-[13px] text-zinc-400 truncate flex items-center"
      aria-label="Breadcrumb"
    >
      
      <button
        onClick={onRoot}
        className="underline-offset-4 hover:text-zinc-200 hover:underline focus:outline-none"
        type="button"
      >
        Root
      </button>

      {crumbs.map((c, idx) => (
        <span key={c.id} className="flex items-center">
          <span className="mx-2 text-zinc-600">/</span>

          {idx === crumbs.length - 1 ? (
            
            <span
              className="text-zinc-200 truncate inline-block max-w-[20ch] align-bottom"
              aria-current="page"
            >
              {c.name}
            </span>
          ) : (
            
            <button
              onClick={() => onClickCrumb?.(c, idx)}
              className="underline-offset-4 hover:text-zinc-200 hover:underline focus:outline-none"
              type="button"
            >
              {c.name}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
}
