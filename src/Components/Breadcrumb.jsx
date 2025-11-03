import React from "react";

export default function Breadcrumb({ crumbs = [], onRoot, onClickCrumb }) {
  // Early return if no crumbs
  if (!Array.isArray(crumbs)) crumbs = [];

  return (
    <nav
      className="text-[13px] text-zinc-400 truncate flex items-center"
      aria-label="Breadcrumb"
    >
      {/* Root Button */}
      <button
        onClick={onRoot}
        className="underline-offset-4 hover:text-zinc-200 hover:underline focus:outline-none"
        type="button"
      >
        Root
      </button>

      {/* Folder Crumbs */}
      {crumbs.map((c, idx) => (
        <span key={c.id} className="flex items-center">
          <span className="mx-2 text-zinc-600">/</span>

          {idx === crumbs.length - 1 ? (
            // Current folder (not clickable)
            <span
              className="text-zinc-200 truncate inline-block max-w-[20ch] align-bottom"
              aria-current="page"
            >
              {c.name}
            </span>
          ) : (
            // Clickable previous folder
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
