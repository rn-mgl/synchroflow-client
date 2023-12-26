import Image from "next/image";
import React from "react";
import { AiOutlineDelete, AiOutlineFileText } from "react-icons/ai";

interface FilePreviewProps {
  file: string;
  name: string;
  type: string;
  removeRawFile: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = (props) => {
  return (
    <div
      className="flex flex-col w-fit p-2 items-center justify-center bg-primary-100  bg-opacity-50 rounded-lg gap-2
              border-2 border-primary-200 ml-auto"
    >
      {props.type === "image" ? (
        <Image src={props.file} alt="selected" width={200} height={200} className="rounded-md" />
      ) : props.type === "video" ? (
        <video src={props.file} controls className="rounded-md h-64" />
      ) : props.type === "audio" ? (
        <audio src={props.file} controls className=" text-white w-60" />
      ) : props.type === "application" ? (
        <div className="p-2 rounded-md w-full bg-primary-500 flex flex-row items-center justify-center">
          <AiOutlineFileText className="text-2xl text-white" />
        </div>
      ) : null}

      <div className="flex flex-row w-full items-end justify-between">
        <p className="max-w-[20ch] truncate text-sm font-light">{props.name}</p>
        <button type="button" className="animate-fadeIn" onClick={props.removeRawFile}>
          <AiOutlineDelete className="text-primary-500" />
        </button>
      </div>
    </div>
  );
};

export default FilePreview;
