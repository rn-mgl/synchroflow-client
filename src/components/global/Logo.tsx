import Link from "next/link";

const Logo = () => {
  return (
    <Link className="absolute top-5 left-2/4 -translate-x-2/4 flex flex-row t:top-10" href="/">
      <p className="font-header font-extrabold text-center text-primary-500 text-lg t:text-xl">SynchroFlow</p>
    </Link>
  );
};

export default Logo;
