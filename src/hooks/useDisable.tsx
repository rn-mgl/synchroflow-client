import React from "react";

const useDisable = () => {
  const [disable, setDisable] = React.useState(false);

  const handleDisable = React.useCallback((status: boolean) => {
    setDisable(status);
  }, []);

  return {
    disable,
    handleDisable,
  };
};

export default useDisable;
