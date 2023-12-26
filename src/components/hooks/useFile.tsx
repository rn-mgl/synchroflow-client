import axios from "axios";
import React from "react";
import { useGlobalContext } from "../../../context";
import { useSession } from "next-auth/react";

export default function useFile() {
  const [imageData, setImageFile] = React.useState({ name: "", url: "" });
  const rawFile = React.useRef<any>();

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const selectedImageViewer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;

    if (!file || file.length < 1) {
      return;
    }

    const details = file[0];

    if (details.size > 10000000) {
      return;
    }

    const name = details.name;
    const url = URL.createObjectURL(details);

    setImageFile({ name, url });
  };

  const removeRawFile = () => {
    setImageFile({ name: "", url: "" });
    if (rawFile.current) {
      rawFile.current.value = null;
    }
  };

  const uploadFile = async (file: any) => {
    try {
      if (!file || file.length < 1) {
        return null;
      }
      const details = file[0];
      const formData = new FormData();
      formData.append("file", details);

      const { data } = await axios.post(`${url}/files`, formData, { headers: { Authorization: user?.token } });

      if (data) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { rawFile, imageData, removeRawFile, selectedImageViewer, uploadFile };
}
