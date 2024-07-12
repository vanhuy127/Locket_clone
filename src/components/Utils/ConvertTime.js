export const ConvertTime = (input) => {
  const now = new Date();

  const date = new Date(Number(input));

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng trong JavaScript bắt đầu từ 0
  const year = date.getFullYear();

  const isSameDay =
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear();

  const isSameYear = now.getFullYear() === year;
  if (isSameDay) {
    return `${hours}:${minutes}`;
  } else if (isSameYear) {
    return `${hours}:${minutes} ${day}/${month}`;
  } else {
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }
};
