import Link from "next/link";
import { AssignmentType } from "root/types/assignmentType";

interface CardTableProps {
  data: AssignmentType;
}

const CardTable: React.FC<CardTableProps> = ({ data }) => {
  return (
    <div className="flex flex-col bg-[#CBE4DE] rounded-2xl">
      <div className="py-3 text-center">
        <p>Nama Assignment :</p>
        <h3>{data.namaAssignment}</h3>
      </div>
      <div className="flex border-black border-t border-t-1 border-b border-b-1">
        <div className="border-black border-r border-r-1 w-full px-5 py-3">
          <p>Start : {`${data.dateStart} ${data.timeStart}`}</p>
        </div>
        <div className="w-full px-5 py-3">
          <p>End : {`${data.dateDeadline} ${data.timeDeadline}`}</p>
        </div>
      </div>
      <div className="flex justify-between py-3 px-5 items-center">
        <p>
          Jumlah Submission :{" "}
          {data.jumlahSubmission == 0 || data.jumlahSubmission == undefined
            ? "0"
            : data.jumlahSubmission}
        </p>
        <Link
          href={`/assignment/submission/${data.assignmentID}?title=${data.namaAssignment}&timeDeadline=${data.timeDeadline}&dateDeadline=${data.dateDeadline}`}
          className="bg-[#2E4F4F] hover:bg-[#233b3b] px-5 py-2 rounded-full text-white font-semibold"
        >
          See More
        </Link>
      </div>
    </div>
  );
};

export default CardTable;
