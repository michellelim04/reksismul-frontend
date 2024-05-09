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


const DetailSubmission = () => {
    const searchParams                       = useSearchParams()
    const params                             = useParams()
    const title                              = searchParams.get("title")
    const timeDeadline                       = searchParams.get("timeDeadline")
    const dateDeadline                       = searchParams.get("dateDeadline")
    const [listAssigment, setListAssignment] = useState([])

    const getDataDetailAssignment = async (id:string) => {
        try {
            const token           = localStorage.getItem('token');
            const detailAssigment = await fetch(`http://localhost:3333/v1/submission/list?id=${id}`, {
                headers: {
                    Authorization: `${token}`,
                }
            })

            if (detailAssigment.ok) {
                const data = await detailAssigment.json();
                setListAssignment(data.data)
            }

        } catch (error) {
            console.log("failed load data : ", error);
            
        }
    }

    useEffect(() => {
        if(params !== null) {
            getDataDetailAssignment(params.id as string)
        }
    }, [params])
    
    return (
        <Template>
            <>
                <section className="bg-white p-5">
                    <div className="flex mb-5 flex-col">
                        <h1 className="font-bold text-2xl md:text-[2rem]">{title}</h1>
                        <span className="mt-2">Deadline : {moment(dateDeadline).format("DD/MM/YYYY")} {timeDeadline}</span>
                    </div>
                    <div className="hidden md:flex">
                        <table className="table table-fixed w-full md:table">
                            <thead className={`${poppinsB.className} text-white bg-[#0E8388]`}>
                                <tr>
                                    <th className="p-3">No</th>
                                    <th className="p-3">Nama</th>
                                    <th className="p-3">Date Submission</th>
                                    <th className="p-3">Time Submission</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Score</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                        <tbody className={poppins.className}>
                            {
                                listAssigment.length <= 0 ?
                                    <tr>
                                        <td colSpan={7}>
                                            <div className="flex justify-center items-center">
                                                <span className="text-center">Data not avaliable now !</span>
                                            </div>
                                        </td>
                                    </tr>
                                :
                                listAssigment.length > 0 &&
                                listAssigment.map((e:any, i) => {
                                    return (
                                        <tr className={i % 2 === 0 ? "bg-white" : "bg-[#CBE4DE]"} key={i}>
                                            <td className="p-3 text-center align-middle ">{i + 1}.</td>
                                            <td className="p-3 text-center align-middle break-words">{e.email}</td>
                                            <td className="p-3 text-center align-middle ">{e.submission !== undefined ? moment(e.submission.created_at).format("DD/MM/YYYY") : "-"}</td>
                                            <td className="p-3 text-center align-middle">{e.submission !== undefined ?  moment(e.submission.created_at).format("HH.mm") : "-"}</td>
                                            <td className="p-3 text-center align-middle">{e.submission !== undefined ? e.submission.status ? "Reviewed" : "Unreviewed" : "-"}</td>
                                            <td className="p-3 text-center align-middle"> - </td>
                                            <td className="p-3 text-center align-middle">
                                                {
                                                    e.submission !== undefined ?
                                                        <button className={`${poppinsB.className} text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full p-3 shadow-md`}>
                                                            Review
                                                        </button>
                                                    :
                                                        ""
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        </table>
                    </div>

                    <div className="flex md:hidden w-full flex-col">
                        {
                            listAssigment.length <= 0 ?
                                <div className="flex w-full justify-center">
                                    <span className="font-semibold my-2">Data not avaliable now !</span>
                                </div>
                            :
                            listAssigment.length > 0 &&
                            listAssigment.map((e:any, i) => {
                                return (
                                    <div key={i} className="flex w-full flex-col bg-[#CBE4DE] p-2 rounded-md my-2 h-[150px] justify-center">
                                        <div className="flex w-full justify-center">
                                            <span className="font-semibold my-2">{e.email}</span>
                                        </div>
                                        <div className="flex w-full border-t border-t-gray-500 border-b border-b-gray-500 my-1 items-center">
                                            <div className="flex w-full border-r border-r-gray-500 p-1 border-h">
                                                <span className="text-xs">Submission : {e.submission !== undefined ? moment(e.submission.created_at).format("DD/MM/YYYY HH.mm") : "-"}</span>
                                            </div>
                                            <div className="flex w-full border-l border-l-gray-300 p-1">
                                                <span className="text-xs">Score : -</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center w-full pt-2">
                                            <div className="flex w-full">
                                                <span className="text-xs">Status : {e.submission !== undefined ? e.submission.status ? "Reviewed" : "Unreviewed" : "-"}</span>
                                            </div>
                                            <div className="flex w-full justify-end">
                                                {
                                                    e.submission !== undefined ?
                                                        <button className={`${poppinsB.className} text-white bg-[#2E4F4F] hover:bg-[#0E8388] rounded-full p-2 text-xs shadow-md`}>
                                                            Review
                                                        </button>
                                                    :
                                                        "-"
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </section>
            </>
        </Template>
    )
}

export default DetailSubmission