import React from "react";

export default function useFilter() {
  const [activeFilterOptions, setActiveFilterOptions] = React.useState(false);

  const toggleActiveFilterOptions = React.useCallback(() => {
    setActiveFilterOptions((prev) => !prev);
  }, []);

  const applyFilters = <T extends object>(
    searchValue: string,
    searchKey: string,
    sortFilter: string,
    data: T[],
  ) => {
    return data
      .filter((d: T) => {
        if (!searchValue) return true;

        if (!(searchKey in d)) return true;

        const item = d[searchKey as keyof T];

        if (typeof item !== "string") return true;

        return item.toString().toLowerCase().includes(searchValue);
      })
      .sort((a, b) => {
        if (a[sortFilter as keyof T] < b[sortFilter as keyof T]) {
          return -1;
        } else {
          return 1;
        }
      });
  };

  return {
    activeFilterOptions,
    toggleActiveFilterOptions,
    applyFilters,
  };
}
