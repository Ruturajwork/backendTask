// function formatDateTime(inputDateTime) {
//   const parts = inputDateTime.split(",");
//   const datePart = parts[0].trim();
//   const timePart = parts[1].trim();

//   const dateParts = datePart.split("/");
//   const timeParts = timePart.split(":");

//   const year = `20${dateParts[0]}`;
//   const month = dateParts[1].padStart(2, "0");
//   const day = dateParts[2].padStart(2, "0");
//   const time = timeParts.join(":");

//   return `${year}-${month}-${day}T${time}`;
// }

// // Example usage:
// const inputDateTime = "21/03/19,09:01:46";
// const formattedDateTime = formatDateTime(inputDateTime);
// console.log(formattedDateTime); // Output: "2021-03-21T09:01:46"
function parseCustomDateTime(dateTimeString) {
  // Split the date and time parts
  const [datePart, timePart] = dateTimeString.split("_"); // Use "_" to split date and time

  // Split the date part into day, month, and year
  const [day, month, year] = datePart.split("-"); // Use "-" to split day, month, and year

  // Split the time part into hours, minutes, and seconds
  const [hours, minutes, seconds] = timePart.split("-"); // Use "-" to split hours, minutes, and seconds

  // Convert the parts to numbers
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  const hoursNum = parseInt(hours, 10);
  const minutesNum = parseInt(minutes, 10);
  const secondsNum = parseInt(seconds, 10);

  // Create a Date object (note that months are 0-based in JavaScript)
  const formattedDate = new Date(
    2000 + yearNum,
    monthNum - 1,
    dayNum,
    hoursNum,
    minutesNum,
    secondsNum
  );

  // Check if the formattedDate is valid before proceeding
  if (!isNaN(formattedDate)) {
    // Format the date as required: "YYYY-MM-DDTHH:mm:ss.SSSZ"
    const isoFormattedDate = formattedDate.toISOString();
    return isoFormattedDate;
  } else {
    console.warn(`Invalid date format in input: ${dateTimeString}`);
    return null; // You can return null or handle the invalid date as needed
  }
}

// Example usage:
const inputDateTime = "21-03-19_09-08-28";
const formattedDateTime = parseCustomDateTime(inputDateTime);
console.log(formattedDateTime); // Output: "2021-03-19T09:08:28.000Z"
