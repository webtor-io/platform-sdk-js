// package: 
// file: proto/torrent-store/torrent-store.proto

import * as jspb from "google-protobuf";

export class PushReply extends jspb.Message {
  getInfohash(): string;
  setInfohash(value: string): void;

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
    infohash: string,
  }
}

export class PushRequest extends jspb.Message {
  getTorrent(): Uint8Array | string;
  getTorrent_asU8(): Uint8Array;
  getTorrent_asB64(): string;
  setTorrent(value: Uint8Array | string): void;

  getExpire(): number;
  setExpire(value: number): void;

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
    torrent: Uint8Array | string,
    expire: number,
  }
}

export class PullRequest extends jspb.Message {
  getInfohash(): string;
  setInfohash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PullRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PullRequest): PullRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PullRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PullRequest;
  static deserializeBinaryFromReader(message: PullRequest, reader: jspb.BinaryReader): PullRequest;
}

export namespace PullRequest {
  export type AsObject = {
    infohash: string,
  }
}

export class PullReply extends jspb.Message {
  getTorrent(): Uint8Array | string;
  getTorrent_asU8(): Uint8Array;
  getTorrent_asB64(): string;
  setTorrent(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PullReply.AsObject;
  static toObject(includeInstance: boolean, msg: PullReply): PullReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PullReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PullReply;
  static deserializeBinaryFromReader(message: PullReply, reader: jspb.BinaryReader): PullReply;
}

export namespace PullReply {
  export type AsObject = {
    torrent: Uint8Array | string,
  }
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

export class TouchReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TouchReply.AsObject;
  static toObject(includeInstance: boolean, msg: TouchReply): TouchReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TouchReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TouchReply;
  static deserializeBinaryFromReader(message: TouchReply, reader: jspb.BinaryReader): TouchReply;
}

export namespace TouchReply {
  export type AsObject = {
  }
}

export class TouchRequest extends jspb.Message {
  getInfohash(): string;
  setInfohash(value: string): void;

  getExpire(): number;
  setExpire(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TouchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TouchRequest): TouchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TouchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TouchRequest;
  static deserializeBinaryFromReader(message: TouchRequest, reader: jspb.BinaryReader): TouchRequest;
}

export namespace TouchRequest {
  export type AsObject = {
    infohash: string,
    expire: number,
  }
}

