import commonStyles from "../../styles/Common.module.css";
import admissionDetailsStyles from "../../styles/Admissiondetails.module.css";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import Loading from "../../components/LodingScreen";
import { useSession } from "next-auth/react";
import Alldetails from "../../dummydata/Alldata";

const AdmissionDetails = () => {
  const router = useRouter();
  const { admissionid } = router.query;
  const { data: session, status } = useSession();
  const [admissionData, setAdmissionData] = useState({});
  const [amountWord, setAmountWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [printLoding, setPrintLoding] = useState(false);

  const fetchDetailsByAdmissionID = () => {
    setLoading(true);
    axios
      .get(`/api/admission-details/${admissionid}`)
      .then(({ data }) => {
        console.log(data);
        setAdmissionData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDetailsByAdmissionID();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admissionid, amountWord]);

  useEffect(() => {
    if (admissionData) {
      var a = [
        "",
        "one ",
        "two ",
        "three ",
        "four ",
        "five ",
        "six ",
        "seven ",
        "eight ",
        "nine ",
        "ten ",
        "eleven ",
        "twelve ",
        "thirteen ",
        "fourteen ",
        "fifteen ",
        "sixteen ",
        "seventeen ",
        "eighteen ",
        "nineteen ",
      ];
      var b = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ];

      function inWords(num) {
        if ((num = num?.toString())?.length > 9) return "overflow";
        let n = 0;
        n = ("000000000" + num)
          .substr(-9)
          .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return;
        var str = "";
        str +=
          n[1] != 0
            ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
            : "";
        str +=
          n[2] != 0
            ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
            : "";
        str +=
          n[3] != 0
            ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
            : "";
        str +=
          n[4] != 0
            ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
            : "";
        str +=
          n[5] != 0
            ? (str != "" ? "and " : "") +
              (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
              "only "
            : "";
        return str;
      }
      setAmountWord(
        inWords(admissionData?.billing?.total?.netPayableAmount)?.toUpperCase()
      );
    }
  }, [admissionData]);

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
    documentTitle: `${admissionid}`,
    removeAfterPrint: true,
  });

  if (loading) {
    return (
      <>
        <Loading />{" "}
      </>
    );
  }

  return (
    <>
      <div
        ref={componentRef}
        className={`${admissionDetailsStyles.printborder}`}>
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
                An ISO 9001:2015 CERTIFIED NURSING HOME 
              </p> */}
              <p className={admissionDetailsStyles.headP}>
                {Alldetails.address}
              </p>

              {/* <p className={admissionDetailsStyles.headP}>
                Email ID: {Alldetails.email}
              </p> */}
              <p className={admissionDetailsStyles.headP}>
                Contact No: +91 {Alldetails.phonenumber}
              </p>
              <p className={admissionDetailsStyles.headP}>
                Regd No: {Alldetails.regnumber}
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
          <h3 className={admissionDetailsStyles.heading}>Patient Details</h3>
          <div className={admissionDetailsStyles.patientdetail}>
            <table className={`${admissionDetailsStyles.pateintDetailsTable}`}>
              <tbody>
                {/* <tr>
                  <th className={admissionDetailsStyles.patientdetailR}>
                    NH ID
                  </th>
                  <td className={admissionDetailsStyles.patientdetailR}>
                    {admissionData?.nhId}
                  </td>
                </tr> */}
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
                  <th className={admissionDetailsStyles.patientdetailR}>Age</th>
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
                <tr>
                  <th className={admissionDetailsStyles.patientdetailR}>
                    Aadhar No
                  </th>
                  <td className={admissionDetailsStyles.patientdetailR}>
                    {admissionData?.patient?.aadharNo || "NA"}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className={`${admissionDetailsStyles.pateintDetailsTable}`}>
              <tbody>
                <tr>
                  <th className={admissionDetailsStyles.patientdetailR}>
                    Address
                  </th>
                  <td className={admissionDetailsStyles.patientdetailR}>
                    {admissionData?.patient?.address}
                  </td>
                </tr>
                <tr>
                  <th className={admissionDetailsStyles.patientdetailR}>
                    Gurdian Name
                  </th>
                  <td className={admissionDetailsStyles.patientdetailR}>
                    {admissionData?.guardianName || "NA"}
                  </td>
                </tr>
                <tr>
                  <th className={admissionDetailsStyles.patientdetailR}>
                    Gurdian Contact No.
                  </th>
                  <td className={admissionDetailsStyles.patientdetailR}>
                    {admissionData?.guardianContactNo || "NA"}
                  </td>
                </tr>
                <tr>
                  <th className={admissionDetailsStyles.patientdetailR}>
                    Disease
                  </th>
                  <td className={admissionDetailsStyles.patientdetailR}>
                    {admissionData?.medicalCase}
                  </td>
                </tr>
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
                {admissionData?.drrefferal && (
                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Doctor Name
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.drrefferal}
                    </td>
                  </tr>
                )}

                <tr>
                  <th className={admissionDetailsStyles.patientdetailR}>
                    Billing
                  </th>
                  <td className={admissionDetailsStyles.patientdetailR}>
                    {admissionData?.billingStatus}
                  </td>
                </tr>
                <tr>
                  <th className={admissionDetailsStyles.patientdetailR}>
                    Date of Admission
                  </th>
                  <td className={admissionDetailsStyles.patientdetailR}>
                    {admissionData?.dateOfAdmission || "NA"}
                  </td>
                </tr>
                {admissionData?.billingDone && (
                  <tr>
                    <th className={admissionDetailsStyles.patientdetailR}>
                      Date of Departure
                    </th>
                    <td className={admissionDetailsStyles.patientdetailR}>
                      {admissionData?.dateOfDeparture || "NA"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <hr />

          {admissionData?.billingDone ? (
            <>
              <table className={`${admissionDetailsStyles.table}`}>
                <tbody>
                  <tr>
                    <th className={admissionDetailsStyles.tableitemService}>
                      Service Description
                    </th>
                    <th className={admissionDetailsStyles.tableitemService}>
                      Per Units Charge
                    </th>
                    <th className={admissionDetailsStyles.tableitemService}>
                      Units
                    </th>
                    <th className={admissionDetailsStyles.tableitemService}>
                      Total
                    </th>
                  </tr>

                  {admissionData?.billing?.accommodationDetails?.total && (
                    <tr>
                      <td className={admissionDetailsStyles.tableitemTDService}>
                        Bed Charge(
                        {
                          admissionData?.billing?.accommodationDetails?.bedType
                        }{" "}
                        - {admissionData?.billing?.accommodationDetails?.bedNo}{" "}
                        )
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {
                          admissionData?.billing?.accommodationDetails
                            ?.chargeperday
                        }
                        .00
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {
                          admissionData?.billing?.accommodationDetails
                            ?.numberofdays
                        }
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {admissionData?.billing?.accommodationDetails?.total}.00
                      </td>
                    </tr>
                  )}

                  {admissionData?.billing?.anotheraccomodation?.total && (
                    <tr>
                      <td className={admissionDetailsStyles.tableitemTDService}>
                        Sifted Bed Charge(
                        {
                          admissionData?.billing?.anotheraccomodation
                            ?.anotherBed
                        }{" "}
                        - {admissionData?.billing?.anotheraccomodation?.bedNo} )
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {
                          admissionData?.billing?.anotheraccomodation
                            ?.chargeperday
                        }
                        .00
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {
                          admissionData?.billing?.anotheraccomodation
                            ?.numberofdays
                        }
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {admissionData?.billing?.anotheraccomodation?.total}.00
                      </td>
                    </tr>
                  )}

                  {admissionData?.billing?.ambulationCharge && (
                    <tr>
                      <td className={admissionDetailsStyles.tableitemTDService}>
                        Ambulance Charge
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>-</td>
                      <td className={admissionDetailsStyles.tableitemTD}>-</td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {admissionData?.billing?.ambulationCharge}.00
                      </td>
                    </tr>
                  )}

                  {admissionData?.billing?.serviceCharge?.total && (
                    <tr>
                      <td className={admissionDetailsStyles.tableitemTDService}>
                        Service Charge ({" "}
                        {admissionData?.billing?.serviceCharge?.serviceType} )
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {admissionData?.billing?.serviceCharge?.charge}
                        .00
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {admissionData?.billing?.serviceCharge?.numberofdays}
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {admissionData?.billing?.serviceCharge?.total}.00
                      </td>
                    </tr>
                  )}

                  {admissionData?.billing?.specialNeeds?.total &&
                    admissionData?.billing?.specialNeeds?.items?.map(
                      (data, indx) => (
                        <tr key={indx}>
                          <td
                            className={
                              admissionDetailsStyles.tableitemTDService
                            }>
                            Special Needs ({data?.itemName})
                          </td>
                          <td className={admissionDetailsStyles.tableitemTD}>
                            {data?.ratePerHour}
                            .00
                          </td>
                          <td className={admissionDetailsStyles.tableitemTD}>
                            {data?.hourPerDay}
                          </td>
                          <td className={admissionDetailsStyles.tableitemTD}>
                            {data?.total}.00
                          </td>
                        </tr>
                      )
                    )}

                  {admissionData?.billing?.nursingCharge?.general?.total && (
                    <tr>
                      <td className={admissionDetailsStyles.tableitemTDService}>
                        Nursing Charges (General)
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {
                          admissionData?.billing?.nursingCharge?.general
                            ?.feesPerDay
                        }
                        .00
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {admissionData?.billing?.nursingCharge?.general?.days}
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {admissionData?.billing?.nursingCharge?.general?.total}
                        .00
                      </td>
                    </tr>
                  )}

                  {admissionData?.billing?.nursingCharge?.aaya?.total && (
                    <tr>
                      <td className={admissionDetailsStyles.tableitemTDService}>
                        Nursing Charges (Aaya)
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {
                          admissionData?.billing?.nursingCharge?.aaya
                            ?.feesPerDay
                        }
                        .00
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {admissionData?.billing?.nursingCharge?.aaya?.days}
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {admissionData?.billing?.nursingCharge?.aaya?.total}.00
                      </td>
                    </tr>
                  )}

                  {admissionData?.billing?.nursingCharge?.specialCare
                    ?.total && (
                    <tr>
                      <td className={admissionDetailsStyles.tableitemTDService}>
                        Nursing Charges (Special Care)
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {
                          admissionData?.billing?.nursingCharge?.specialCare
                            ?.feesPerDay
                        }
                        .00
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {
                          admissionData?.billing?.nursingCharge?.specialCare
                            ?.days
                        }
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {
                          admissionData?.billing?.nursingCharge?.specialCare
                            ?.total
                        }
                        .00
                      </td>
                    </tr>
                  )}

                  {admissionData?.billing?.doctor?.total &&
                    admissionData?.billing?.doctor?.items?.map((data, indx) => (
                      <tr key={indx}>
                        <td
                          className={admissionDetailsStyles.tableitemTDService}>
                          Doctor Charges ({data?.doctorname})
                        </td>
                        <td className={admissionDetailsStyles.tableitemTD}>
                          {data?.chargepervisit}
                          .00
                        </td>
                        <td className={admissionDetailsStyles.tableitemTD}>
                          {data?.numberofvisit}
                        </td>
                        <td className={admissionDetailsStyles.tableitemTD}>
                          {data?.total}.00
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {(admissionData?.billing?.patientSummary?.chiefComplaint ||
                admissionData?.billing?.patientSummary?.presentIllness) && (
                <table className={`${admissionDetailsStyles.table}`}>
                  <tbody>
                    <tr>
                      <th className={admissionDetailsStyles.tableitemService}>
                        Chief Complaint
                      </th>
                      <th className={admissionDetailsStyles.tableitemService}>
                        Present Illness
                      </th>
                    </tr>

                    <tr>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {admissionData?.billing?.patientSummary?.chiefComplaint}
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {admissionData?.billing?.patientSummary?.presentIllness}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {(admissionData?.billing?.admissionSummary?.dischargeAdvice ||
                admissionData?.billing?.admissionSummary
                  ?.dischargeCondition) && (
                <table className={`${admissionDetailsStyles.table}`}>
                  <tbody>
                    <tr>
                      <th className={admissionDetailsStyles.tableitemService}>
                        Chief Complaint
                      </th>
                      <th className={admissionDetailsStyles.tableitemService}>
                        Present Illness
                      </th>
                    </tr>

                    <tr>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {
                          admissionData?.billing?.admissionSummary
                            ?.dischargeAdvice
                        }
                      </td>
                      <td className={admissionDetailsStyles.tableitemTD}>
                        {
                          admissionData?.billing?.admissionSummary
                            ?.dischargeCondition
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {admissionData?.billing?.otCharge?.total ? (
                <>
                  <h3 className={admissionDetailsStyles.heading}>OT Charges</h3>
                  <table className={`${admissionDetailsStyles.table}`}>
                    <tbody>
                      <tr>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Type of OT
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Surgeon Name
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Surgeon Charge
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Anaesthetist Name
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Anaesthesia Charge
                        </th>
                      </tr>
                      <tr>
                        <td className={admissionDetailsStyles.tableitemTD}>
                          {admissionData?.billing?.otCharge?.typeOfOt}
                        </td>
                        <td className={admissionDetailsStyles.tableitemTD}>
                          {admissionData?.billing?.otCharge?.surgeonName}
                        </td>
                        <td className={admissionDetailsStyles.tableitemTD}>
                          {admissionData?.billing?.otCharge?.surgeonCharge}.00
                        </td>
                        <td className={admissionDetailsStyles.tableitemTD}>
                          {admissionData?.billing?.otCharge?.anaesthetistName}
                        </td>
                        <td className={admissionDetailsStyles.tableitemTD}>
                          {admissionData?.billing?.otCharge?.anaesthesiaCharge}
                          .00
                        </td>
                      </tr>
                      <tr>
                        <th className={admissionDetailsStyles.tableitemService}>
                          OT Room Charge
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Extra Charge
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Total
                        </th>
                      </tr>
                      <tr>
                        <td className={admissionDetailsStyles.tableitemTD}>
                          {admissionData?.billing?.otCharge?.otRoomCharge}.00
                        </td>
                        <td className={admissionDetailsStyles.tableitemTD}>
                          {admissionData?.billing?.otCharge?.extraCharge}.00
                        </td>
                        <td className={admissionDetailsStyles.tableitemTD}>
                          {admissionData?.billing?.otCharge?.total}.00
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              ) : (
                ""
              )}

              {admissionData?.billing?.medicineCharges?.total ? (
                <>
                  <h3 className={admissionDetailsStyles.heading}>OT Charges</h3>
                  <table className={`${admissionDetailsStyles.table}`}>
                    <tbody>
                      <tr>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Medicine Name
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Brand
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Cost/Stripe
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Cost/Vial
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Quantity
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Total
                        </th>
                      </tr>
                      {admissionData?.billing?.medicineCharges?.items?.map(
                        (data, indx) => (
                          <tr key={indx}>
                            <td className={admissionDetailsStyles.tableitemTD}>
                              {data?.medicineName}
                            </td>
                            <td className={admissionDetailsStyles.tableitemTD}>
                              {data?.brand}
                            </td>
                            <td className={admissionDetailsStyles.tableitemTD}>
                              {data.costPerStrip
                                ? data.costPerStrip + ".00"
                                : "00"}
                            </td>
                            <td className={admissionDetailsStyles.tableitemTD}>
                              {data.costPerVial
                                ? data.costPerVial + ".00"
                                : "00"}
                            </td>
                            <td className={admissionDetailsStyles.tableitemTD}>
                              {data?.quantity}
                            </td>
                            <td className={admissionDetailsStyles.tableitemTD}>
                              {data?.total}
                              .00
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </>
              ) : (
                ""
              )}

              {admissionData?.billing?.diagnosticCharges?.total ? (
                <>
                  <h3 className={admissionDetailsStyles.heading}>
                    Diagnostic Charges
                  </h3>
                  <table className={`${admissionDetailsStyles.table}`}>
                    <tbody>
                      <tr>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Test Name
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Dr Referral
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Test Details
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Cost
                        </th>
                        <th className={admissionDetailsStyles.tableitemService}>
                          Total
                        </th>
                      </tr>
                      {admissionData?.billing?.diagnosticCharges?.items?.map(
                        (data, indx) => (
                          <tr key={indx}>
                            <td className={admissionDetailsStyles.tableitemTD}>
                              {data.testName}
                            </td>
                            <td className={admissionDetailsStyles.tableitemTD}>
                              {data.drReferral}
                            </td>
                            <td className={admissionDetailsStyles.tableitemTD}>
                              {data.testDetails}
                            </td>
                            <td className={admissionDetailsStyles.tableitemTD}>
                              {data.cost}
                            </td>
                            <td className={admissionDetailsStyles.tableitemTD}>
                              {data.total}
                              .00
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </>
              ) : (
                ""
              )}

              <br />
              <table className={`${admissionDetailsStyles.table}`}>
                <tbody>
                  <div className={`${admissionDetailsStyles.tableFlex}`}>
                    <table className={`${admissionDetailsStyles.table}`}>
                      <tr>
                        <th className={admissionDetailsStyles.tableitemTDWord}>
                          Amount in word:
                        </th>
                        <td
                          className={admissionDetailsStyles.tableitemTDAmount}>
                          {amountWord}/-
                        </td>
                      </tr>
                    </table>
                    <table className={`${admissionDetailsStyles.table}`}>
                      <tbody>
                        <tr>
                          <th
                            className={admissionDetailsStyles.tableitemTDTotal}>
                            Total charge :
                          </th>
                          <td
                            className={admissionDetailsStyles.tableitemTDTotal}>
                            {`Rs ${
                              admissionData?.billing?.total?.totalCharge ??
                              admissionData?.billing?.totalCharge
                            }`}
                            .00
                          </td>
                        </tr>
                        {/* <hr /> */}
                        <br />
                        {admissionData?.billing?.total?.tds ? (
                          <tr>
                            <th
                              className={
                                admissionDetailsStyles.tableitemTDTotal
                              }>
                              TDS :
                            </th>
                            <td
                              className={
                                admissionDetailsStyles.tableitemTDTotal
                              }>
                              {` ${admissionData?.billing?.total?.tds}`}.00
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}

                        {admissionData?.billing?.total?.advancePaid ? (
                          <tr>
                            <th
                              className={
                                admissionDetailsStyles.tableitemTDTotal
                              }>
                              Advance paid :
                            </th>
                            <td
                              className={
                                admissionDetailsStyles.tableitemTDTotal
                              }>
                              {`Rs ${admissionData?.billing?.total?.advancePaid}`}
                              .00
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}

                        {/* <tr>
                          <th
                            className={admissionDetailsStyles.tableitemTDTotal}>
                            Payable amount :
                          </th>
                          <td
                            className={admissionDetailsStyles.tableitemTDTotal}>
                            {`Rs ${
                              admissionData?.billing?.total?.payableAmount ??
                              admissionData?.billing?.totalCharge
                            }`}
                            .00
                          </td>
                        </tr> */}
                        {admissionData?.billing?.total?.cgst ? (
                          <tr>
                            <th
                              className={
                                admissionDetailsStyles.tableitemTDTotal
                              }>
                              CGST :
                            </th>
                            <td
                              className={
                                admissionDetailsStyles.tableitemTDTotal
                              }>
                              {`Rs ${admissionData?.billing?.total?.cgst}`}.00
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}
                        {admissionData?.billing?.total?.sgst ? (
                          <tr>
                            <th
                              className={
                                admissionDetailsStyles.tableitemTDTotal
                              }>
                              SGST :
                            </th>
                            <td
                              className={
                                admissionDetailsStyles.tableitemTDTotal
                              }>
                              {`Rs ${admissionData?.billing?.total?.sgst}`}.00
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}

                        {admissionData?.billing?.total?.roundOff ? (
                          <tr>
                            <th
                              className={
                                admissionDetailsStyles.tableitemTDTotal
                              }>
                              Round off discount :
                            </th>
                            <td
                              className={
                                admissionDetailsStyles.tableitemTDTotal
                              }>
                              {`Rs ${admissionData?.billing?.total?.roundOff}`}
                              .00
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}

                        {admissionData?.billing?.total?.discount ? (
                          <tr>
                            <th
                              className={
                                admissionDetailsStyles.tableitemTDTotal
                              }>
                              Discount on total :
                            </th>
                            <td
                              className={
                                admissionDetailsStyles.tableitemTDTotal
                              }>
                              {`Rs ${admissionData?.billing?.total?.discount}`}
                              .00
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}

                        <br />
                        <tr>
                          <th
                            className={admissionDetailsStyles.tableitemTDTotal}>
                            Payable Amount :
                          </th>
                          <td
                            className={admissionDetailsStyles.tableitemTDTotal}>
                            {`Rs ${
                              admissionData?.billing?.total?.netPayableAmount ??
                              admissionData?.billing?.totalCharge
                            }`}
                            .00
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </tbody>
              </table>
              <hr />

              <table
                className={`${admissionDetailsStyles.signature} ${admissionDetailsStyles.table}`}>
                <tbody>
                  <tr>
                    <th className={admissionDetailsStyles.tableitem}>
                      Signature of Patient
                    </th>
                    <th className={admissionDetailsStyles.tableitem}>
                      <div className={admissionDetailsStyles.rightSignArea}>
                        Signature of Issuer
                        <br />
                        <br />
                        <hr />
                        Signature <br />
                      </div>
                    </th>
                  </tr>
                </tbody>
              </table>
              <hr />
            </>
          ) : (
            <h3 className={admissionDetailsStyles.heading}>Billing pending</h3>
          )}
          <p className={admissionDetailsStyles.heading}>
            ! Keep all papers carefully and bring them along during your next
            visit to our hospital !
          </p>
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

AdmissionDetails.adminRoute = true;
export default AdmissionDetails;
