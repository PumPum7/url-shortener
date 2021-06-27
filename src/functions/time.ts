export const timeDifference = (timestamp: number): string => {
    if (!timestamp) {
        return "0 minutes ago";
    }
    const curTime = new Date();
    const creationTime = new Date(timestamp);
    const difference = curTime.getTime() - creationTime.getTime();

    // Months
    const months = Math.floor(difference / 1000 / 60 / (60 * 24) / 30); // uses 30 as default
    if (months > 0) {
        return `about ${months} month${months > 1 ? "s" : ""} ago`;
    }

    // days if months are not available
    const days = Math.floor(difference / 1000 / 60 / (60 * 24));
    if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    // hours if days are not enough
    const hours = Math.floor(difference / 1000 / 60 / 60);
    if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    // minutes are hours are not enough
    const minutes = Math.floor(difference / 1000 / 60);
    return `${minutes} minute${minutes > 1 || minutes == 0 ? "s" : ""} ago`;
};
