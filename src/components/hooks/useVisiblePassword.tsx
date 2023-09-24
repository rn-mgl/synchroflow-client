import React from "react";

export const useVisiblePassword = () => {
  const [visiblePassword, setVisiblePassword] = React.useState(false);

  const toggleVisiblePassword = () => {
    setVisiblePassword((prev) => !prev);
  };

  return {
    visiblePassword,
    toggleVisiblePassword,
  };
};
