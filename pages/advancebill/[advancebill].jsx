import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import admissionDetailsStyles from "../../styles/Printadmission.module.css";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import axios from "axios";
import LodingScreen from "../../components/LodingScreen";
import Alldetails from "../../dummydata/Alldata";

const advancebill = () => {
  const router = useRouter();
  const { advancebill } = router.query;
  const [admissionData, setAdmissionData] = useState([]);
  const [printLoding, setPrintLoding] = useState(false);
  const [loding, setLoding] = useState(false);
  const getdata = async () => {
    setLoding(true);
    try {
      const { data } = await axios.get(
        `/api/admission-details/${advancebill}`
      );
      console.log(data);
      setAdmissionData(data);
      setLoding(false);
    } catch (error) {
      setLoding(false);
      console.error(error);
    }
  };
  useEffect(() => {
    getdata();
  }, [advancebill]);

  const componentRef = useRef();

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handleOnBeforeGetContent = useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
    setPrintLoding(true);
  }, [componentRef.current]);

  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called"); // tslint:disable-line no-console
    setPrintLoding(false);
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    onBeforeGetContent: handleOnBeforeGetContent,
    onAfterPrint: handleAfterPrint,
    documentTitle: `${advancebill}`,
    removeAfterPrint: true,
  });

  if (loding) {
    return <LodingScreen />;
  }

  return (
    <>
      <div ref={componentRef}>
        <div className={`${admissionDetailsStyles.printborder}`}>
          <div className={`${admissionDetailsStyles.border}`}>
            <div className={admissionDetailsStyles.head}>
              <Image
                src={Alldetails.sidelogo}
                alt="nhimage"
                className={admissionDetailsStyles.image}
                width={100}
                height={100}
              />
              <div className={admissionDetailsStyles.headH}>
                <h2>{Alldetails.NHname}</h2>
                {/* <p className={admissionDetailsStyles.headP}>
                An ISO 9001:2015 CERTIFIED NURSING HOME <br />
                Government Registered
              </p> */}
                <p className={admissionDetailsStyles.headP}>
                  {Alldetails.address}
                </p>

                {/* <p className={admissionDetailsStyles.headP}>Email ID: {Alldetails.email}</p> */}
                <p className={admissionDetailsStyles.headP}>
                  Contact No: +91 {Alldetails.phonenumber}
                </p>
                <p className={admissionDetailsStyles.headP}>{Alldetails.url}</p>
              </div>
              <Image
                src={Alldetails.logo}
                alt="nhimage"
                className={admissionDetailsStyles.image}
                width={100}
                height={100}
              />
            </div>
            <hr />
            <h3 className={admissionDetailsStyles.heading}>Patient details</h3>
            <div className={admissionDetailsStyles.patientdetail}>
              <table
                className={`${admissionDetailsStyles.pateintDetailsTable}`}>
                <tbody>
                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Admission ID
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.admissionId}
                    </td>
                  </tr>

                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Full name
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.patient?.fullname}
                    </td>
                  </tr>
                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Gender
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.patient?.gender}
                    </td>
                  </tr>
                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Age
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.age}
                    </td>
                  </tr>
                  <tr>
                  <th className={admissionDetailsStyles.patientdetailR}>
                    Religion
                  </th>
                  <td className={admissionDetailsStyles.patientdetailR}>
                    {admissionData?.religion}
                  </td>
                </tr>
                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Contact No
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.patient?.contactNo}
                    </td>
                  </tr>
                  {admissionData?.patient?.aadharNo && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Aadhar No
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.patient?.aadharNo}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Address
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.patient?.address}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table
                className={`${admissionDetailsStyles.pateintDetailsTable}`}>
                <tbody>
                  {admissionData?.guardianName && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Gurdian name
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.guardianName}
                      </td>
                    </tr>
                  )}
                  {admissionData?.guardianContactNo && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Gurdian Contact No.
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.guardianContactNo}
                      </td>
                    </tr>
                  )}
                  {admissionData?.medicalCase && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Medical case
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.medicalCase}
                      </td>
                    </tr>
                  )}

                  {admissionData?.admissiontype && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Admission Type
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.admissiontype}
                      </td>
                    </tr>
                  )}

                  {admissionData?.admissionunder && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Admission Under
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.admissionunder}
                      </td>
                    </tr>
                  )}
                  {admissionData?.doctor && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Doctor
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.doctor}
                      </td>
                    </tr>
                  )}
                  {admissionData?.designation && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Designation
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.designation}
                      </td>
                    </tr>
                  )}
                  {admissionData?.regnumber && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Reg. Number
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.regnumber}
                      </td>
                    </tr>
                  )}
                  {admissionData?.anotherdoctor && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Another Doctor
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.anotherdoctor}
                      </td>
                    </tr>
                  )}
                  {admissionData?.bedtype && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Type Of Bed
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.bedtype}
                      </td>
                    </tr>
                  )}
                  {admissionData?.bednumber && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Bed Number
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.bednumber}
                      </td>
                    </tr>
                  )}
                  {admissionData?.dateOfAdmission && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Date of Admission
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.dateOfAdmission}
                      </td>
                    </tr>
                  )}

                  {admissionData?.bedsifting && (
                    <>
                      <tr>
                        <th className={admissionDetailsStyles.patientdetailR}>
                          Bed Sifting
                        </th>
                        <td className={admissionDetailsStyles.patientdetailR}>
                          {admissionData?.bedsifting}
                        </td>
                      </tr>
                      <tr>
                        <th className={admissionDetailsStyles.patientdetailR}>
                          Sift Bed Number
                        </th>
                        <td className={admissionDetailsStyles.patientdetailR}>
                          {admissionData?.siftbednumber}
                        </td>
                      </tr>
                    </>
                  )}

                  {admissionData?.billingDone && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Date of Departure
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.dateOfDeparture}
                      </td>
                    </tr>
                  )}
                  {admissionData?.advance && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Advance Payment
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.advance}/-
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <hr />
            <table
              className={`${admissionDetailsStyles.signature} ${admissionDetailsStyles.table}`}>
              <tbody>
                <tr>
                  <th className={admissionDetailsStyles.tableitem}>
                    <div className={admissionDetailsStyles.rightSignArea}>
                      Signature of Patient
                      <hr />
                    </div>
                  </th>
                  <th className={admissionDetailsStyles.tableitem}>
                    <div className={admissionDetailsStyles.rightSignArea}>
                      Signature of Issuer
                      <hr />
                    </div>
                  </th>
                </tr>
              </tbody>
            </table>
            <hr />
            <h3 className={admissionDetailsStyles.heading}>
              Billing {admissionData?.billingtype}
            </h3>

            <p className={admissionDetailsStyles.heading}>
              ! Keep all papers carefully !
            </p>
          </div>
        </div>

        <div className={`${admissionDetailsStyles.printborder}`}>
          <div className={`${admissionDetailsStyles.border}`}>
            <div className={admissionDetailsStyles.head}>
              <Image
                src={Alldetails.sidelogo}
                alt="nhimage"
                className={admissionDetailsStyles.image}
                width={100}
                height={100}
              />
              <div className={admissionDetailsStyles.headH}>
                <h2>{Alldetails.NHname}</h2>
                {/* <p className={admissionDetailsStyles.headP}>
                An ISO 9001:2015 CERTIFIED NURSING HOME <br />
                Government Registered
              </p> */}
                <p className={admissionDetailsStyles.headP}>
                  {Alldetails.address}
                </p>

                {/* <p className={admissionDetailsStyles.headP}>Email ID: {Alldetails.email}</p> */}
                <p className={admissionDetailsStyles.headP}>
                  Contact No: +91 {Alldetails.phonenumber}
                </p>
                <p className={admissionDetailsStyles.headP}>{Alldetails.url}</p>
              </div>
              <Image
                src={Alldetails.logo}
                alt="nhimage"
                className={admissionDetailsStyles.image}
                width={100}
                height={100}
              />
            </div>
            <hr />
            <h3 className={admissionDetailsStyles.heading}>Patient details</h3>
            <div className={admissionDetailsStyles.patientdetail}>
              <table
                className={`${admissionDetailsStyles.pateintDetailsTable}`}>
                <tbody>
                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Admission ID
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.admissionId}
                    </td>
                  </tr>

                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Full name
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.patient?.fullname}
                    </td>
                  </tr>
                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Gender
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.patient?.gender}
                    </td>
                  </tr>
                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Age
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.age}
                    </td>
                  </tr>
                  <tr>
                  <th className={admissionDetailsStyles.patientdetailR}>
                    Religion
                  </th>
                  <td className={admissionDetailsStyles.patientdetailR}>
                    {admissionData?.religion}
                  </td>
                </tr>
                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Contact No
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.patient?.contactNo}
                    </td>
                  </tr>
                  {admissionData?.patient?.aadharNo && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Aadhar No
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.patient?.aadharNo}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Address
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.patient?.address}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table
                className={`${admissionDetailsStyles.pateintDetailsTable}`}>
                <tbody>
                  {admissionData?.guardianName && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Gurdian name
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.guardianName}
                      </td>
                    </tr>
                  )}
                  {admissionData?.guardianContactNo && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Gurdian Contact No.
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.guardianContactNo}
                      </td>
                    </tr>
                  )}
                  {admissionData?.medicalCase && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Disease
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.medicalCase}
                      </td>
                    </tr>
                  )}

                  {admissionData?.admissiontype && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Admission Type
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.admissiontype}
                      </td>
                    </tr>
                  )}

                  {admissionData?.admissionunder && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Admission Under
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.admissionunder}
                      </td>
                    </tr>
                  )}
                  {admissionData?.doctor && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Doctor
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.doctor}
                      </td>
                    </tr>
                  )}
                  {admissionData?.designation && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Designation
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.designation}
                      </td>
                    </tr>
                  )}
                  {admissionData?.regnumber && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Reg. Number
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.regnumber}
                      </td>
                    </tr>
                  )}
                  {admissionData?.anotherdoctor && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Another Doctor
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.anotherdoctor}
                      </td>
                    </tr>
                  )}
                  {admissionData?.bedtype && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Type Of Bed
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.bedtype}
                      </td>
                    </tr>
                  )}
                  {admissionData?.bednumber && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Bed Number
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.bednumber}
                      </td>
                    </tr>
                  )}
                  {admissionData?.dateOfAdmission && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Date of Admission
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.dateOfAdmission}
                      </td>
                    </tr>
                  )}

                  {admissionData?.bedsifting && (
                    <>
                      <tr>
                        <th className={admissionDetailsStyles.patientdetailR}>
                          Bed Sifting
                        </th>
                        <td className={admissionDetailsStyles.patientdetailR}>
                          {admissionData?.bedsifting}
                        </td>
                      </tr>
                      <tr>
                        <th className={admissionDetailsStyles.patientdetailR}>
                          Sift Bed Number
                        </th>
                        <td className={admissionDetailsStyles.patientdetailR}>
                          {admissionData?.siftbednumber}
                        </td>
                      </tr>
                    </>
                  )}

                  {admissionData?.billingDone && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Date of Departure
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.dateOfDeparture}
                      </td>
                    </tr>
                  )}
                  {admissionData?.advance && (
                    <tr>
                      <th className={admissionDetailsStyles.patientdetailR}>
                        Advance Payment
                      </th>
                      <td className={admissionDetailsStyles.patientdetailR}>
                        {admissionData?.advance}/-
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <hr />
            <table
              className={`${admissionDetailsStyles.signature} ${admissionDetailsStyles.table}`}>
              <tbody>
                <tr>
                  <th className={admissionDetailsStyles.tableitem}>
                    <div className={admissionDetailsStyles.rightSignArea}>
                      Signature of Patient
                      <hr />
                    </div>
                  </th>
                  <th className={admissionDetailsStyles.tableitem}>
                    <div className={admissionDetailsStyles.rightSignArea}>
                      Signature of Issuer
                      <hr />
                    </div>
                  </th>
                </tr>
              </tbody>
            </table>
            <hr />
            <h3 className={admissionDetailsStyles.heading}>
              Billing {admissionData?.billingtype}
            </h3>

            <p className={admissionDetailsStyles.heading}>
              ! Keep all papers carefully !
            </p>
          </div>
        </div>
      </div>

      <div className={admissionDetailsStyles.btnstyle}>
        <button
          className={`btn btn-wide ${printLoding ? "loading" : ""} `}
          onClick={handlePrint}>
          Print Out
        </button>
      </div>
    </>
  );
};

advancebill.adminRoute = true;
export default advancebill;
