// package: 
// file: proto/magnet2torrent/magnet2torrent.proto

import * as proto_magnet2torrent_magnet2torrent_pb from "../../proto/magnet2torrent/magnet2torrent_pb";
import {grpc} from "@improbable-eng/grpc-web";

type Magnet2TorrentMagnet2Torrent = {
  readonly methodName: string;
  readonly service: typeof Magnet2Torrent;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_magnet2torrent_magnet2torrent_pb.Magnet2TorrentRequest;
  readonly responseType: typeof proto_magnet2torrent_magnet2torrent_pb.Magnet2TorrentReply;
};

export class Magnet2Torrent {
  static readonly serviceName: string;
  static readonly Magnet2Torrent: Magnet2TorrentMagnet2Torrent;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class Magnet2TorrentClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  magnet2Torrent(
    requestMessage: proto_magnet2torrent_magnet2torrent_pb.Magnet2TorrentRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_magnet2torrent_magnet2torrent_pb.Magnet2TorrentReply|null) => void
  ): UnaryResponse;
  magnet2Torrent(
    requestMessage: proto_magnet2torrent_magnet2torrent_pb.Magnet2TorrentRequest,
    callback: (error: ServiceError|null, responseMessage: proto_magnet2torrent_magnet2torrent_pb.Magnet2TorrentReply|null) => void
  ): UnaryResponse;
}

