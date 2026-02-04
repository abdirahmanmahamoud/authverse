"use client";

import { IconSearch } from "@tabler/icons-react";
import { Kbd, KbdGroup } from "./ui/kbd";

const Search = () => {
  const handleSearch = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
      })
    );
  };
  return (
    <div
      className="w-64 bg-stone-100 dark:bg-stone-900 px-2 py-1 flex items-center justify-between gap-1.5 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-300 cursor-pointer"
      onClick={handleSearch}
    >
      <div className="flex gap-1.5 items-center">
        <IconSearch className="w-4" />
        <span className="text-sm">Search</span>
      </div>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  );
};

export default Search;
