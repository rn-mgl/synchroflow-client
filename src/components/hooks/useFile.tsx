import axios from "axios";
import React from "react";
import { useGlobalContext } from "@/base/src/contexts/context";
import { useSession } from "next-auth/react";

export default function useFile() {
  const [fileData, setFileData] = React.useState({
    name: "",
    url: "",
    type: "",
  });
  const rawFile = React.useRef<HTMLInputElement | null>(null);

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession();
  const user = session?.user;

  const selectedFileViewer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;

    if (!file || file.length < 1) {
      return;
    }

    const details = file[0];

    if (details.size > 10000000) {
      return;
    }

    const name = details.name;
    const type = details.type.split("/")[0];
    const url = URL.createObjectURL(details);

    setFileData({ name, url, type });
  };

  const removeRawFile = () => {
    setFileData({ name: "", url: "", type: "" });
    if (rawFile.current) {
      rawFile.current.value = "";
      rawFile.current.files = null;
    }
  };

  const uploadFile = async (file: FileList | null) => {
    try {
      if (!file || file.length < 1) {
        return null;
      }
      const details = file[0];
      const formData = new FormData();
      formData.append("file", details);

      const { data } = await axios.post(`${url}/files`, formData, {
        headers: { Authorization: user?.token },
      });

      if (data) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { rawFile, fileData, removeRawFile, selectedFileViewer, uploadFile };
}
