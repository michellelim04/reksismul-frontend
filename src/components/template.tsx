import { ReactNode, MouseEventHandler, useEffect, useRef } from "react";
import { VscThreeBars } from "react-icons/vsc";
import { IoIosArrowForward, IoIosAddCircleOutline } from "react-icons/io";
import { Poppins } from "next/font/google";
import { useAppSelector, useAppDispatch } from "root/redux/hooks";
import Link from "next/link";
import {
  logout,
  toggleSidebar,
  setUser,
  login,
} from "root/redux/slices/global";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["700"],
});

const poppins400 = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400"],
});

const SidebarOptions = ({
  type,
}: {
  type: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}) => {
  const router = useRouter();
  if (type === "STUDENT")
    return (
      <Link
        href="/assignment/student"
        className="flex flex-row align-middle justify-between"
      >
        <p>All Assignment</p>
        <IoIosArrowForward size={20} />
      </Link>
    );
  if (type === "INSTRUCTOR")
    return (
      <>
        <Link href="/assignment/instructor">All Assignment</Link>
        <Link href="/assignment/create">Create New Assignment</Link>
      </>
    );
  if (type === "ADMIN")
    return (
      <>
        <Link
          href="/assignment/student"
          className="flex flex-row align-middle justify-between"
          onClick={(e) => {
            e.preventDefault();
            router.push("/assignment/student");
          }}
        >
          <p className="my-auto">Student Assignment</p>
          <IoIosArrowForward size={25} className="my-auto" />
        </Link>
        <Link
          href="/assignment/instructor"
          className="flex flex-row align-middle justify-between"
          onClick={(e) => {
            e.preventDefault();
            router.push("/assignment/instructor");
          }}
        >
          <p className="my-auto">Instructor Assignment</p>
          <IoIosArrowForward size={25} className="my-auto" />
        </Link>
        <Link
          href="/assignment/create"
          className="flex flex-row align-middle justify-between"
          onClick={(e) => {
            e.preventDefault();
            router.push("/assignment/create");
          }}
        >
          <p className="my-auto">Create New Assignment</p>
          <IoIosAddCircleOutline size={25} className="my-auto" />
        </Link>
      </>
    );
};

const Template = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const sidebarState = useAppSelector((state) => state.globals.sidebar);
  const loggedInState = useAppSelector((state) => state.globals.loggedIn);
  const user_metadata = useAppSelector((state) => state.globals.user_metadata);

  const toggleFunction: MouseEventHandler<SVGAElement> = (e) => {
    e.preventDefault();
    dispatch(toggleSidebar());
  };
  const logoutUser: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    toast.success("Logged out!");
    dispatch(logout());
  };

  useEffect(() => {
    if (!router.isReady) return;
    const token = localStorage.getItem("token");
    if (token === null) {
      setTimeout(() => router.replace("/auth/login"), 1500);
      return;
    }
    fetch("http://localhost:3333/v1/auth/verify", {
      headers: {
        Authorization: token,
      },
    })
      .then(async (response) => {
        if (response.status !== 200 || response.body === null) {
          localStorage.removeItem("token");
          router.replace("/auth/login");
          return;
        }
        const responseBody = await response.json();
        const metadata = {
          id: responseBody.data.id,
          email: responseBody.data.user_metadata.email,
          full_name: responseBody.data.user_metadata.full_name,
          role: responseBody.data.user_metadata.role,
        };
        dispatch(setUser(metadata));
        dispatch(login());
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
    return;
  }, [router, dispatch, loggedInState]);

  if (!loggedInState) {
    return (
      <section className="h-screen w-full flex flex-col align-middle justify-center text-center bg-white">
        <h1 className={poppins.className}>Redirecting to login page</h1>
      </section>
    );
  }
  return (
    <>
      {/* This is the sidebar for the mobile page */}
      <div
        className={`flex flex-col px-10 py-16 text-white rounded-r-2xl fixed inset-y-0 left-0 z-50 w-80 bg-[#2E4F4F] overflow-y-auto transform transition-transform ease-in-out duration-300 md:hidden ${
          sidebarState ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h1 className={`${poppins.className} text-xl`}>
          {user_metadata?.full_name}
        </h1>
        <h2 className={`${poppins400.className} text-md`}>
          {(() => {
            const Locale = user_metadata ? user_metadata.role : "Student";
            const roleSplit = Locale.split("");
            roleSplit[0] = roleSplit[0].toUpperCase();
            return roleSplit.join("");
          })()}
        </h2>
        <div className="flex flex-col align-middle justify-center mt-10 text-sm space-y-5">
          <SidebarOptions
            type={user_metadata ? user_metadata.role : "STUDENT"}
          />
        </div>
      </div>
      {/* This is the header for the mobile page */}
      <header
        className={`bg-[#2E4F4F] w-full min-h-20 flex flex-row align-middle justify-between p-3 md:hidden ${
          sidebarState && "opacity-50"
        } transition-opacity duration-500 ease-in-out`}
      >
        <VscThreeBars
          size={40}
          color="#FFFFFF"
          className="my-auto hover:cursor-pointer active:scale-95"
          onClick={toggleFunction}
        />
        <button
          className={
            "bg-[#CBE4DE] px-6 py-2 drop-shadow-2xl rounded-full text-black active:bg-[#91a39f] active:scale-95 active:text-white hover:cursor-pointer " +
            poppins.className
          }
          onClick={logoutUser}
        >
          Logout
        </button>
      </header>
      {/* This is the main content for the mobile page */}
      <main
        className={
          ("bg-white md:hidden " +
            (sidebarState &&
              "opacity-50 transition-opacity duration-500 ease-in-out")) as string
        }
        onClick={() => {
          if (sidebarState) dispatch(toggleSidebar());
        }}
      >
        {children}
      </main>

      <div className="flex flex-row align-middle justify-between bg-white min-h-screen">
        {/* This is the sidebar for the desktop page */}
        <div
          className={`flex-col px-10 py-16 text-white rounded-r-2xl z-50 w-[400px] bg-[#2E4F4F] overflow-y-auto transform transition-transform ease-in-out duration-300 hidden md:flex`}
        >
          <h1 className={`${poppins.className} text-xl`}>
            {user_metadata ? user_metadata.full_name : "NO NAME"}
          </h1>
          <h2 className={`${poppins400.className} text-md`}>
            {(() => {
              const Locale = user_metadata ? user_metadata.role : "Student";
              const roleSplit = Locale.split("");
              roleSplit[0] = roleSplit[0].toUpperCase();
              return roleSplit.join("");
            })()}
          </h2>
          <div className="flex flex-col align-middle justify-center mt-10 text-sm space-y-5">
            <SidebarOptions
              type={user_metadata ? user_metadata.role : "STUDENT"}
            />
          </div>
          <button
            className={
              "bg-[#2C3333] px-6 py-3 drop-shadow-sm rounded-full text-white w-min mx-auto mt-10 active:bg-[#91a39f] active:scale-95 active:text-white hover:cursor-pointer " +
              poppins.className
            }
            onClick={logoutUser}
          >
            Logout
          </button>
        </div>
        <main className="w-full">{children}</main>
      </div>
    </>
  );
};
export default Template;
