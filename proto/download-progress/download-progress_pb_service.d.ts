// package: 
// file: proto/download-progress/download-progress.proto

import * as proto_download_progress_download_progress_pb from "../../proto/download-progress/download-progress_pb";
import {grpc} from "@improbable-eng/grpc-web";

type DownloadProgressStat = {
  readonly methodName: string;
  readonly service: typeof DownloadProgress;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_download_progress_download_progress_pb.StatRequest;
  readonly responseType: typeof proto_download_progress_download_progress_pb.StatReply;
};

type DownloadProgressStatStream = {
  readonly methodName: string;
  readonly service: typeof DownloadProgress;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof proto_download_progress_download_progress_pb.StatRequest;
  readonly responseType: typeof proto_download_progress_download_progress_pb.StatReply;
};

export class DownloadProgress {
  static readonly serviceName: string;
  static readonly Stat: DownloadProgressStat;
  static readonly StatStream: DownloadProgressStatStream;
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

export class DownloadProgressClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  stat(
    requestMessage: proto_download_progress_download_progress_pb.StatRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_download_progress_download_progress_pb.StatReply|null) => void
  ): UnaryResponse;
  stat(
    requestMessage: proto_download_progress_download_progress_pb.StatRequest,
    callback: (error: ServiceError|null, responseMessage: proto_download_progress_download_progress_pb.StatReply|null) => void
  ): UnaryResponse;
  statStream(requestMessage: proto_download_progress_download_progress_pb.StatRequest, metadata?: grpc.Metadata): ResponseStream<proto_download_progress_download_progress_pb.StatReply>;
}

