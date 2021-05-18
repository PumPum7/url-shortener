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
