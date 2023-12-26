import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineFileText } from "react-icons/ai";

interface FileViewerProps {
  file: string;
  type: string | null;
}

const FileViewer: React.FC<FileViewerProps> = (props) => {
  return (
    <Link href={props.file} target="_blank">
      {props.type === "image" ? (
        <Image src={props.file} alt="selected" width={300} height={300} className="rounded-md" />
      ) : props.type === "video" ? (
        <video src={props.file} controls className="rounded-md h-72" />
      ) : props.type === "audio" ? (
        <audio src={props.file} controls className=" text-white w-52" />
      ) : props.type === "application" ? (
        <embed src={props.file} width={300} height={300} className="w-full pointer-events-none" />
      ) : null}
    </Link>
  );
};

export default FileViewer;
