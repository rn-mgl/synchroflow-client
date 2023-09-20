"use client";

import React from "react";

const useMessage = () => {
  const [message, setMessage] = React.useState({ active: false, msg: "", type: "info" });

  const handleMessages = React.useCallback((active: boolean, msg: string, type: string) => {
    setMessage({ active, msg, type });
  }, []);

  return {
    message,
    handleMessages,
  };
};

export default useMessage;
