import { GetServerSideProps } from "next";

import { getLongUrl } from "@functions/urlHandlers";

const Url = () => {
    return null;
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const { shortUrl } = context.params;
    console.log(shortUrl);

    const data = await getLongUrl({ shortUrl });
    if (data !== undefined) {
        if (!data.long.startsWith("http")) {
            data.long = "http://" + data.long;
            console.log(data.long)
        }
        return {
            redirect: {
                destination: data.long,
                permanent: true,
            },
        };
    } else {
        return {
            notFound: true
        }
    }
};

export default Url;
