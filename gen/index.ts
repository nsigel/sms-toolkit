import * as dom from "dts-dom";
import axios from "axios";

import fs from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

async function generateTruverifiTypes(): Promise<dom.EnumDeclaration> {
  const apiKey = process.env.TRUVERIFI_API_KEY;
  if (!apiKey) throw new Error("Gen: Truverifi API key not found");

  const { data } = await axios.post(
    "https://app.truverifi.com/api/checkService",
    {},
    { headers: { "x-api-key": apiKey } }
  );

  const enm = dom.create.enum("TRUVERIFI_SERVICES", undefined, dom.DeclarationFlags.Export);

  data.availableServices.forEach((service: string) => {
    // Make sure the service name is not all numbers
    const serviceName = !/\D/.test(service) ? `"${service}_"` : `"${service}"`;

    enm.members.push(dom.create.enumValue(serviceName, service));
  });

  return enm;
}

(async () => {
  const truverifiEnum = await generateTruverifiTypes();
  const dtsPath = path.join(__dirname, "..", "..", "gen", "services.ts");

  await fs.promises.writeFile(dtsPath, dom.emit(truverifiEnum));
})();
