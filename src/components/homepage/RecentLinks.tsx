import { getUserUrls } from "@functions/urlHandlers";

export const RecentLinks = (): JSX.Element => {
    return (
        <div>
            <button onClick={async () => await getUserUrls()}>sure</button>
        </div>
    );
};

export const RecentLink = (): JSX.Element => {
    return <></>;
};
