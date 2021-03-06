import { BigNumber } from "bignumber.js";
import * as iots from "io-ts";

/** 20 byte hex-encoded key hash prefixed with "0x" */
export type Address = string;

/** Securities in S3 are defined by an integer key */
export type SecurityId = BigNumber;

export const baseSecurityRT = iots.type({
  admin: iots.string,
  resolver: iots.string,
  investors: iots.array(
    iots.type({
      address: iots.string,
      amount: iots.string
    })
  ),
  metadata: iots.type({
    name: iots.string,
    symbol: iots.string
  })
});

export type BaseSecurity = iots.TypeOf<typeof baseSecurityRT>;

export const indexedSecurityRT = iots.intersection([
  baseSecurityRT,
  iots.type({ securityId: iots.number })
]);

export interface IndexedSecurity extends BaseSecurity {
  securityId: number;
}

// A log entry for something that we just did
export type TranscriptEntry /* call */ =
  | {
      type: "call";
      description: string;
      observation: { [key: string]: unknown };
    }
  | /* send */ {
      type: "send";
      description: string;
      hash: string;
      gasUsed: number;
      data: { [key: string]: unknown };
    };

export interface OfflineTranscriptEntry {
  description: string;
  params: { [key: string]: unknown };
  // There will be signed transactions for many gas price levels
  signedTxes: Array<[string, string]>;
}

export type Transcript = Array<TranscriptEntry>;
export type OfflineTranscript = Array<OfflineTranscriptEntry>;

/** A selection of transfer errors */
export namespace Errors {
  export enum RegD {
    Ok = 0,
    HoldingPeriod,
    ShareholderMaximum,
    BuyerAMLKYC,
    SellerAMLKYC,
    Accreditation
  }
}
