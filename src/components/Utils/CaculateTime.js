export const CaculateTime = (input, type = "timestamp") => {
  const now = new Date();
  let diff;

  if (type === "date") {
    diff = now.getTime() - input;
  } else if (type === "timestamp") {
    diff = now.getTime() - input.toDate().getTime();
  } else {
    throw new Error('Invalid type specified. Use "timestamp" or "date".');
  }
  // const diff = now.getTime() - timeStamp.toDate().getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes}min`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else {
    return `${days}d`;
  }
};
