import React, { useState, useEffect } from "react";

interface SearchAndPaginationProps {
    total: number;
    page: number;
    setPage: (page: number) => void;
    amount: number;
    setAmount: (amount: number) => void;
    search: string;
    setSearch: (search: string) => void;
}

export function SearchAndPagination({
    total,
    page,
    setPage,
    amount,
    setAmount,
    search,
    setSearch,
}: SearchAndPaginationProps): React.ReactElement {
    const [localSearch, setLocalSearch] = useState(search);

    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        setSearch(localSearch);
    };

    const disabledPrevious = page === 0;
    const disabledNext = (page + 1) * amount >= total;
    const start = total > 0 ? page * amount + 1 : 0;
    const end = total > 0 ? Math.min((page + 1) * amount, total) : 0;

    const handlePageChange = (action: "next" | "previous") => {
        if (action === "next" && !disabledNext) {
            setPage(page + 1);
        } else if (action === "previous" && !disabledPrevious) {
            setPage(page - 1);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white mb-4 rounded-lg shadow">
            <form className="flex items-center w-full md:w-auto" onSubmit={handleSearch}>
                <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search URLs..."
                    className="form-input"
                />
                <button type="submit" className="ml-2 form-button">
                    Search
                </button>
            </form>
            <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-4">
                <div className="text-gray-600 text-sm">
                    {total > 0 ? `Showing ${start} - ${end} of ${total}` : ""}
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        value={amount}
                        onChange={(e) => {
                            setAmount(Number(e.target.value));
                            setPage(0);
                        }}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="mx-2 block">|</span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange("previous")}
                            disabled={disabledPrevious}
                            className="btn-secondary disabled:opacity-50 disabled:hover:cursor-not-allowed">
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange("next")}
                            disabled={disabledNext}
                            className="btn-secondary disabled:opacity-50 disabled:hover:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
