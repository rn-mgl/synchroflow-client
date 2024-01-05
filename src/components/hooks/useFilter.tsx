import React from "react";

export default function useFilter() {
  const [activeFilterOptions, setActiveFilterOptions] = React.useState(false);

  const toggleActiveFilterOptions = React.useCallback(() => {
    setActiveFilterOptions((prev) => !prev);
  }, []);

  return {
    activeFilterOptions,
    toggleActiveFilterOptions,
  };
}
