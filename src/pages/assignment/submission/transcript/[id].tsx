'use client'

import Template from "root/components/template";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Poppins } from "next/font/google";
import { useParams, useSearchParams } from "next/navigation";
import moment from "moment-timezone";

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
    const searchParams                                           = useSearchParams()
    const params                                                     = useParams()
    const [detailSubmission, setDetailSubmission]                  = useState<any>()
    const [editScore, setEditScore] = useState(false);
    const handleButtonClick = () => {
        setEditScore(true);
    };
    const handleSaveClick = () => {
        // setScore(newScore);
        setEditScore(false);
    };

    const getDataDetailSubmission = async (id:string) => {
        try {
            const token           = localStorage.getItem('token');
            const detailSubmission = await fetch(`http://localhost:3333/v1/submission/get/${id}`, {
                headers: {
                    Authorization: `${token}`,
                }
            })

            if (detailSubmission.ok) {
                const data = await detailSubmission.json();
                setDetailSubmission(data.data[0])
            }

        } catch (error) {
            console.log("failed load data : ", error);
            
        }
    }

    useEffect(() => {
        if(params !== null) {
            getDataDetailSubmission(params.id as string)
        }
    }, [params])

    return(
        <Template>
            <section className="bg-white p-5">
                <div className="flex justify-between items-center ">
                    <h1 className={`${poppinsB.className} font-bold text-2xl md:text-[2rem] mt-2`}>{detailSubmission ? detailSubmission.Users.email : ""}</h1>
                    <button className={`${poppinsB.className} text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full px-5 py-3 shadow-md`}>
                        Done
                    </button>
                </div>
                <div className="flex flex-col">
                    <span className={`${poppins.className} mt-3 mb-5`}>Submitted on {moment(detailSubmission?.created_at).format("DD/MM/YYYY")}</span>
                </div>

                <div className="hidden md:flex flex wrap h-1/2-screen">
                    <div className="md:w-2/3 bg-gray-100 p-5 h-64">
                        {/* Video box */}
                    </div>
                    <div className="md:w-1/3 bg-white rounded-lg shadow-lg p-5 ml-0 md:ml-5 mt-5 md:mt-0 h-64 flex flex-col justify-start items-center">
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
                                        <label className={`block text-gray-700 text-l font-bold mb-2 ${poppinsB.className}`} htmlFor="score">
                                            Score
                                        </label>
                                        <input
                                            className={`${poppins.className} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                            id="score"
                                            type="number"
                                            // value={newScore}
                                            // onChange={(e) => setNewScore(e.target.value)}
                                            placeholder="Enter the score"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className={`block text-gray-700 text-l font-bold mb-2 ${poppinsB.className}`} htmlFor="feedback">
                                            Feedback
                                        </label>
                                        <textarea
                                            className={`${poppins.className} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                            id="feedback"
                                            // value={feedback}
                                            // onChange={(e) => setFeedback(e.target.value)}
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
                                        Score: {detailSubmission?.score !== null? detailSubmission?.score : "Not yet given"}
                                    </p>
                                    <p className={`${poppinsB.className} text-l font-bold`}>
                                        Feedback: {detailSubmission?.feedback !==null? detailSubmission?.feedback : "Not yet provided"}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>    
                </div>
                <div className="flex flex-wrap flex-col h-full md:hidden">
                    <div className="w-full md:w-2/3 bg-gray-100 p-5 h-64 mb-3">
                        {/* Video box */}
                    </div>
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
                                        <label className={`block text-gray-700 text-l font-bold mb-2 ${poppinsB.className}`} htmlFor="score">
                                            Score
                                        </label>
                                        <input
                                            className={`${poppins.className} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                            id="score"
                                            type="number"
                                            // value={newScore}
                                            // onChange={(e) => setNewScore(e.target.value)}
                                            placeholder="Enter the score"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className={`block text-gray-700 text-l font-bold mb-2 ${poppinsB.className}`} htmlFor="feedback">
                                            Feedback
                                        </label>
                                        <textarea
                                            className={`${poppins.className} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                            id="feedback"
                                            // value={feedback}
                                            // onChange={(e) => setFeedback(e.target.value)}
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
                                        Score: {detailSubmission?.score !== null? detailSubmission?.score : "Not yet given"}
                                    </p>
                                    <p className={`${poppinsB.className} text-l font-bold`}>
                                        Feedback: {detailSubmission?.feedback !==null? detailSubmission?.feedback : "Not yet provided"}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>    
                </div>
                
            
                <div className="w-full mt-5">
                    <h2 className={`${poppinsB.className} text-2xl font-bold`}>Transcript</h2>
                    <div className="w-full h-1/4 mt-2">
                        {detailSubmission?.status !== true ? (
                            <p className={`${poppins.className} text-xl font-bold mt-2`}>Transcript not yet provided</p>
                        ) : (
                            <>
                                <p className={`${poppins.className} text-l font-bold mt-2`}>Transcript provided</p>
                                {/* Button */}
                                <button className={`${poppinsB.className} mt-3 text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-lg px-4 py-3 text-s shadow-md`}>View Transcript</button>
                            </>
                        )}
                    </div>
                </div>
                

            </section>
            {/* <div> {JSON.stringify(detailSubmission)} 
            </div> */}
        </Template>
    )

}
export default FeedbackAssignment