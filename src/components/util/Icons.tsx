import React from "react";

export const Loading = ({ className }: { className: string }): React.ReactElement  => {
    return (
        <div className={className}>
            <svg
                className="-ml-1 mr-3 w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
};

export const Scissors = ({
    onClick,
    className,
}: {
    onClick: () => void;
    className: string;
}): React.ReactElement  => {
    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
        <div
            className={className}
            onClick={async () => onClick()}
            role="button"
            aria-label="Shorten URL">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                    fillRule="evenodd"
                    d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42a3.5 3.5 0 101.414 1.414l8.128-8.127a1 1 0 00-1.414-1.414L10 8.586l-1.42-1.42A3.5 3.5 0 005.5 2zM4 5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 9a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                    clipRule="evenodd"
                />
                <path d="M12.828 11.414a1 1 0 00-1.414 1.414l3.879 3.88a1 1 0 001.414-1.415l-3.879-3.879z" />
            </svg>
        </div>
    );
};

const Icon = ({
    className,
    d,
}: {
    className: string;
    d: string;
}): React.ReactElement  => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className || "w-5 h-5"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={d}
            />
        </svg>
    );
};

export const CopyIcon = ({
    className,
}: {
    className?: string;
}): React.ReactElement => {
    return (
        <Icon
            className={className}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
    );
};

export const CheckIcon = ({
    className,
}: {
    className?: string;
}): React.ReactElement  => {
    return <Icon className={className} d="M5 13l4 4L19 7" />;
};

export const QRCodeIcon = ({
    className,
}: {
    className?: string;
}): React.ReactElement => {
    return (
        <Icon
            className={className}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
        />
    );
};

export const TrashIcon = ({
    className,
}: {
    className?: string;
}): React.ReactElement  => {
    return (
        <Icon
            className={className}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
    );
};

export const PencilIcon = ({
    className,
}: {
    className?: string;
}): React.ReactElement  => {
    return (
        <Icon
            className={className}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
    );
};

export const ChartPieIcon = ({
    className,
}: {
    className?: string;
}): React.ReactElement  => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className || "w-5 h-5"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
        </svg>
    );
};

export const LinkIcon = ({
    className,
}: {
    className?: string;
}): React.ReactElement  => {
    return (
        <Icon
            className={className}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
    );
};

export const AdjustmentsIcon = ({
    className,
}: {
    className?: string;
}): React.ReactElement  => {
    return (
        <Icon
            className={className}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
    );
};

export const ChevronLeftIcon = ({
    className,
}: {
    className?: string;
}): React.ReactElement  => {
    return <Icon className={className} d="M15 19l-7-7 7-7" />;
};

export const ChevronRightIcon = ({
    className,
}: {
    className?: string;
}): React.ReactElement  => {
    return <Icon className={className} d="M9 5l7 7-7 7" />;
};
