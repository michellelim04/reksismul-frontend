import Template from "root/components/template";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

export default function Home() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === undefined || token === null) {
      window.location.replace("/auth/login");
      return;
    }
    fetch("http://localhost:3333/v1/assignment/list", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }).then(async (response) => {
      if (response.status !== 200) {
        toast.error("Failed to retrieve items");
        return;
      }
      const responsejson = await response.json();
      setAssignments(responsejson.data);
    });
  });
  return (
    <>
      <Template>
        {/* mobile */}
        <div className="md:hidden min-h-screen flex flex-col justify-start p-10">
          <h1
            className={`${poppinsXB.className} mb-10 text-2xl md:text-4xl text-left`}
          >
            All Assignments
          </h1>
          {assignments.map((row, index) => {
            const dateStart = new Date(row.dateStart);
            const dateEnd = new Date(row.dateDeadline);
            return (
              <div
                className="max-w-sm flex flex-col bg-[#CBE4DE] rounded-lg p-3 shadow shadow-md mb-8"
                key={row.assignmentID}
              >
                <div
                  className={`${poppins.className} text-sm text-center space-y-1 mb-3`}
                >
                  <p>Assignment Title: </p>
                  <p className="font-bold">{row.assignmentID}</p>
                </div>
                <hr className="bg-[#2E4F4F] w-full h-0.5"></hr>
                <div className="flex flex-row justify-evenly text-xs text-center">
                  <div className={`${poppins.className} w-1/2 my-3`}>
                    <p>Start: </p>
                    <p className="font-bold">
                      {dateStart.getDate()}-{dateStart.getMonth() + 1}-
                      {dateStart.getFullYear()}
                    </p>
                    <p className="font-bold">
                      {row.timeStart.substring(0, 2)}
                      {row.timeStart.substring(2, 5)}
                    </p>
                  </div>
                  <div className="w-px bg-[#2E4F4F]"></div>
                  <div className={`${poppins.className} w-1/2 my-3`}>
                    <p>End: </p>
                    <p className="font-bold">
                      {dateEnd.getDate()}-{dateEnd.getMonth() + 1}-
                      {dateEnd.getFullYear()}
                    </p>
                    <p className="font-bold">
                      {row.timeDeadline.substring(0, 2)}
                      {row.timeDeadline.substring(2, 5)}
                    </p>
                  </div>
                </div>
                <hr className="bg-[#2E4F4F] w-full h-0.5"></hr>
                <div className="flex flex-row justify-evenly text-sm text-center">
                  <div className={`${poppins.className} w-1/2 my-3`}>
                    <p>Status: </p>
                    <p className="font-bold">Lorem Ipsum</p>
                  </div>
                  <div className="w-px bg-[#2E4F4F]"></div>
                  <div className={`${poppins.className} w-1/2 my-3`}>
                    <p>Score: </p>
                    <p className="font-bold">100</p>
                  </div>
                </div>
                <button
                  className={`${poppinsB.className} text-white text-xs bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full p-2 shadow shadow-md`}
                >
                  See More
                </button>
              </div>
            );
          })}
        </div>

        {/* desktop */}
        <div className="min-h-screen md:flex flex-col justify-start p-10">
          <h1
            className={`${poppinsXB.className} mb-10 text-2xl md:text-4xl text-left`}
          >
            All Assignments
          </h1>
          <table className="table-fixed text-center text-xs md:text-sm">
            <thead className={`${poppinsB.className} text-white bg-[#0E8388]`}>
              <tr>
                <th className="p-3 rounded-s-lg">#</th>
                <th className="p-3">Assignment Title</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">Start Time</th>
                <th className="p-3">End Date</th>
                <th className="p-3">End Time</th>
                <th className="p-3">Score</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-e-lg">Action</th>
              </tr>
            </thead>
            <tbody className={poppins.className}>
              {assignments.map((row, index) => {
                const rowbg = index % 2 === 0 ? "bg-white" : "bg-[#CBE4DE]";
                return (
                  <tr className={rowbg} key={row.assignmentID}>
                    <td className="p-3">{index + 1}.</td>
                    <td className="p-3">{row.judulAssignment}</td>
                    <td className="p-3">{row.dateStart}</td>
                    <td className="p-3">{row.timeStart}</td>
                    <td className="p-3">{row.dateDeadline}</td>
                    <td className="p-3">{row.timeDeadline}</td>
                    <td className="p-3">Lorem Ipsum</td>
                    <td className="p-3">Lorem Ipsum</td>
                    <td className="p-3">
                      <button
                        className={`${poppinsB.className} text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full p-3 shadow shadow-md`}
                      >
                        See More
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Template>
    </>
  );
}
