// package: 
// file: proto/torrent-store/torrent-store.proto

import * as proto_torrent_store_torrent_store_pb from "../../proto/torrent-store/torrent-store_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TorrentStorePush = {
  readonly methodName: string;
  readonly service: typeof TorrentStore;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_torrent_store_torrent_store_pb.PushRequest;
  readonly responseType: typeof proto_torrent_store_torrent_store_pb.PushReply;
};

type TorrentStorePull = {
  readonly methodName: string;
  readonly service: typeof TorrentStore;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_torrent_store_torrent_store_pb.PullRequest;
  readonly responseType: typeof proto_torrent_store_torrent_store_pb.PullReply;
};

type TorrentStoreTouch = {
  readonly methodName: string;
  readonly service: typeof TorrentStore;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_torrent_store_torrent_store_pb.TouchRequest;
  readonly responseType: typeof proto_torrent_store_torrent_store_pb.TouchReply;
};

export class TorrentStore {
  static readonly serviceName: string;
  static readonly Push: TorrentStorePush;
  static readonly Pull: TorrentStorePull;
  static readonly Touch: TorrentStoreTouch;
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

export class TorrentStoreClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  push(
    requestMessage: proto_torrent_store_torrent_store_pb.PushRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_torrent_store_torrent_store_pb.PushReply|null) => void
  ): UnaryResponse;
  push(
    requestMessage: proto_torrent_store_torrent_store_pb.PushRequest,
    callback: (error: ServiceError|null, responseMessage: proto_torrent_store_torrent_store_pb.PushReply|null) => void
  ): UnaryResponse;
  pull(
    requestMessage: proto_torrent_store_torrent_store_pb.PullRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_torrent_store_torrent_store_pb.PullReply|null) => void
  ): UnaryResponse;
  pull(
    requestMessage: proto_torrent_store_torrent_store_pb.PullRequest,
    callback: (error: ServiceError|null, responseMessage: proto_torrent_store_torrent_store_pb.PullReply|null) => void
  ): UnaryResponse;
  touch(
    requestMessage: proto_torrent_store_torrent_store_pb.TouchRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_torrent_store_torrent_store_pb.TouchReply|null) => void
  ): UnaryResponse;
  touch(
    requestMessage: proto_torrent_store_torrent_store_pb.TouchRequest,
    callback: (error: ServiceError|null, responseMessage: proto_torrent_store_torrent_store_pb.TouchReply|null) => void
  ): UnaryResponse;
}

