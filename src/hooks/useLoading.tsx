import React from "react";

const useLoader = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLoader = React.useCallback((status: boolean) => {
    setIsLoading(status);
  }, []);

  return {
    isLoading,
    handleLoader,
  };
};

export default useLoader;
