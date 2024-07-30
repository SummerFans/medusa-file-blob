import { ModuleProviderExports } from "@medusajs/types"
import { BlobFileService } from "./services/blob"

const services = [BlobFileService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport