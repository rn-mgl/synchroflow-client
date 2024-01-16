import empty from "@/public//global/Empty.svg";
import Image from "next/image";

const StandByMessagePanel = () => {
  return (
    <div
      className="hidden l-s:col-span-2 w-full bg-white l-s:flex rounded-lg
                flex-col items-center justify-center h-full top-0 z-20 fixed left-2/4 
                -translate-x-2/4 animate-fadeIn l-s:static l-s:order-2 l-s:left-0 l-s:translate-x-0"
    >
      <Image
        draggable={false}
        src={empty}
        alt="empty"
        width={300}
        height={300}
        className="animate-float drop-shadow-md select-none"
      />
      <p className="opacity-50 pointer-events-none select-none">Select a message to display stream</p>
    </div>
  );
};

export default StandByMessagePanel;
