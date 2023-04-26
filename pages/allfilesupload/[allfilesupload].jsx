import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Heading from "../../components/Heading";
import { useRouter } from "next/router";

const allfilesupload = () => {
  const router = useRouter();
  const { allfilesupload } = router.query;
  const [fileUpload, setFileUpload] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [Loading, setLoading] = useState(false);
  const [LoadingDelete, setLoadingDelete] = useState(false);
  const [Loadingget, setLoadingget] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [filesLeftForUpload, setFilesLeftForUpload] = useState(false);

  return (
    <div>
      <Navbar />
      <Heading title="File Upload" />

      <div className="flex justify-center w-full ">
        <div className="form-control pt-5 w-full">
          <div className="input-group justify-center w-full">
            <select
              name="fileName"
              className="input input-bordered w-96 text-black ">
              <option value="">Select Name</option>
              <option value="Blood report">Blood report</option>
              <option value="CT Scan">CT Scan</option>
              <option value="Xray">Xray</option>
              <option value="Others">Others</option>
            </select>
            <input
              type="file"
              name="file"
              className="input input-bordered w-96 text-black "
            />
            <div className=" flex justify-between  ">
              <button className=" mx-2 w-32 btn btn-square">upload</button>
              <button className="mx-2 w-32 btn btn-square">Save</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card w-96 bg-base-100 shadow-xl mt-5">
        <figure>
          <iframe src="/vercel.svg"></iframe>
        </figure>
        <div className="card-body">
          <h2 className="card-title">X ray</h2>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">View</button>
            <button className="btn btn-primary">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

allfilesupload.adminRoute = true;
export default allfilesupload;
