import Image from "next/image";
import Template from "root/components/template";
import { login } from "root/redux/slices/global";
import { useAppDispatch } from "root/redux/hooks";
import { useRouter } from "next/router";

export default function Home() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	return (
		<section className="min-h-screen flex flex-col align-middle justify-center text-center">
			<h1>Login</h1>
			<button
				onClick={() => {
					dispatch(login());
					router.replace("/");
				}}
			>
				Test Login
			</button>
		</section>
	);
}
