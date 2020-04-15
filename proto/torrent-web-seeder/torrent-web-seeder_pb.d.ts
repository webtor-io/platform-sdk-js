// package: 
// file: proto/torrent-web-seeder/torrent-web-seeder.proto

import * as jspb from "google-protobuf";

export class StatRequest extends jspb.Message {
  getPath(): string;
  setPath(value: string): void;

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
    path: string,
  }
}

export class StatReply extends jspb.Message {
  getTotal(): number;
  setTotal(value: number): void;

  getCompleted(): number;
  setCompleted(value: number): void;

  getPeers(): number;
  setPeers(value: number): void;

  getStatus(): StatReply.StatusMap[keyof StatReply.StatusMap];
  setStatus(value: StatReply.StatusMap[keyof StatReply.StatusMap]): void;

  clearPiecesList(): void;
  getPiecesList(): Array<Piece>;
  setPiecesList(value: Array<Piece>): void;
  addPieces(value?: Piece, index?: number): Piece;

  getSeeders(): number;
  setSeeders(value: number): void;

  getLeechers(): number;
  setLeechers(value: number): void;

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
    total: number,
    completed: number,
    peers: number,
    status: StatReply.StatusMap[keyof StatReply.StatusMap],
    piecesList: Array<Piece.AsObject>,
    seeders: number,
    leechers: number,
  }

  export interface StatusMap {
    INITIALIZATION: 0;
    SEEDING: 1;
    IDLE: 2;
    TERMINATED: 3;
    WAITING_FOR_PEERS: 4;
    RESTORING: 5;
    BACKINGUP: 6;
  }

  export const Status: StatusMap;
}

export class Piece extends jspb.Message {
  getPosition(): number;
  setPosition(value: number): void;

  getComplete(): boolean;
  setComplete(value: boolean): void;

  getPriority(): Piece.PriorityMap[keyof Piece.PriorityMap];
  setPriority(value: Piece.PriorityMap[keyof Piece.PriorityMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Piece.AsObject;
  static toObject(includeInstance: boolean, msg: Piece): Piece.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Piece, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Piece;
  static deserializeBinaryFromReader(message: Piece, reader: jspb.BinaryReader): Piece;
}

export namespace Piece {
  export type AsObject = {
    position: number,
    complete: boolean,
    priority: Piece.PriorityMap[keyof Piece.PriorityMap],
  }

  export interface PriorityMap {
    NONE: 0;
    NORMAL: 1;
    HIGH: 2;
    READAHEAD: 3;
    NEXT: 4;
    NOW: 5;
  }

  export const Priority: PriorityMap;
}

export class FilesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FilesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FilesRequest): FilesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FilesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FilesRequest;
  static deserializeBinaryFromReader(message: FilesRequest, reader: jspb.BinaryReader): FilesRequest;
}

export namespace FilesRequest {
  export type AsObject = {
  }
}

export class File extends jspb.Message {
  getPath(): string;
  setPath(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): File.AsObject;
  static toObject(includeInstance: boolean, msg: File): File.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: File, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): File;
  static deserializeBinaryFromReader(message: File, reader: jspb.BinaryReader): File;
}

export namespace File {
  export type AsObject = {
    path: string,
  }
}

export class FilesReply extends jspb.Message {
  clearFilesList(): void;
  getFilesList(): Array<File>;
  setFilesList(value: Array<File>): void;
  addFiles(value?: File, index?: number): File;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FilesReply.AsObject;
  static toObject(includeInstance: boolean, msg: FilesReply): FilesReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FilesReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FilesReply;
  static deserializeBinaryFromReader(message: FilesReply, reader: jspb.BinaryReader): FilesReply;
}

export namespace FilesReply {
  export type AsObject = {
    filesList: Array<File.AsObject>,
  }
}

