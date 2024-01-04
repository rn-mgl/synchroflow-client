import React from "react";

export default function useSortFilter(initialSortFilter: string) {
  const [sortFilter, setSortFilter] = React.useState(initialSortFilter);
  const [activeSortOptions, setActiveSortOptions] = React.useState(false);

  const handleSortFilter = React.useCallback((sortKey: string) => {
    setSortFilter(sortKey);
  }, []);

  const toggleActiveSortOptions = React.useCallback(() => {
    setActiveSortOptions((prev) => !prev);
  }, []);

  return {
    sortFilter,
    activeSortOptions,
    handleSortFilter,
    toggleActiveSortOptions,
  };
}
