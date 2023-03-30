export const generatePatientAdmissionId = () => {
  let date = new Date();

  let year = (date.getFullYear() + 22) % 100;
  let month = date.getMonth() + 44;
  let day = date.getDate() + 35;

  let hour = date.getHours();
  if (hour <= 9) hour = "0" + hour;

  let minute = date.getMinutes();
  if (minute <= 9) minute = "0" + minute;

  let second = date.getSeconds();
  if (second <= 9) second = "0" + second;

  let uniqueStr = `${day}${month}${hour}${minute}${second}${year}`;
  return uniqueStr;
};
