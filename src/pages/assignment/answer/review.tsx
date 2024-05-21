import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Template from "root/components/template";
import { Poppins } from "next/font/google";
import { AssignmentType } from "root/types/assignmentType";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
	weight: ["400"],
});

const poppinsB = Poppins({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
	weight: ["600"],
});

const poppinsXB = Poppins({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
	weight: ["800"],
});

export default function Record() {
	const [assignment, setAssignment] = useState<AssignmentType>();
	const params = useSearchParams();
	const router = useRouter();
	const [detailSubmission, setDetailSubmission] = useState<any>({});

	const getDataDetailSubmission = async (id: string) => {
		try {
			const token = localStorage.getItem("token");
			const detailSubmission = await fetch(
				`http://localhost:3333/v1/submission/get/${id}`,
				{
					headers: {
						Authorization: `${token}`,
					},
				}
			);

			if (detailSubmission.ok) {
				const data = await detailSubmission.json();
				setDetailSubmission(data.data[0]);
			}
		} catch (error) {
			console.log("failed load data : ", error);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token === undefined || token === null) {
			window.location.replace("/auth/login");
			return;
		}

		const detailAssigment = () => {
			fetch("http://localhost:3333/v1/assignment/list/" + params.get("id"), {
				method: "GET",
				headers: {
					Authorization: token,
				},
			}).then(async (response) => {
				if (response.status !== 200) {
					toast.error("Failed to retrieve items");
					return;
				}

				const responseJson = await response.json();
				setAssignment(responseJson.data[0]);
			});
		};

		if (params.get("id")) {
			detailAssigment();
			getDataDetailSubmission(params.get("submissionId") as string);
		}
	}, [params]);

	return (
		<div className="min-h-screen bg-white">
			<Template>
				<div className="flex flex-row h-min p-10 pb-0 md:pr-20 justify-between items-center">
					<h1 className={`${poppinsXB.className} text-xl md:text-4xl`}>
						Answer Assignment
					</h1>
					<button
						className={`${poppinsB.className} text-white text-xs md:text-base bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full h-min px-5 py-3 md:px-7 shadow-md`}
						onClick={() => router.push(`/assignment/student`)}
					>
						Done
					</button>
				</div>
				<div className="mx-10 md:mr-20 rounded-3xl border border-[#0E8388]">
					<p className={`${poppinsXB.className} mx-5 my-3 text-xl`}>
						{assignment?.judulAssignment}
					</p>
					<hr className="bg-[#2E4F4F] h-0.5" />
					<div className="flex flex-row">
						<p
							className={`${poppins.className} mx-5 my-3 text-xs md:text-base`}
						>
							Assignment Start:{" "}
							<span className="font-bold text-[#0E8388]">
								{assignment?.dateStart} at{" "}
								{assignment?.timeStart?.substring(0, 5)}
							</span>
						</p>
						<div className="bg-slate-400 w-0.5 my-3"></div>
						<p
							className={`${poppins.className} mx-5 my-3 text-xs md:text-base`}
						>
							Assignment End:{" "}
							<span className="font-bold text-[#0E8388]">
								{assignment?.dateDeadline} at{" "}
								{assignment?.timeDeadline?.substring(0, 5)}
							</span>
						</p>
					</div>
					<hr className="bg-[#2E4F4F] h-0.5" />
					<p className={`${poppins.className} mx-5 my-3 text-xs md:text-sm`}>
						{assignment?.deskripsiAssignment}
					</p>
					<div className="flex w-full p-4 flex-col md:flex-row">
						<div className="flex w-full md:w-9/12 flex-col">
							<div className="flex h-[400px] bg-green-50 items-center justify-center w-full">
								<p className="text-green-500">You have submitted</p>
							</div>
						</div>

						{Object.keys(detailSubmission).length > 0 && (
							<div
								className={`flex w-full my-3 md:my-0 md:w-3/12 items-center`}
							>
								<div className="flex bg-white md:ml-3 w-full h-full flex-col p-3 shadow-md border border-gray-500 rounded-lg">
									<div className="flex w-full">
										<div className="flex w-full">
											<span className="text-lg">Score</span>
										</div>
										<div className="flex w-full justify-end">
											<span className="text-lg text-green-700 font-semibold">
												{detailSubmission.score !== null
													? detailSubmission.score
													: "-"}
											</span>
										</div>
									</div>
									<div className="flex w-full my-2">
										<div className="flex w-full">
											<span className="text-xs">Status</span>
										</div>
										<div className="flex w-full justify-end">
											<span className="text-xs text-green-700 font-medium">
												{detailSubmission.score !== null
													? "Granted"
													: "Unreviewed"}
											</span>
										</div>
									</div>
									<div className="flex w-full flex-col">
										<div className="flex w-full">
											<span className="text-xs">Feedback</span>
										</div>
										<div className="flex w-full mt-2">
											<textarea
												className="border border-gray-400 w-full  h-full p-2 text-xs"
												placeholder="Enter description"
												readOnly={true}
												value={
													detailSubmission.feedback === null
														? ""
														: detailSubmission.feedback
												}
											/>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</Template>
		</div>
	);
}
