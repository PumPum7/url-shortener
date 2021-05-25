import { superTokensNextWrapper } from 'supertokens-node/nextjs'
import ThirdPartyEmailPasswordNode from "supertokens-node/recipe/thirdpartyemailpassword";
import SessionNode from "supertokens-node/recipe/session";
import supertokens from 'supertokens-node'

const port = process.env.APP_PORT || 3000;
const websiteDomain =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    `http://localhost:${port}`;
const apiBasePath = "/api/auth/";

let appInfo = {
    appName: "URL Shortener",
    websiteDomain,
    apiDomain: websiteDomain,
    apiBasePath,
};

export let backendConfig = () => {
    return {
        supertokens: {
            connectionURI: "https://try.supertokens.io",
        },
        appInfo,
        recipeList: [
            ThirdPartyEmailPasswordNode.init({
                providers: [
                    ThirdPartyEmailPasswordNode.Github({
                        clientSecret:
                            process.env.GITHUB_CLIENT_SECRET || "PLACEHOLDER",
                        clientId: process.env.GITHUB_CLIENT_ID || "PLACEHOLDER",
                    }),
                ],
            }),
            SessionNode.init(),
        ],
        isInServerlessEnv: true,
    };
};

supertokens.init(backendConfig());

export default async function superTokens(req, res) {
  await superTokensNextWrapper(
    async (next) => {
      await supertokens.middleware()(req, res, next)
    },
    req,
    res
  )
  if (!res.writableEnded) {
    res.status(404).send('Not found')
  }
}