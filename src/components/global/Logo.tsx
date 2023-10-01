import Link from "next/link";

const Logo = () => {
  return (
    <div className="flex flex-row z-50 p-5 relative w-full items-center justify-center">
      <Link href="/">
        <p className="font-header font-extrabold text-center text-primary-500 text-lg t:text-xl">SynchroFlow</p>
      </Link>
    </div>
  );
};

export default Logo;
