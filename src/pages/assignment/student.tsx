import Template from "root/components/template";
import { useRouter } from "next/router";
import { Poppins } from "next/font/google";
import { useEffect, useState, MouseEventHandler } from "react";
import { toast } from "react-toastify";
import { AssignmentType } from "root/types/assignmentType";

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

interface SubmissionData {
  score: number | null;
}

export default function Student() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [submissionData, setSubmissionData] = useState<{
    [key: string]: SubmissionData;
  }>({});
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  function page(array: AssignmentType[], pageSize: number, pageNumber: number) {
    pageNumber--;
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  }

  const handleSeeMore: MouseEventHandler<HTMLButtonElement> = (e) => {
    const id = e.currentTarget.value;
    router.push("/assignment/answer/" + id);
  };
  const handlePage: MouseEventHandler<HTMLButtonElement> = (e) => {
    const direction = e.currentTarget.value;
    if (direction === "Previous") {
      setCurrentPage(currentPage - 1);
    } else if (direction === "Next") {
      setCurrentPage(currentPage + 1);
    }
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === undefined || token === null) {
      window.location.replace("/auth/login");
      return;
    }

    const fetchSubmissionData = async (assignmentId: string) => {
      try {
        const response = await fetch(
          `https://reksismul-backend-production.up.railway.app/v1/submission/list?id=${assignmentId}`,
          {
            method: "GET",
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.status !== 200) {
          toast.error("Failed to retrieve submission items");
          return;
        }
        const responseJson = await response.json();
        const submissionItem = responseJson.data.find(
          (item: any) =>
            item.submission && item.submission.assignment_id === assignmentId
        );
        if (submissionItem && submissionItem.submission) {
          const { score } = submissionItem.submission;

          // Update submission data state with score for this assignment
          setSubmissionData((prevState) => ({
            ...prevState,
            [assignmentId]: { score },
          }));
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetch(
      "https://reksismul-backend-production.up.railway.app/v1/assignment/list",
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    ).then(async (response) => {
      if (response.status !== 200) {
        toast.error("Failed to retrieve assignment items");
        return;
      }
      const responsejson = await response.json();
      setAssignments(responsejson.data);

      responsejson.data.forEach((assignment: AssignmentType) => {
        fetchSubmissionData(assignment.assignmentID);
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Template>
        {/* mobile */}
        <div className="md:hidden bg-white flex flex-col justify-start p-10">
          <h1
            className={`${poppinsXB.className} mb-5 text-2xl md:text-4xl text-left`}
          >
            All Assignments
          </h1>
          <p className={poppins.className}>
            You have {assignments.length} assignments.
          </p>
          {page(assignments, pageSize, currentPage).map((row, index) => {
            const dateStart = new Date(row.dateStart);
            const dateEnd = new Date(row.dateDeadline);
            return (
              <div
                className="max-w-sm flex flex-col bg-[#CBE4DE] rounded-lg p-3 shadow-md mt-5"
                key={row.assignmentID}
              >
                <div
                  className={`${poppins.className} text-sm text-center space-y-1 mb-3`}
                >
                  <p>Assignment Title: </p>
                  <p className="font-bold">{row.namaAssignment}</p>
                </div>
                <hr className="bg-[#2E4F4F] w-full h-0.5"></hr>
                <div className="flex flex-row justify-evenly text-xs text-center">
                  <div className={`${poppins.className} w-1/2 my-3`}>
                    <p>Start: </p>
                    <p className="font-bold">
                      {dateStart.getDate()}-{dateStart.getMonth() + 1}-
                      {dateStart.getFullYear()}
                    </p>
                    <p className="font-bold">{row.timeStart.substring(0, 5)}</p>
                  </div>
                  <div className="w-px bg-[#2E4F4F]"></div>
                  <div className={`${poppins.className} w-1/2 my-3`}>
                    <p>End: </p>
                    <p className="font-bold">
                      {dateEnd.getDate()}-{dateEnd.getMonth() + 1}-
                      {dateEnd.getFullYear()}
                    </p>
                    <p className="font-bold">
                      {row.timeDeadline.substring(0, 5)}
                    </p>
                  </div>
                </div>
                <hr className="bg-[#2E4F4F] w-full h-0.5"></hr>
                <div className="flex flex-row justify-evenly text-sm text-center">
                  <div className={`${poppins.className} w-1/2 my-3`}>
                    <p>Status: </p>
                    <p className="font-bold">
                      {!submissionData[row.assignmentID]?.score
                        ? "Unreviewed"
                        : "Reviewed"}
                    </p>
                  </div>
                  <div className="w-px bg-[#2E4F4F]"></div>
                  <div className={`${poppins.className} w-1/2 my-3`}>
                    <p>Score: </p>
                    <p className="font-bold">
                      {!submissionData[row.assignmentID]?.score
                        ? "-"
                        : submissionData[row.assignmentID]?.score}
                    </p>
                  </div>
                </div>
                <button
                  className={`${poppinsB.className} text-white text-xs bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full p-2 shadow-md`}
                  onClick={handleSeeMore}
                  value={row.assignmentID}
                >
                  See More
                </button>
              </div>
            );
          })}
        </div>

        {/* desktop */}
        <div className="hidden md:flex flex-col justify-start p-10">
          <h1
            className={`${poppinsXB.className} mb-5 text-2xl md:text-4xl text-left`}
          >
            All Assignments
          </h1>
          <p className={poppins.className}>
            You have {assignments.length} assignments.
          </p>
          <table className="table-fixed text-center text-xs md:text-sm mt-5">
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
              {page(assignments, pageSize, currentPage).map((row, index) => {
                const rowbg = index % 2 === 0 ? "bg-white" : "bg-[#CBE4DE]";
                return (
                  <tr className={rowbg} key={row.assignmentID}>
                    <td className="p-3">
                      {index + 1 + (currentPage - 1) * pageSize}.
                    </td>
                    <td className="p-3">{row.namaAssignment}</td>
                    <td className="p-3">{row.dateStart}</td>
                    <td className="p-3">{row.timeStart}</td>
                    <td className="p-3">{row.dateDeadline}</td>
                    <td className="p-3">{row.timeDeadline}</td>
                    <td className="p-3">
                      {!submissionData[row.assignmentID]?.score
                        ? "-"
                        : submissionData[row.assignmentID]?.score}
                    </td>
                    <td className="p-3">
                      {!submissionData[row.assignmentID]?.score
                        ? "Unreviewed"
                        : "Reviewed"}
                    </td>
                    <td className="p-3">
                      <button
                        className={`${poppinsB.className} text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full p-3 shadow-md`}
                        onClick={handleSeeMore}
                        value={row.assignmentID}
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

        <div className="bg-white flex flex-row space-x-10 justify-center items-center pb-10">
          <button
            onClick={handlePage}
            value={"Previous"}
            disabled={currentPage === 1}
            className={`${poppinsB.className} w-min text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full p-3 shadow-md`}
          >
            Previous
          </button>
          <p className={poppins.className}>Page {currentPage}</p>
          <button
            onClick={handlePage}
            value={"Next"}
            disabled={currentPage * pageSize >= assignments.length}
            className={`${poppinsB.className} w-min text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full p-3 shadow-md`}
          >
            Next
          </button>
        </div>
      </Template>
    </div>
  );
}
