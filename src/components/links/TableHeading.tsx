import React from 'react';

interface TableHeadingProps {
    children: React.ReactNode;
    direction?: string;
}

export function TableHeading({
    direction = "text-left",
    children,
}: TableHeadingProps): React.ReactElement {
    return (
        <th
            scope="col"
            className={`px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase ${direction}`}>
            {children}
        </th>
    );
}
