export const timeDifference = (timestamp: string): string => {
    if (!timestamp) return "0 minutes ago";

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid date";

    const units = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
    ];

    const secondsPast = (Date.now() - date.getTime()) / 1000;

    for (const { label, seconds } of units) {
        const interval = Math.floor(secondsPast / seconds);
        if (interval >= 1) {
            return `${interval} ${label}${interval !== 1 ? 's' : ''} ago`;
        }
    }

    return "just now";
};
