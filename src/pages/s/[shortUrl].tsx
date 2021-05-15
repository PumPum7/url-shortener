import { GetServerSideProps } from "next";

import { getLongUrl } from "@functions/urlHandlers"

const Url = () => {
    return null;
  };

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const { shortUrl } = context.params;
    console.log(shortUrl)

    const data = await getLongUrl({shortUrl})
    
    return {
        redirect: {
            destination: data.long,
            permanent: true
        }
    }
}

export default Url;