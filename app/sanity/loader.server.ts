import * as serverOnly from "@sanity/react-loader";
import { client } from "~/lib/sanity";

const { loadQuery, setServerClient } = serverOnly;

setServerClient(client.withConfig({ token: process.env.SANITY_VIEWER_TOKEN }));

export { loadQuery };
