// package: 
// file: proto/abuse-store/abuse-store.proto

import * as jspb from "google-protobuf";

export class PushReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PushReply.AsObject;
  static toObject(includeInstance: boolean, msg: PushReply): PushReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PushReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PushReply;
  static deserializeBinaryFromReader(message: PushReply, reader: jspb.BinaryReader): PushReply;
}

export namespace PushReply {
  export type AsObject = {
  }
}

export class PushRequest extends jspb.Message {
  getNoticeId(): string;
  setNoticeId(value: string): void;

  getInfohash(): string;
  setInfohash(value: string): void;

  getFilename(): string;
  setFilename(value: string): void;

  getWork(): string;
  setWork(value: string): void;

  getStartedAt(): number;
  setStartedAt(value: number): void;

  getEmail(): string;
  setEmail(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getSubject(): string;
  setSubject(value: string): void;

  getCause(): PushRequest.CauseMap[keyof PushRequest.CauseMap];
  setCause(value: PushRequest.CauseMap[keyof PushRequest.CauseMap]): void;

  getSource(): PushRequest.SourceMap[keyof PushRequest.SourceMap];
  setSource(value: PushRequest.SourceMap[keyof PushRequest.SourceMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PushRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PushRequest): PushRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PushRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PushRequest;
  static deserializeBinaryFromReader(message: PushRequest, reader: jspb.BinaryReader): PushRequest;
}

export namespace PushRequest {
  export type AsObject = {
    noticeId: string,
    infohash: string,
    filename: string,
    work: string,
    startedAt: number,
    email: string,
    description: string,
    subject: string,
    cause: PushRequest.CauseMap[keyof PushRequest.CauseMap],
    source: PushRequest.SourceMap[keyof PushRequest.SourceMap],
  }

  export interface CauseMap {
    ILLEGAL_CONTENT: 0;
    MALWARE: 1;
    APP_ERROR: 2;
    QUESTION: 3;
  }

  export const Cause: CauseMap;

  export interface SourceMap {
    MAIL: 0;
    FORM: 1;
  }

  export const Source: SourceMap;
}

export class CheckRequest extends jspb.Message {
  getInfohash(): string;
  setInfohash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckRequest): CheckRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckRequest;
  static deserializeBinaryFromReader(message: CheckRequest, reader: jspb.BinaryReader): CheckRequest;
}

export namespace CheckRequest {
  export type AsObject = {
    infohash: string,
  }
}

export class CheckReply extends jspb.Message {
  getExists(): boolean;
  setExists(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckReply.AsObject;
  static toObject(includeInstance: boolean, msg: CheckReply): CheckReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckReply;
  static deserializeBinaryFromReader(message: CheckReply, reader: jspb.BinaryReader): CheckReply;
}

export namespace CheckReply {
  export type AsObject = {
    exists: boolean,
  }
}

