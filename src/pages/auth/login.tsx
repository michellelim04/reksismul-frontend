import { login, setUser } from "root/redux/slices/global";
import { useAppDispatch } from "root/redux/hooks";
import { useRouter } from "next/router";
import { MouseEventHandler, useState } from "react";
import { toast } from "react-toastify";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
	weight: ["500"],
});

export default function Home() {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin: MouseEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const body = JSON.stringify({
			email,
			password,
		});
		fetch("https://reksismul-backend-production.up.railway.app/v1/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		})
			.then(async (response) => {
				if (response.status !== 200) {
					toast.error("Failed to login.");
					return;
				}
				const responseJson = await response.json();
				const token = responseJson.data.access_token;
				const token_type = responseJson.data.token_type;
				localStorage.setItem("token", `${token_type} ${token}`);

				const user_metadata = {
					id: responseJson.data.user.id,
					email: responseJson.data.user.user_metadata.email,
					full_name: responseJson.data.user.user_metadata.full_name,
					role: responseJson.data.user.user_metadata.role,
				};
				dispatch(setUser(user_metadata));
				dispatch(login());
				toast.success("Logged in!");
				if (user_metadata.role == "STUDENT") {
					router.push("/assignment/student");
				} else if (user_metadata.role == "INSTRUCTOR") {
					router.push("/assignment/instructor");
				} else {
					router.push("/");
				}
				return;
			})
			.catch(() => {
				toast.error("Something went wrong..");
			});
	};

	return (
		<section
			className={
				"min-h-screen flex flex-col align-middle justify-center text-center bg-[#2E4F4F] p-16 " +
				poppins.className
			}
		>
			<Image
				className="mx-auto"
				src={"/logo.png"}
				alt="Logo CaptureSubmit"
				width={400}
				height={400}
			/>
			<form
				className="flex flex-col align-middle justify-evenly bg-white px-7 py-12 gap-5 rounded-3xl mx-auto md:w-[500px]"
				onSubmit={handleLogin}
			>
				<h1>Login to your account</h1>
				<input
					className="bg-[#CBE4DE] px-6 py-3 rounded-full drop-shadow-lg text-sm"
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
				<input
					className="bg-[#CBE4DE] px-6 py-3 rounded-full drop-shadow-lg text-sm"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<input
					className="bg-[#2E4F4F] text-white w-min px-6 py-3 mx-auto rounded-full text-sm mt-5"
					type="submit"
				/>
			</form>
		</section>
	);
}
