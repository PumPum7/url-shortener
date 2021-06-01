import { GetServerSideProps } from "next";

import { getLongUrl } from "@functions/urlHandlers";

const Url = () => {
    return null;
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const { shortUrl } = context.params;
    console.log(shortUrl, "shortUrl");

    // .then because it would be a promise otherwise
    const data = await getLongUrl({ shortUrl }).then((data) => {
        return data;
    });
    if (data !== undefined && data.long !== undefined) {
        if (!data.long.startsWith("http")) {
            data.long = "https://" + data.long;
        }

        return {
            redirect: {
                destination: data.long,
                permanent: true,
            },
        };
    } else {
        return {
            redirect: {
                destination: "/",
                permanent: true,
            },
        };
    }
};

export default Url;
