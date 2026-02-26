"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  defaultValue: string;
}

export default function SearchBar({ defaultValue }: SearchBarProps) {
  const [search, setSearch] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/admin/dashboard?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/admin/dashboard");
    }
  };

  const handleClear = () => {
    setSearch("");
    router.push("/admin/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-md hover:bg-green-800 transition-colors"
      >
        Search
      </button>
      {defaultValue && (
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      )}
    </form>
  );
}
