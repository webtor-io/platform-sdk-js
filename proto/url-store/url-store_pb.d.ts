// package: webtor.url_store
// file: proto/url-store/url-store.proto

import * as jspb from "google-protobuf";

export class PushReply extends jspb.Message {
  getHash(): string;
  setHash(value: string): void;

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
    hash: string,
  }
}

export class PushRequest extends jspb.Message {
  getUrl(): string;
  setUrl(value: string): void;

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
    url: string,
  }
}

export class CheckRequest extends jspb.Message {
  getHash(): string;
  setHash(value: string): void;

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
    hash: string,
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

