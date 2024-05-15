import { toast } from "react-toastify";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === undefined || token === null) {
      window.location.replace("/auth/login");
      return;
    }

    const detailAssigment = () => {
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
          const currentDate = moment();
          const endDate = moment(
            result.dateDeadline + " " + result.timeDeadline
          );
          const startDate = moment(result.dateStart + " " + result.timeStart);

          const diffTime = endDate.diff(currentDate, "minutes");
          const diffTimeStart = startDate.diff(currentDate, "minutes");

          if (diffTimeStart < 0 && diffTime > 0) {
            setAssignment(result);
          } else {
            router.push(`/assignment/answer/closed?id=${router.query.id}`);
          }
        }
      });
    };

    if (router.query.id) {
      detailAssigment();
    }
  }, [router.query.id]);

  return (
    <div className="min-h-screen bg-white">
      <Template>
        <div className="flex flex-row h-min p-10 pb-0 md:pr-20 justify-between items-center">
          <h1 className={`${poppinsXB.className} text-xl md:text-4xl`}>
            Answer Assignment
          </h1>
          <button
            className={`${poppinsB.className} text-white text-xs md:text-base bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full h-min px-5 py-3 md:px-7 shadow shadow-md`}
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
                {assignment?.dateStart} at{" "}
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
              <div className="flex h-[400px] bg-gray-200 items-center justify-center w-full">
                <p>Video</p>
              </div>
              <div className="flex border border-gray-500 rounded-md h-[40px] items-center justify-center my-3">
                <p className="text-xs">Camera used</p>
              </div>
            </div>
            <div className={`flex w-full md:w-3/12 items-center`}>
              <div className="flex w-full items-center flex-row md:flex-col justify-between md:justify-center">
                <div className="flex mx-0 md:mx-2 my-3">
                  <button
                    className={`${poppinsB.className} text-white text-xs md:text-base bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full h-min px-5 py-3 md:px-7 shadow-md w-[100px] md:w-[120px]`}
                    onClick={() => router.push("/assignment/student")}
                  >
                    <span className="text-xs md:text-md">Start</span>
                  </button>
                </div>
                <div className="flex mx-0 md:mx-2 my-3">
                  <button
                    className={`${poppinsB.className} text-white text-xs md:text-base bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full h-min px-5 py-3 md:px-7 shadow-md w-[100px] md:w-[120px]`}
                    onClick={() => router.push("/assignment/student")}
                  >
                    <span className="text-xs md:text-md">Stop</span>
                  </button>
                </div>
                <div className="flex mx-0 md:mx-2 my-3">
                  <button
                    className={`${poppinsB.className} text-white text-xs md:text-base bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full h-min px-5 py-3 md:px-7 shadow-md w-[100px] md:w-[120px]`}
                    onClick={() =>
                      router.push(
                        `/assignment/answer/upload?id=${router.query.id}`
                      )
                    }
                  >
                    <span className="text-xs md:text-md">Upload</span>
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
