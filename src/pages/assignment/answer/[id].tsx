import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import Template from "root/components/template";
import { Poppins } from "next/font/google";
import { AssignmentType } from "root/types/assignmentType";
import { useRouter } from "next/router";
import moment from "moment-timezone";

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

export default function Answer() {
	const [assignment, setAssignment] = useState<AssignmentType>();
	const router = useRouter();
	const [permission, setPermission] = useState(false);
	const [stream, setStream] = useState<MediaStream>();
	const videoReference = useRef<HTMLVideoElement | null>(null);
	const recorderReference = useRef<MediaRecorder | undefined>();
	const [recordingData, setRecordingData] = useState<Blob>();
	const [recordingStatus, setRecordingStatus] =
		useState<string>("No Recording");

	const RequestPermission = async () => {
		if ("MediaRecorder" in window) {
			try {
				const inputStream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: {
						width: 1280,
						height: 720,
					},
				});
				setPermission(true);
				setStream(inputStream);
			} catch (e) {}
		} else {
			setPermission(false);
			toast.error("Unable to set camera permission");
		}
	};

	const StartRecording = async () => {
		try {
			if (stream === undefined) {
				toast.error("You need camera permissions!");
				return;
			}
			const recorder = new MediaRecorder(stream, {
				mimeType: "video/mp4",
			});
			recorder.ondataavailable = (event) => {
				setRecordingData(event.data);
				setRecordingStatus("Recording Stored!");
			};
			recorderReference.current = recorder;
			recorderReference.current.start();
			toast.success("Recording started!");
			setRecordingStatus("Recording!");
		} catch (e) {
			console.error(e);
			toast.error("Failed to start recording");
		}
	};
	const StopRecording = async () => {
		try {
			if (recorderReference.current === undefined) {
				toast.error("You need camera permissions!");
				return;
			}
			recorderReference.current.stop();
			toast.success("Recording stopped!");
			setRecordingStatus("Recording Stopped");
		} catch (e) {
			console.error(e);
			toast.error("Failed to stop recording");
		}
	};

	const UploadRecording = async () => {
		const token = window.localStorage.getItem("token");
		if (token === null) {
			router.replace("/auth/login");
			return;
		}

		if (recordingData === undefined) {
			toast.error("No recording found");
			return;
		}
		const url = URL.createObjectURL(recordingData as Blob);
		const hrefTag = document.createElement("a");
		hrefTag.download = "test.mp4";
		hrefTag.href = url;
		hrefTag.click();
		const formData = new FormData();
		formData.append("assignment_video", recordingData);
		if (!assignment) {
			router.replace("/");
			return;
		}
		setRecordingStatus("Uploading...");
		const uploadAssignment = await fetch(
			`http://localhost:3333/v1/assignment/submit/${assignment?.assignmentID}`,
			{
				method: "POST",
				headers: {
					Authorization: token,
				},
				body: formData,
			}
		).catch((err) => {
			console.error(err);
			toast.error("Failed to upload assignment");
			return null;
		});

		if (uploadAssignment === null) return;
		if (uploadAssignment.status !== 200) {
			toast.error("Failed to upload assignment");
			return;
		}
		toast.success("Uploaded!");

		const dataResponse = await uploadAssignment.json();
		router.push(
			`/assignment/answer/review?id=${router.query.id}&submissionId=${dataResponse.data.submission_id}`
		);
	};
	const ResetRecording = async () => {
		setRecordingData(undefined);
		setRecordingStatus("No Recording!");
	};

	useEffect(() => {
		if (stream === undefined) return;
		if (videoReference.current === null) return;
		videoReference.current.srcObject = stream;
	}, [permission, stream]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token === undefined || token === null) {
			window.location.replace("/auth/login");
			return;
		}

		const checkStatus = (result: any) => {
			fetch(
				`http://localhost:3333/v1/assignment/student-check/${router.query.id}`,
				{
					method: "GET",
					headers: {
						Authorization: token,
					},
				}
			).then(async (response) => {
				if (response.status === 200) {
					toast.error("Submission found for this assignment");

					const responseData = await response.json();
					router.push(
						`/assignment/answer/review?id=${router.query.id}&submissionId=${responseData.data.submission_id}`
					);
				} else {
					if (result !== undefined) {
						const currentDate = moment();
						const endDate = moment(
							result.dateDeadline + " " + result.timeDeadline
						);
						const startDate = moment(result.dateStart + " " + result.timeStart);

						const diffTime = endDate.diff(currentDate, "minutes");
						const diffTimeStart = startDate.diff(currentDate, "minutes");

						if (diffTimeStart > 0) {
							router.push(`/assignment/answer/closed?id=${router.query.id}`);
						}

						if (diffTime < 0) {
							router.push(`/assignment/answer/closed?id=${router.query.id}`);
						}
					}
				}
			});
		};

		const detailAssigment = async () => {
			fetch("http://localhost:3333/v1/assignment/list/" + router.query.id, {
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
				const result = responseJson.data[0];

				if (result !== undefined) {
					setAssignment(result);
					checkStatus(result);
				}
			});
		};

		if (router.query.id) {
			detailAssigment();
		}
	}, [router, stream]);

	return (
		<div className="min-h-screen bg-white">
			<Template>
				<div className="flex flex-row h-min p-10 pb-0 md:pr-20 justify-between items-center">
					<h1 className={`${poppinsXB.className} text-xl md:text-4xl`}>
						Answer Assignment
					</h1>
					<button
						className={`${poppinsB.className} text-white text-xs md:text-base bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full h-min px-5 py-3 md:px-7 shadow-md`}
						onClick={() => router.push("/assignment/student")}
					>
						Cancel
					</button>
				</div>
				<div className="m-10 md:mr-20 rounded-3xl border border-[#0E8388]">
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
							<div className="flex bg-gray-200 items-center justify-center">
								{permission && (
									<video
										autoPlay
										ref={videoReference}
										className="object-fill"
									></video>
								)}
								{!permission && (
									<div className="h-[400px] flex flex-col align-middle justify-center text-center">
										<h1>CAMERA PERMISSION REQUIRED</h1>
									</div>
								)}
							</div>
							<div className="flex border border-gray-500 rounded-md h-[40px] items-center justify-center my-3">
								<p className="text-xs">Camera used</p>
							</div>
						</div>
						<div className={`flex w-full md:w-3/12 items-center`}>
							<div className="flex w-full items-center flex-row md:flex-col justify-between md:justify-center">
								<div className="flex mx-0 md:mx-2 my-3">
									<span>{recordingStatus}</span>
								</div>
								<div className="flex mx-0 md:mx-2 my-3">
									<button
										className={`${poppinsB.className} text-white text-xs md:text-base bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full h-min px-5 py-3 md:px-7 shadow-md w-[100px] md:w-[120px]`}
										onClick={() => {
											StartRecording();
										}}
									>
										<span className="text-xs md:text-md">Start</span>
									</button>
								</div>
								<div className="flex mx-0 md:mx-2 my-3">
									<button
										className={`${poppinsB.className} text-white text-xs md:text-base bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full h-min px-5 py-3 md:px-7 shadow-md w-[100px] md:w-[120px]`}
										onClick={() => {
											StopRecording();
										}}
									>
										<span className="text-xs md:text-md">Stop</span>
									</button>
								</div>
								<div className="flex mx-0 md:mx-2 my-3">
									<button
										className={`${poppinsB.className} text-white text-xs md:text-base bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full h-min px-5 py-3 md:px-7 shadow-md w-[100px] md:w-[120px]`}
										onClick={() => UploadRecording()}
									>
										<span className="text-xs md:text-md">Upload</span>
									</button>
								</div>

								<div className="flex mx-0 md:mx-2 my-3">
									<button
										className={`${poppinsB.className} text-white text-xs md:text-base bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full h-min px-5 py-3 md:px-7 shadow-md w-[100px] md:w-[120px]`}
										onClick={RequestPermission}
									>
										<span className="text-xs md:text-md">Permission</span>
									</button>
								</div>
								<div className="flex mx-0 md:mx-2 my-3">
									<button
										className={`${poppinsB.className} text-white text-xs md:text-base bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full h-min px-5 py-3 md:px-7 shadow-md w-[100px] md:w-[120px]`}
										onClick={ResetRecording}
									>
										<span className="text-xs md:text-md">Reset</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Template>
		</div>
	);
}
