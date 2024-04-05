import { ReactNode, MouseEventHandler, useEffect } from "react";
import { VscThreeBars } from "react-icons/vsc";
import { Poppins } from "next/font/google";
import { useAppSelector, useAppDispatch } from "root/redux/hooks";
import { logout, toggleSidebar } from "root/redux/slices/global";
import { useRouter } from "next/router";

const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
	weight: ["700"],
});
const Template = ({ children }: { children: ReactNode }) => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const sidebarState = useAppSelector((state) => state.globals.sidebar);
	const loggedInState = useAppSelector((state) => state.globals.loggedIn);

	const toggleFunction: MouseEventHandler<SVGAElement> = (e) => {
		e.preventDefault();
		dispatch(toggleSidebar());
	};
	const logoutUser: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		localStorage.removeItem("token");
		dispatch(logout());
	};

	useEffect(() => {
		if (!loggedInState) {
			setTimeout(() => router.replace("/auth/login"), 1500);
			return;
		}
	}, [loggedInState, router]);

	if (!loggedInState)
		return (
			<section className="h-screen w-screen flex flex-col align-middle justify-center text-center">
				<h1 className={poppins.className}>Redirecting to login page</h1>
			</section>
		);

	return (
		<>
			<header className="bg-[#2E4F4F] w-screen min-h-20 flex flex-row align-middle justify-between p-3">
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
			<main>{children}</main>
		</>
	);
};
export default Template;
