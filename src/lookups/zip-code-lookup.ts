import type { Address, ErrorResponse } from "../usps";
import type USPSClass from "../usps";
import callUSPS from "../utils/request";
import properCase from "../utils/proper-case";

export interface ZipCodeLookupRequest {
  Address: {
    Address1?: string;
    Address2?: string;
    City?: string;
    FirmName?: string;
    State?: string;
    Zip4?: string;
    Zip5?: string;
  };
}

export interface ZipCodeLookupResponse {
  Address?: {
    Address1?: string;
    Address2?: string;
    City?: string;
    FirmName?: string;
    State?: string;
    Urbanization?: string;
    Zip4?: string;
    Zip5?: string;
  };
  Error?: ErrorResponse;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default async function (
  this: USPSClass,
  address: Address
): Promise<Address | Error> {
  let response;
  try {
    response = (await callUSPS(
      "ZipCodeLookup",
      "ZipCodeLookup",
      "Address",
      this.config,
      {
        Address: {
          Address1: address.Address2 || "",
          Address2: address.Address1,
          City: address.City,
          State: address.State,
        },
      }
    )) as ZipCodeLookupResponse["Address"];
    if (response) {
      if (this.config.properCase) {
        response.Address1 = response.Address2
          ? properCase(response.Address2)
          : undefined;
        response.Address2 = response.Address1
          ? properCase(response.Address1)
          : undefined;
        response.City = response.City ? properCase(response.City) : undefined;
        response.FirmName = response.FirmName
          ? properCase(response.FirmName)
          : undefined;
      }
      return response;
    }
    throw new Error("Can't find results");
  } catch (error) {
    return error as Error;
  }
}
