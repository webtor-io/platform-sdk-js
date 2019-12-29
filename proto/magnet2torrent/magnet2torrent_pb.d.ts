// package: 
// file: proto/magnet2torrent/magnet2torrent.proto

import * as jspb from "google-protobuf";

export class Magnet2TorrentRequest extends jspb.Message {
  getMagnet(): string;
  setMagnet(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Magnet2TorrentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: Magnet2TorrentRequest): Magnet2TorrentRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Magnet2TorrentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Magnet2TorrentRequest;
  static deserializeBinaryFromReader(message: Magnet2TorrentRequest, reader: jspb.BinaryReader): Magnet2TorrentRequest;
}

export namespace Magnet2TorrentRequest {
  export type AsObject = {
    magnet: string,
  }
}

export class Magnet2TorrentReply extends jspb.Message {
  getTorrent(): Uint8Array | string;
  getTorrent_asU8(): Uint8Array;
  getTorrent_asB64(): string;
  setTorrent(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Magnet2TorrentReply.AsObject;
  static toObject(includeInstance: boolean, msg: Magnet2TorrentReply): Magnet2TorrentReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Magnet2TorrentReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Magnet2TorrentReply;
  static deserializeBinaryFromReader(message: Magnet2TorrentReply, reader: jspb.BinaryReader): Magnet2TorrentReply;
}

export namespace Magnet2TorrentReply {
  export type AsObject = {
    torrent: Uint8Array | string,
  }
}

