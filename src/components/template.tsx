import { ReactNode, MouseEventHandler, useEffect, useRef } from "react";
import { VscThreeBars } from "react-icons/vsc";
import { Poppins } from "next/font/google";
import { useAppSelector, useAppDispatch } from "root/redux/hooks";
import { logout, toggleSidebar, login } from "root/redux/slices/global";
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

const SidebarOptions = (type: "STUDENT" | "INSTRUCTOR" | "ADMIN") => {
	if (type === "STUDENT") return <div>
		
	</div>;
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
		if (!loggedInState) {
			setTimeout(() => router.replace("/auth/login"), 1500);
			return;
		}
	}, [loggedInState, router]);
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (loggedInState && user_metadata !== null && token !== null) return;
		if (token === null) {
			dispatch(logout());
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
					return dispatch(logout());
				}
				const responseBody = await response.json();
				const metadata = responseBody.user_metadata;
				dispatch(login(metadata));
			})
			.catch((err) => {
				console.error(err);
			});
	}, [loggedInState, dispatch, user_metadata]);

	if (!loggedInState || user_metadata === null)
		return (
			<section className="h-screen w-full flex flex-col align-middle justify-center text-center bg-white">
				<h1 className={poppins.className}>Redirecting to login page</h1>
			</section>
		);
	return (
		<>
			<div
				className={`flex flex-col px-10 py-16 text-white rounded-r-2xl fixed inset-y-0 left-0 z-50 w-64 h-[95%] bg-[#2E4F4F] overflow-y-auto transform transition-transform ease-in-out duration-300 ${
					sidebarState ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<h1 className={`${poppins.className} text-xl`}>
					{user_metadata?.full_name}
				</h1>
				<h2 className={`${poppins400.className} text-md`}>
					{(() => {
						const Locale = user_metadata?.role
							.toLowerCase()
							.split("") as string[];
						Locale[0] = Locale[0].toUpperCase();
						return Locale.join("");
					})()}
				</h2>
			</div>
			<header
				className={`bg-[#2E4F4F] w-full min-h-20 flex flex-row align-middle justify-between p-3 ${
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
			<main
				className={
					("bg-white " +
						(sidebarState &&
							"opacity-50 transition-opacity duration-500 ease-in-out")) as string
				}
				onClick={() => {
					if (sidebarState) dispatch(toggleSidebar());
				}}
			>
				{children}
			</main>
		</>
	);
};
export default Template;
