import CardTable from "root/components/cardTable";
import { IoIosAddCircleOutline } from "react-icons/io";
import Template from "root/components/template";
import { AssignmentType } from "root/types/assignmentType";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "root/components/modal";
import { FormEventHandler, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { Poppins } from "next/font/google";


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

export default function InstuctorPage() {
  const currentDate = new Date();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);

  const [formData, setFormData] = useState({
    namaAssignment: "",
    instruction: "",
    dateStart: currentDate,
    timeStart: currentDate,
    dateDeadline: currentDate,
    timeDeadline: currentDate,
    jumlahSubmission: "",
    judulAssignment: '',
    deskripsiAssignment: ''
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // Mengambil token dari localStorage
        const token = localStorage.getItem('token');
        console.log(token);

        // Melakukan fetch data dari API dengan menggunakan token bearer
        const response = await fetch('http://localhost:3333/v1/assignment/list', {
          headers: {
            Authorization: `${token}`,
          },
        });



        if (response.ok) {
          // Mengubah respons API menjadi format JSON
          const data = await response.json();
          console.log(data);
          // Menyimpan data tugas ke state assignments
          setAssignments(data.data);
        } else {
          console.error('Gagal mengambil data tugas');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    // Memanggil fungsi fetchAssignments saat komponen dimuat
    fetchAssignments();
  }, []);

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
    e.preventDefault();
    const data = {
      namaAssignment: formData.namaAssignment,
      judulAssignment: formData.judulAssignment,
      dateStart: dayjs(formData.dateStart).format("YYYY-MM-DD"),
      timeStart: dayjs(formData.timeStart).format("HH:mm"),
      dateDeadline: dayjs(formData.dateDeadline).format("YYYY-MM-DD"),
      timeDeadline: dayjs(formData.dateStart).format("HH:mm"), // Assuming you intended to keep formData.dateStart here
      jumlahSubmission: formData.jumlahSubmission,
      deskripsiAssignment: formData.deskripsiAssignment
    };

    console.log(data)

    const token = localStorage.getItem('token');

    fetch("http://localhost:3333/v1/assignment/create", {
      method: "post",
      headers: {
        Authorization: `${token}`,
        'content-type': 'Application/json'
      },
      body: JSON.stringify(data),
    })
      .then((result) => result.json())
      .then((data) => {
        console.log(data);
        setAssignments((prevState) => [...prevState, data]);
        setIsOpen(false);
      })
      .catch((error) => console.error(error));
  };

  return (
    <Template>
      <>
        <section className="bg-white min-h-screen p-5">
          <div className="flex items-center justify-between mb-10">
            <h1 className="font-bold text-2xl md:text-[2rem]">All Assignment</h1>
            <a href="#" className="md:hidden" onClick={() => setIsOpen(true)}>
              <IoIosAddCircleOutline
                size={40}
                className="my-auto hover:bg-[#2E4F4F] hover:rounded-full hover:text-white"
              />
            </a>
          </div>
          <div className="flex flex-col space-y-10 md:hidden">
            {assignments.length != 0 ? (
              assignments.map((assign, index) => (
                <CardTable key={index} data={assign} />
              ))
            ) : (
              <p className="text-center text-lg">No Assignment</p>
            )}
          </div>
          {/* <table className="table table-fixed w-full hidden md:table">
            <thead className="text-white rounded-header">
              <tr>
                <th className="py-5">No</th>
                <th className="py-5">Nama Assignment</th>
                <th className="py-5">Date Start</th>
                <th className="py-5">Time Start</th>
                <th className="py-5">Date Deadline</th>
                <th className="py-5">Time Deadline</th>
                <th className="py-5">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assign, index) => (
                <tr key={index} className="text-center">
                  <td>{index + 1}.</td>
                  <td>{assign.namaAssignment}</td>
                  <td>{assign.dateStart}</td>
                  <td>{assign.timeStart}</td>
                  <td>{assign.dateDeadline}</td>
                  <td>{assign.timeDeadline}</td>
                  <td>
                    <a
                      href="#"
                      className="bg-[#2E4F4F] hover:bg-[#233b3b] px-4 py-3 rounded-full text-white font-semibold"
                    >
                      See More
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}
          <table className="table table-fixed w-full hidden md:table">
            <thead className={`${poppinsB.className} text-white bg-[#0E8388]`}>
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Nama Assignment</th>
                <th className="p-3">Date Start</th>
                <th className="p-3">Time Start</th>
                <th className="p-3">Date Deadline</th>
                <th className="p-3">Time Deadline</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className={poppins.className}>
              {assignments.map((assign, index) => (
                <tr className={index % 2 === 0 ? "bg-white" : "bg-[#CBE4DE]"} key={index}>
                  <td className="p-3 text-center align-middle ">{index + 1}.</td>
                  <td className="p-3 text-center align-middle">{assign.namaAssignment}</td>
                  <td className="p-3 text-center align-middle ">{assign.dateStart}</td>
                  <td className="p-3 text-center align-middle">{assign.timeStart}</td>
                  <td className="p-3 text-center align-middle">{assign.dateDeadline}</td>
                  <td className="p-3 text-center align-middle">{assign.timeDeadline}</td>
                  <td className="p-3 text-center align-middle">
                    <a
                      href="#"
                      className={`${poppinsB.className} text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full p-3 shadow shadow-md`}
                    >
                      See More
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


          {assignments.length == 0 && (
            <p className="mt-5 text-center text-lg hidden md:block">
              No Assignment
            </p>
          )}
        </section>
        <Modal isOpen={isOpen}>
          <ModalHeader onClose={() => setIsOpen(false)}>
            <h3 className="text-xl font-bold ">
              Add New <span className="text-[#2E4F4F]">Assignment</span>
            </h3>
          </ModalHeader>
          <form action="" method="post" onSubmit={handleSubmit}>
            <ModalBody className="space-y-5">
              <div className="w-full flex flex-col">
                <label htmlFor="inputTitle" className="mb-3 font-bold">
                  Title
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
                <label htmlFor="inputInstruction" className="mb-3 font-bold">
                  Instruction
                </label>
                <input
                  id="inputInstruction"
                  name="judulAssignment"
                  className="border p-2 rounded"
                  onChange={handleChangeForm}
                />
              </div>

              <div className="w-full flex flex-col">
                <label htmlFor="inputInstruction" className="mb-3 font-bold">
                  Jumlah Submision
                </label>
                <input
                  type="number"
                  id="inputInstruction"
                  name="jumlahSubmission"
                  className="border p-2 rounded"
                  onChange={handleChangeForm}
                />
              </div>
              <div className="w-full flex flex-col">
                <label htmlFor="inputInstruction" className="mb-3 font-bold">
                  Description
                </label>
                <input
                  id="inputInstruction"
                  name="deskripsiAssignment"
                  className="border p-2 rounded"
                  onChange={handleChangeForm}
                />
              </div>
              <div className="w-full space-y-5">
                <div className="flex flex-row space-x-5 items-center">
                  <div className="w-4/12">
                    <p className="font-bold">Start Time</p>
                  </div>
                  <div className="w-4/12">
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
                  <div className="w-4/12">
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
                  <div className="w-4/12">
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
                  <div className="w-4/12">
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
            </ModalBody>
            <ModalFooter>
              <button
                type="submit"
                className="bg-[#2E4F4F] hover:bg-[#233b3b] px-4 py-3 rounded-full text-white font-semibold"
              >
                Create
              </button>
            </ModalFooter>
          </form>
        </Modal>
      </>
    </Template>
  );
}
