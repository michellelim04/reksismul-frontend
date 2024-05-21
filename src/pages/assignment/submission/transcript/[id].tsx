"use client";

import Template from "root/components/template";
import { useEffect, useState, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Poppins } from "next/font/google";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import moment from "moment-timezone";
import { toast } from "react-toastify";

const poppinsB = Poppins({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
	weight: ["600"],
});

const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
	weight: ["400"],
});

const FeedbackAssignment = () => {
	const router = useRouter();
	const params = useParams();
	const [detailSubmission, setDetailSubmission] = useState<any>();
	const [editScore, setEditScore] = useState(false);
	const [newScore, setScore] = useState("");
	const [feedBack, setFeedBack] = useState("");
	const [transcriptReady, setTranscriptReady] = useState<boolean>(false);
	const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const [transcript, setTranscript] = useState<any>(null);

	const handleButtonClick = () => {
		setEditScore(true);
	};

	const handleSaveClick = async () => {
		try {
			const token = localStorage.getItem("token");
			const updateScoreAndFeedBack = await fetch(
				`https://reksismul-backend-production.up.railway.app/v1/submission/update/${params.id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `${token}`,
					},
					body: JSON.stringify({
						score: newScore,
						feedback: feedBack,
					}),
				}
			);

			if (updateScoreAndFeedBack.status === 200) {
				setEditScore(false);
				getDataDetailSubmission(params.id as string);
			}
		} catch (error) {
			console.log("Failed !");
		}
	};

	const getDataDetailSubmission = async (id: string) => {
		try {
			const token = localStorage.getItem("token");
			const detailSubmission = await fetch(
				`https://reksismul-backend-production.up.railway.app/v1/submission/get/${id}`,
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
	const fetchTranscript = useCallback(async () => {
		const token = window.localStorage.getItem("token");
		if (token === null) {
			router.replace("/auth/login");
			return;
		}
		if (params === null) return;
		const transcriptFetch = await fetch(
			"https://reksismul-backend-production.up.railway.app/v1/submission/transcript/" +
				params.id,
			{
				method: "GET",
				headers: {
					Authorization: token,
				},
			}
		);
		if (transcriptFetch.status !== 200) {
			toast.error("Failed to fetch transcripts");
			return;
		}
		const responseJson = await transcriptFetch.json();
		const transcriptArray = [];
		for (const alternative of responseJson.data.results) {
			const text = alternative.alternatives[0].transcript;
			transcriptArray.push(text);
		}
		setTranscript(transcriptArray.join(" "));
	}, [params, router]);

	useEffect(() => {
		if (params !== null) {
			getDataDetailSubmission(params.id as string);
		}
	}, [params]);
	useEffect(() => {
		if (params === null) return;
		const token = window.localStorage.getItem("token");
		if (token == null) {
			router.replace("/auth/login");
			return;
		}
		fetch(
			"https://reksismul-backend-production.up.railway.app/v1/submission/video/" +
				params.id,
			{
				method: "GET",
				headers: {
					Authorization: token,
				},
			}
		).then(async (response) => {
			if (response.status !== 200) {
				toast.error("Failed fetching video stream");
				return;
			}
			const responsejson = await response.json();
			const responseData = responsejson.data.url;
			setVideoUrl(responseData);
		});
		fetch(
			"https://reksismul-backend-production.up.railway.app/v1/submission/check-transcript/" +
				params.id,
			{
				method: "GET",
				headers: {
					Authorization: token,
				},
			}
		).then(async (response) => {
			if (response.status !== 200) {
				toast.error("Failed fetching transcript status");
				return;
			}
			const responsejson = await response.json();
			const responseData = responsejson.data.transcript_status;
			setTranscriptReady(responseData);
		});
	}, [router, params]);

	return (
		<Template>
			<section className="bg-white p-5">
				<div className="flex justify-between items-center ">
					<h1
						className={`${poppinsB.className} font-bold text-2xl md:text-[2rem] mt-2`}
					>
						{detailSubmission ? detailSubmission.Users.email : ""}
					</h1>
					<button
						onClick={() => router.push("/assignment/instructor")}
						className={`${poppinsB.className} text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full px-5 py-3 shadow-md`}
					>
						Done
					</button>
				</div>
				<div className="flex flex-col">
					<span className={`${poppins.className} mt-3 mb-5`}>
						Submitted on{" "}
						{moment(detailSubmission?.created_at).format("DD/MM/YYYY")}
					</span>
				</div>

				<div className="hidden md:flex">
					<video
						src={videoUrl as string}
						controls
						className="md:w-2/3 bg-gray-100 p-5 h-[60vh]"
					></video>
					<div className="md:w-1/3 bg-white rounded-lg shadow-lg p-5 ml-0 md:ml-5 mt-5 md:mt-0 flex flex-col justify-start items-center">
						{editScore ? (
							<>
								<button
									className={`${poppinsB.className} text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full px-6 py-3 text-m shadow-md`}
									onClick={handleSaveClick}
								>
									Save
								</button>
								<form className="w-full mt-5">
									<div className="mb-4">
										<label
											className={`block text-gray-700 text-l font-bold mb-2 ${poppinsB.className}`}
											htmlFor="score"
										>
											Score
										</label>
										<input
											className={`${poppins.className} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
											type="number"
											value={newScore}
											onChange={(e) => setScore(e.target.value)}
											placeholder="Enter the score"
										/>
									</div>
									<div className="mb-4">
										<label
											className={`block text-gray-700 text-l font-bold mb-2 ${poppinsB.className}`}
											htmlFor="feedback"
										>
											Feedback
										</label>
										<textarea
											className={`${poppins.className} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
											value={feedBack}
											onChange={(e) => setFeedBack(e.target.value)}
											placeholder="Enter your feedback"
											rows={1}
										/>
									</div>
								</form>
							</>
						) : (
							<>
								<button
									className={`${poppinsB.className} text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full px-6 py-3 text-m shadow-md`}
									onClick={handleButtonClick}
								>
									Edit
								</button>
								<div className="flex flex-col justify-center items-center flex-grow ">
									<p className={`${poppinsB.className} text-l font-bold mb-2`}>
										Score:{" "}
										{detailSubmission?.score !== null
											? detailSubmission?.score
											: "Not yet given"}
									</p>
									<p className={`${poppinsB.className} text-l font-bold`}>
										Feedback:{" "}
										{detailSubmission?.feedback !== null
											? detailSubmission?.feedback
											: "Not yet provided"}
									</p>
								</div>
							</>
						)}
					</div>
				</div>
				<div className="flex flex-wrap flex-col h-full md:hidden">
					<video
						src={videoUrl as string}
						controls
						className="w-full md:w-2/3 bg-gray-100 p-5 h-64 mb-3"
					></video>
					<div className=" w-full md:w-1/3 bg-white rounded-lg shadow-lg p-5 ml-0 md:ml-5 mt-5 mb-5 md:mt-0 h-64 flex flex-col justify-start items-center">
						{editScore ? (
							<>
								<button
									className={`${poppinsB.className} text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full px-6 py-3 text-m shadow-md`}
									onClick={handleSaveClick}
								>
									Save
								</button>
								<form className="w-full mt-5">
									<div className="mb-4">
										<label
											className={`block text-gray-700 text-l font-bold mb-2 ${poppinsB.className}`}
											htmlFor="score"
										>
											Score
										</label>
										<input
											className={`${poppins.className} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
											id="score"
											type="number"
											value={newScore}
											onChange={(e) => setScore(e.target.value)}
											placeholder="Enter the score"
										/>
									</div>
									<div className="mb-4">
										<label
											className={`block text-gray-700 text-l font-bold mb-2 ${poppinsB.className}`}
											htmlFor="feedback"
										>
											Feedback
										</label>
										<textarea
											className={`${poppins.className} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
											id="feedback"
											value={feedBack}
											onChange={(e) => setFeedBack(e.target.value)}
											placeholder="Enter your feedback"
											rows={1}
										/>
									</div>
								</form>
							</>
						) : (
							<>
								<button
									className={`${poppinsB.className} text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full px-6 py-3 text-m shadow-md`}
									onClick={handleButtonClick}
								>
									Edit
								</button>
								<div className="flex flex-col justify-center items-center flex-grow ">
									<p className={`${poppinsB.className} text-l font-bold mb-2`}>
										Score:{" "}
										{detailSubmission?.score !== null
											? detailSubmission?.score
											: "Not yet given"}
									</p>
									<p className={`${poppinsB.className} text-l font-bold`}>
										Feedback:{" "}
										{detailSubmission?.feedback !== null
											? detailSubmission?.feedback
											: "Not yet provided"}
									</p>
								</div>
							</>
						)}
					</div>
				</div>

				<div className="w-full mt-5">
					<h2 className={`${poppinsB.className} text-2xl font-bold`}>
						Transcript
					</h2>
					<div className="w-full h-1/4 mt-2">
						{!transcriptReady ? (
							<p className={`${poppins.className} text-xl font-bold mt-2`}>
								Transcript not yet provided
							</p>
						) : (
							<>
								<p className={`${poppins.className} text-lg font-bold mt-2`}>
									Transcript provided
								</p>
								<textarea
									value={transcript}
									className="w-full h-44 text-pretty text-justify"
								></textarea>
								{/* Button */}
								<button
									onClick={fetchTranscript}
									className={`${poppinsB.className} mt-3 text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-lg px-4 py-3 text-s shadow-md`}
								>
									View Transcript
								</button>
							</>
						)}
					</div>
				</div>
			</section>
		</Template>
	);
};
export default FeedbackAssignment;
