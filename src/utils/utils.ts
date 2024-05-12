export function convertDateTimeToAgo(isoTime: string): string {
  const inputDate = new Date(isoTime); // Chuyển đổi chuỗi ISO 8601 thành đối tượng Date
  const currentDate = new Date(); // Lấy thời gian hiện tại

  const diffInSeconds = Math.floor(
    (currentDate.getTime() - inputDate.getTime()) / 1000
  ); // Tính khoảng cách thời gian theo giây

  if (diffInSeconds < 60) {
    return "a few seconds ago";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}

export function formatToDollar(amount: number): string {
  // Create a new Intl.NumberFormat object with the 'en-US' locale
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0, // Set minimum fraction digits to 0
    maximumFractionDigits: 2, // Set maximum fraction digits to 2
  });

  // Format the amount to the dollar format
  return formatter.format(amount);
}
