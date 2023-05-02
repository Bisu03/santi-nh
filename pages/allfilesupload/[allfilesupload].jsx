import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Heading from "../../components/Heading";
import LoadingScreen from "../../components/LodingScreen";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

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

  const handleUpload = () => {
    setFilesLeftForUpload(true);
    if (fileUpload == null) {
      return;
    }
    try {
      let filename = Math.random() + fileName.replace(/\s+/g, "");
      const imageRef = ref(storage, `santi/${filename}`);
      uploadBytes(imageRef, fileUpload)
        .then((snapshot) => {
          // console.log(`${allfilesupload} file succesfully uploaded`);
          setFileUpload(null);
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            setFileUpload(null);
            setFilesLeftForUpload(false);
            toast.success("File Uploaded");
            if (downloadURL) {
              if (!fileName) {
                toast("enter the file name");
                return;
              }
              setLoading(true);
              axios
                .post("/api/uploadfiles", {
                  admissionId: allfilesupload,
                  url: downloadURL,
                  name: fileName,
                })
                .then(({ data }) => {
                  location.reload();
                  setLoading(false);
                  console.log(data);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);
                  toast.warn("something went wrong");
                });
            }
          });
        })
        .catch((e) => console.log(e));
    } catch (error) {
      console.log(error);
      setFilesLeftForUpload(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    try {
      const { data } = await axios.delete("/api/deletefile/" + id);
      console.log(data);
      location.reload();
      setLoadingDelete(false);
    } catch (error) {
      console.log(error);
      setLoadingDelete(false);
      toast.warn("something went wrong");
    }
  };

  const getUploadData = async () => {
    setLoadingget(true);
    try {
      const { data } = await axios.get(
        `/api/getuploadfile?search=${allfilesupload}`
      );
      console.log(data);
      setLoadingget(false);
      setFileData(data);
    } catch (error) {
      console.log(error);
      setLoadingget(false);
      toast.warn("something went wrong");
    }
  };

  useEffect(() => {
    getUploadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFileData, allfilesupload]);

  console.log(fileData);

  if (Loadingget) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <Navbar />
      <Heading title="File Upload" />

      <div className="flex justify-center w-full ">
        <div className="form-control pt-5 w-full">
          <div className="input-group justify-center w-full">
            <select
              name="fileName"
              onChange={(e) => setFileName(e.target.value)}
              className="input input-bordered w-96 text-black ">
              <option value="">Select Name</option>
              <option value="Blood report">Blood report</option>
              <option value="CT Scan">CT Scan</option>
              <option value="Xray">Xray</option>
              <option value="Others">Others</option>
            </select>
            <input
              type="file"
              onChange={(e) => setFileUpload(e.target.files[0])}
              className="input input-bordered w-96 text-black "
            />
            <div className=" flex justify-between  ">
              {filesLeftForUpload ? (
                <button
                  onClick={handleUpload}
                  className=" mx-2 w-32 btn btn-square">
                  upload...
                </button>
              ) : (
                <button
                  onClick={handleUpload}
                  className={` mx-2 w-32 btn btn-square ${
                    Loading ? "loading" : ""
                  } `}>
                  Save
                </button>
              )}
              {/* <button className="mx-2 w-32 btn btn-square">Save</button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        {fileData.map((data) => (
          <div className="card w-96 bg-base-100 shadow-xl m-5" key={data._id}>
            <figure>
              <iframe src={data.url}></iframe>
            </figure>
            <div className="card-body">
              <h2 className="card-title">{data.name}</h2>
              <div className="card-actions justify-end">
                <a
                  href={data.url}
                  target="_blank"
                  download={data.url}
                  className="btn btn-primary">
                  View
                </a>
                <button
                  onClick={() => handleDelete(data._id)}
                  className={`btn btn-primary ${
                    LoadingDelete ? "loading" : ""
                  } `}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

allfilesupload.adminRoute = true;
export default allfilesupload;
