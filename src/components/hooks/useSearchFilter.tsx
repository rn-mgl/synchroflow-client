import React from "react";
import { isSpecialCharacter } from "../utils/specialCharsUtils";

export default function useSearchFilter(initialSearchCategory: string) {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [searchCategory, setSearchCategory] = React.useState(initialSearchCategory);
  const [activeSearchOptions, setActiveSearchOptions] = React.useState(false);

  const handleSearchFilter = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;

    if (isSpecialCharacter(value)) {
      return;
    }

    setSearchFilter(value);
  }, []);

  const handleSearchCategory = React.useCallback((searchCategory: string) => {
    setSearchCategory(searchCategory);
  }, []);

  const toggleActiveSearchOptions = React.useCallback(() => {
    setActiveSearchOptions((prev) => !prev);
  }, []);

  return {
    searchFilter,
    searchCategory,
    activeSearchOptions,
    handleSearchFilter,
    handleSearchCategory,
    toggleActiveSearchOptions,
  };
}
