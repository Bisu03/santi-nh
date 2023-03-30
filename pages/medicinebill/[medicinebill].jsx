import React, { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import LodingScreen from "../../components/LodingScreen";
import Image from "next/image";
import medBillStyle from "../../styles/MedBillStyle.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import Alldetails from "../../dummydata/Alldata";

const Medbill = () => {
  const [printLoding, setPrintLoding] = useState(false);
  const [loding, setLoding] = useState(false);
  const [admissionData, setAdmissionData] = useState({});
  const router = useRouter();
  const { medicinebill } = router.query;

  useEffect(() => {
    fetchDetailsByAdmissionID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicinebill]);

  const fetchDetailsByAdmissionID = () => {
    setLoding(true);
    axios
      .get(`/api/findmedbill/${medicinebill}`)
      .then(({ data }) => {
        console.log(data);
        setAdmissionData(data);
        setLoding(false);
      })
      .catch((err) => {
        console.error(err);
        setLoding(false);
      });
  };

  const componentRef = useRef();

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentRef.current]);

  const handleOnBeforeGetContent = useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
    setPrintLoding(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentRef.current]);

  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called"); // tslint:disable-line no-console
    setPrintLoding(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    onBeforeGetContent: handleOnBeforeGetContent,
    onAfterPrint: handleAfterPrint,
    // documentTitle: `${admissionid}`,
    removeAfterPrint: true,
  });

  if (loding) {
    return (
      <>
        <LodingScreen />{" "}
      </>
    );
  }

  return (
    <div>
      <div ref={componentRef} className={`${medBillStyle.printborder}`}>
        <div className={`${medBillStyle.border}`}>
          <div className={medBillStyle.head}>
            <Image
              src={Alldetails.sidelogo}
              alt="nhimage"
              className={medBillStyle.image}
              width={100}
              height={100}
            />
            <div className={medBillStyle.headH}>
              <h2>{Alldetails.NHname}</h2>
              {/* <p className={medBillStyle.headP}>
                An ISO 9001:2015 CERTIFIED NURSING HOME <br />
                Government Registered
              </p> */}
              <p className={medBillStyle.headP}>{Alldetails.address}</p>

              {/* <p className={medBillStyle.headP}>Email ID: {Alldetails.email}</p> */}
              <p className={medBillStyle.headP}>
                Contact No: +91 {Alldetails.phonenumber}
              </p>
              <p className={medBillStyle.headP}>{Alldetails.url}</p>
            </div>
            <Image
              src={Alldetails.logo}
              alt="nhimage"
              className={medBillStyle.image}
              width={100}
              height={100}
            />
          </div>

          <hr />
          <h3 className={medBillStyle.heading}>Patient details</h3>
          <div className={medBillStyle.patientdetail}>
            <table className={`${medBillStyle.pateintDetailsTable}`}>
              <tbody>
                {/* <tr>
                  <th className={medBillStyle.patientdetailR}>NH ID</th>
                  <td className={medBillStyle.patientdetailR}>
                    {admissionData?.admission?.nhId}
                  </td>
                </tr> */}
                <tr>
                  <th className={medBillStyle.patientdetailR}>Admission ID</th>
                  <td className={medBillStyle.patientdetailR}>
                    {admissionData?.admission?.admissionId}
                  </td>
                </tr>
                <tr>
                  <th className={medBillStyle.patientdetailR}>Full Name</th>
                  <td className={medBillStyle.patientdetailR}>
                    {admissionData?.patient?.fullname || "NUL"}
                  </td>
                </tr>
                <tr>
                  <th className={medBillStyle.patientdetailR}>Gender</th>
                  <td className={medBillStyle.patientdetailR}>
                    {admissionData?.patient?.gender || "NUL"}{" "}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className={`${medBillStyle.pateintDetailsTable}`}>
              <tbody>
                <tr>
                  <th className={medBillStyle.patientdetailR}>Medical case</th>
                  <td className={medBillStyle.patientdetailR}>
                    {admissionData?.patient?.contactNo || "NUL"}
                  </td>
                </tr>
                <tr>
                  <th className={medBillStyle.patientdetailR}>Age</th>
                  <td className={medBillStyle.patientdetailR}>
                    {admissionData?.admission?.age || "NUL"}
                  </td>
                </tr>
                <tr>
                  <th className={medBillStyle.patientdetailR}>Contact No</th>
                  <td className={medBillStyle.patientdetailR}>
                    {admissionData?.admission?.medicalCase || "NUL"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr />
          <table className={`${medBillStyle.table}`}>
            <tr>
              <th className={medBillStyle.tableitemTDWord}>Medicine List</th>
              {/* <td className={medBillStyle.tableitemTDAmount}></td> */}
            </tr>
          </table>
          <table className={`${medBillStyle.table}`}>
            <tbody>
              <tr>
                <th className={medBillStyle.tableitemService}>Item Name</th>
                <th className={medBillStyle.tableitemService}>
                  Per Units Charge
                </th>
                <th className={medBillStyle.tableitemService}>Units</th>
                <th className={medBillStyle.tableitemService}>Total</th>
              </tr>
              {Object.keys(admissionData?.medicineCharges?.items || "").map(
                (data) => (
                  <>
                    <tr key={data._id}>
                      <td className={medBillStyle.tableitemTDService}>
                        {
                          admissionData?.medicineCharges?.items[data]
                            ?.medicineName
                        }
                      </td>
                      <td className={medBillStyle.tableitemTD}>
                        {admissionData?.medicineCharges?.items[data]
                          ?.costPervial ||
                          admissionData?.medicineCharges?.items[data]
                            ?.costPerStrip}
                        .00
                      </td>
                      <td className={medBillStyle.tableitemTD}>
                        {admissionData?.medicineCharges?.items[data]?.quantity}
                      </td>

                      <td className={medBillStyle.tableitemTD}>
                        {admissionData?.medicineCharges?.items[data]?.total}.00
                      </td>
                    </tr>
                  </>
                )
              )}
            </tbody>
          </table>
          <hr />
          <div className={`${medBillStyle.tableFlex}`}>
            <table className={`${medBillStyle.table}`}>
              <tr>
                <th className={medBillStyle.tableitemTDWord}>Amount</th>
                {/* <td className={medBillStyle.tableitemTDAmount}></td> */}
              </tr>
            </table>

            <table className={`${medBillStyle.table}`}>
              <tbody>
                {admissionData?.total?.totalCharge && (
                  <tr>
                    <th className={medBillStyle.tableitemTDTotal}>
                      Total charge :
                    </th>
                    <td className={medBillStyle.tableitemTDTotal}>
                      {admissionData?.total?.totalCharge}
                    </td>
                  </tr>
                )}
                {/* <hr /> */}
              </tbody>
            </table>
            <table className={`${medBillStyle.signature}`}>
              <tbody>
                <tr>
                  <th className={medBillStyle.tableitem}>
                    <div className={medBillStyle.rightSignArea}>
                      Signature of Patient Party
                      <hr />
                    </div>
                  </th>
                  <th className={medBillStyle.tableitem}>
                    <div className={medBillStyle.rightSignArea}>
                      <br />
                      Authorised Signature
                      <hr />
                    </div>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className={medBillStyle.btnstyle}>
        {" "}
        <button
          className={`btn btn-wide ${printLoding ? "loading" : ""} `}
          onClick={handlePrint}>
          Print Out
        </button>
      </div>
    </div>
  );
};

export default Medbill;
