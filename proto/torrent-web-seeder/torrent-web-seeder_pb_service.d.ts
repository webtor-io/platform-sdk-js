// package: 
// file: proto/torrent-web-seeder/torrent-web-seeder.proto

import * as proto_torrent_web_seeder_torrent_web_seeder_pb from "../../proto/torrent-web-seeder/torrent-web-seeder_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TorrentWebSeederStat = {
  readonly methodName: string;
  readonly service: typeof TorrentWebSeeder;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_torrent_web_seeder_torrent_web_seeder_pb.StatRequest;
  readonly responseType: typeof proto_torrent_web_seeder_torrent_web_seeder_pb.StatReply;
};

type TorrentWebSeederStatStream = {
  readonly methodName: string;
  readonly service: typeof TorrentWebSeeder;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof proto_torrent_web_seeder_torrent_web_seeder_pb.StatRequest;
  readonly responseType: typeof proto_torrent_web_seeder_torrent_web_seeder_pb.StatReply;
};

type TorrentWebSeederFiles = {
  readonly methodName: string;
  readonly service: typeof TorrentWebSeeder;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_torrent_web_seeder_torrent_web_seeder_pb.FilesRequest;
  readonly responseType: typeof proto_torrent_web_seeder_torrent_web_seeder_pb.FilesReply;
};

export class TorrentWebSeeder {
  static readonly serviceName: string;
  static readonly Stat: TorrentWebSeederStat;
  static readonly StatStream: TorrentWebSeederStatStream;
  static readonly Files: TorrentWebSeederFiles;
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

export class TorrentWebSeederClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  stat(
    requestMessage: proto_torrent_web_seeder_torrent_web_seeder_pb.StatRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_torrent_web_seeder_torrent_web_seeder_pb.StatReply|null) => void
  ): UnaryResponse;
  stat(
    requestMessage: proto_torrent_web_seeder_torrent_web_seeder_pb.StatRequest,
    callback: (error: ServiceError|null, responseMessage: proto_torrent_web_seeder_torrent_web_seeder_pb.StatReply|null) => void
  ): UnaryResponse;
  statStream(requestMessage: proto_torrent_web_seeder_torrent_web_seeder_pb.StatRequest, metadata?: grpc.Metadata): ResponseStream<proto_torrent_web_seeder_torrent_web_seeder_pb.StatReply>;
  files(
    requestMessage: proto_torrent_web_seeder_torrent_web_seeder_pb.FilesRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_torrent_web_seeder_torrent_web_seeder_pb.FilesReply|null) => void
  ): UnaryResponse;
  files(
    requestMessage: proto_torrent_web_seeder_torrent_web_seeder_pb.FilesRequest,
    callback: (error: ServiceError|null, responseMessage: proto_torrent_web_seeder_torrent_web_seeder_pb.FilesReply|null) => void
  ): UnaryResponse;
}

