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

export default function Upload() {
  const [assignment, setAssignment] = useState<AssignmentType>();
  const [emailUser, setEmailUser] = useState("");
  const params = useSearchParams();
  const router = useRouter();

  const parseJwt = (token: string) => {
    if (!token) {
      return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === undefined || token === null) {
      window.location.replace("/auth/login");
      return;
    } else {
      const decodeJwt = parseJwt(token);
      setEmailUser(decodeJwt.email);
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
    }
  }, [params.get("id")]);

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
            </div>
            <div className={`flex w-full my-3 md:my-0 md:w-3/12 items-center`}>
              <div className="flex bg-white md:ml-3 w-full h-full flex-col p-3 shadow-md border border-gray-500 rounded-lg">
                <div className="flex justify-center items-center my-2">
                  <button
                    className={`${poppinsB.className} text-white text-xs md:text-base bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full h-min px-5 py-3 md:px-7 shadow-md w-[100px] md:w-[120px]`}
                    onClick={() =>
                      router.push(
                        `/assignment/answer/review?id=${params.get("id")}`
                      )
                    }
                  >
                    <span className="text-xs md:text-md">Upload</span>
                  </button>
                </div>
                <div className="flex w-full mt-4">
                  <div className="flex w-full">
                    <span className="text-xs">Title</span>
                  </div>
                  <div className="flex w-full justify-end">
                    <span className="text-md text-green-700 font-semibold">
                      {assignment?.namaAssignment}
                    </span>
                  </div>
                </div>
                <div className="flex w-full my-1">
                  <div className="flex w-full">
                    <span className="text-xs">Email</span>
                  </div>
                  <div className="flex w-full justify-end">
                    <span className="text-xs text-green-700 break-words">
                      {emailUser}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Template>
    </div>
  );
}
