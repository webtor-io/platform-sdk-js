// package: 
// file: proto/download-progress/download-progress.proto

import * as jspb from "google-protobuf";

export class StatRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StatRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StatRequest): StatRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StatRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StatRequest;
  static deserializeBinaryFromReader(message: StatRequest, reader: jspb.BinaryReader): StatRequest;
}

export namespace StatRequest {
  export type AsObject = {
  }
}

export class StatReply extends jspb.Message {
  getStatus(): StatReply.StatusMap[keyof StatReply.StatusMap];
  setStatus(value: StatReply.StatusMap[keyof StatReply.StatusMap]): void;

  getDownloaded(): number;
  setDownloaded(value: number): void;

  getRate(): number;
  setRate(value: number): void;

  getLength(): number;
  setLength(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StatReply.AsObject;
  static toObject(includeInstance: boolean, msg: StatReply): StatReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StatReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StatReply;
  static deserializeBinaryFromReader(message: StatReply, reader: jspb.BinaryReader): StatReply;
}

export namespace StatReply {
  export type AsObject = {
    status: StatReply.StatusMap[keyof StatReply.StatusMap],
    downloaded: number,
    rate: number,
    length: number,
  }

  export interface StatusMap {
    NOT_STARTED: 0;
    PENDING: 1;
    ACTIVE: 2;
    DONE: 3;
    FAILED: 4;
  }

  export const Status: StatusMap;
}

