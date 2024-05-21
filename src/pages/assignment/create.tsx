import { FormEventHandler, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/router";
import Template from "root/components/template";
import dayjs from "dayjs";

const CreateInstuctorPage: React.FC<React.ReactNode> = () => {
	const router = useRouter();
	const currentDate = new Date();
	const [formData, setFormData] = useState({
		namaAssignment: "",
		instruction: "",
		dateStart: currentDate,
		timeStart: currentDate,
		dateDeadline: currentDate,
		timeDeadline: currentDate,
		jumlahSubmission: "",
		judul: "",
	});

	const handleChangeForm = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e): void => {
		const token = localStorage.getItem("token");

		e.preventDefault();
		const data = {
			namaAssignment: formData.namaAssignment,
			dateStart: dayjs(formData.dateStart).format("YYYY-MM-DD"),
			judulAssignment: formData.judul,
			deskripsiAssignment: formData.instruction,
			timeStart: dayjs(formData.timeStart).format("HH:MM"),
			dateDeadline: dayjs(formData.dateDeadline).format("YYYY-MM-DD"),
			timeDeadline: dayjs(formData.timeDeadline).format("HH:MM"),
			jumlahSubmission: formData.jumlahSubmission,
		};

		fetch("http://35.239.167.8/v1/assignment/create", {
			method: "post",
			headers: {
				Authorization: `${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((result) => result.json())
			.then((data) => router.push("/assignment/instructor"))
			.catch((error) => console.error(error));
	};

	return (
		<Template>
			<div className="bg-white min-h-screen p-5">
				<h1 className="font-bold text-2xl md:text-[2rem]">
					Add New <span className="text-[#2E4F4F]">Assignment</span>
				</h1>
				<form action="" method="post" className="mt-5" onSubmit={handleSubmit}>
					<div className="space-y-5">
						<div className="w-full flex flex-col">
							<label htmlFor="inputTitle" className="mb-3 font-bold">
								Name Assignment
							</label>
							<input
								id="inputTitle"
								type="text"
								name="namaAssignment"
								className="border p-2 rounded"
								onChange={handleChangeForm}
								required
							/>
						</div>
						<div className="w-full flex flex-col">
							<label htmlFor="inputTitle" className="mb-3 font-bold">
								Title
							</label>
							<input
								id="inputTitle"
								type="text"
								name="judul"
								className="border p-2 rounded"
								onChange={handleChangeForm}
								required
							/>
						</div>
						<div className="w-full flex flex-col">
							<label htmlFor="inputTitle" className="mb-3 font-bold">
								Jumlah Submission
							</label>
							<input
								id="inputTitle"
								type="number"
								name="jumlahSubmission"
								className="border p-2 rounded"
								onChange={handleChangeForm}
								required
							/>
						</div>
						<div className="w-full flex flex-col">
							<label htmlFor="inputInstruction" className="mb-3 font-bold">
								Instruction
							</label>
							<textarea
								id="inputInstruction"
								name="instruction"
								className="border p-2 rounded"
								rows={5}
								onChange={handleChangeForm}
							/>
						</div>
						<div className="w-full space-y-5">
							<div className="flex flex-row space-x-5 items-center">
								<div className="w-4/12">
									<p className="font-bold">Start Time</p>
								</div>
								<div className="w-4/12 flex md:justify-center">
									<DatePicker
										selected={formData.dateStart}
										className="border rounded p-1 w-full"
										dateFormat="dd/MM/YYYY"
										onChange={(date) => {
											setFormData((prevState) => ({
												...prevState,
												dateStart: date || new Date(),
											}));
										}}
									/>
								</div>
								<div className="w-4/12 flex md:justify-end">
									<DatePicker
										selected={formData.timeStart}
										className="border rounded p-1 w-full"
										onChange={(date) =>
											setFormData((prevState) => ({
												...prevState,
												timeStart: date || new Date(),
											}))
										}
										showTimeSelect
										showTimeSelectOnly
										timeCaption="Time"
										dateFormat="HH:mm"
										timeFormat="HH:mm"
									/>
								</div>
							</div>
							<div className="flex flex-row space-x-5 items-center">
								<div className="w-4/12">
									<p className="font-bold">End Time</p>
								</div>
								<div className="w-4/12 flex md:justify-center">
									<DatePicker
										selected={formData.dateDeadline}
										className="border rounded p-1 w-full"
										dateFormat="dd/MM/YYYY"
										onChange={(date) => {
											setFormData((prevState) => ({
												...prevState,
												dateDeadline: date || new Date(),
											}));
										}}
									/>
								</div>
								<div className="w-4/12 flex md:justify-end">
									<DatePicker
										selected={formData.timeDeadline}
										className="border rounded p-1 w-full"
										onChange={(date) =>
											setFormData((prevState) => ({
												...prevState,
												timeDeadline: date || new Date(),
											}))
										}
										showTimeSelect
										showTimeSelectOnly
										timeCaption="Time"
										dateFormat="HH:mm"
										timeFormat="HH:mm"
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="space-x-3 flex justify-end mt-5">
						<button
							type="button"
							className="bg-[#cbe4de] hover:bg-[#b3c9c4] px-4 py-3 rounded-full font-semibold"
							onClick={(e) => {
								e.preventDefault();
								router.push("/assignment/instructor");
							}}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="bg-[#2E4F4F] hover:bg-[#233b3b] px-4 py-3 rounded-full text-white font-semibold"
						>
							Create
						</button>
					</div>
				</form>
			</div>
		</Template>
	);
};

export default CreateInstuctorPage;
