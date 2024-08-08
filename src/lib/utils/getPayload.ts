import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "@payload-config"

const getPayload = () => getPayloadHMR({ config: configPromise })

export default getPayload