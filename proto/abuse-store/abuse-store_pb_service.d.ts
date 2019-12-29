// package: 
// file: proto/abuse-store/abuse-store.proto

import * as proto_abuse_store_abuse_store_pb from "../../proto/abuse-store/abuse-store_pb";
import {grpc} from "@improbable-eng/grpc-web";

type AbuseStorePush = {
  readonly methodName: string;
  readonly service: typeof AbuseStore;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_abuse_store_abuse_store_pb.PushRequest;
  readonly responseType: typeof proto_abuse_store_abuse_store_pb.PushReply;
};

type AbuseStoreCheck = {
  readonly methodName: string;
  readonly service: typeof AbuseStore;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_abuse_store_abuse_store_pb.CheckRequest;
  readonly responseType: typeof proto_abuse_store_abuse_store_pb.CheckReply;
};

export class AbuseStore {
  static readonly serviceName: string;
  static readonly Push: AbuseStorePush;
  static readonly Check: AbuseStoreCheck;
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

export class AbuseStoreClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  push(
    requestMessage: proto_abuse_store_abuse_store_pb.PushRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_abuse_store_abuse_store_pb.PushReply|null) => void
  ): UnaryResponse;
  push(
    requestMessage: proto_abuse_store_abuse_store_pb.PushRequest,
    callback: (error: ServiceError|null, responseMessage: proto_abuse_store_abuse_store_pb.PushReply|null) => void
  ): UnaryResponse;
  check(
    requestMessage: proto_abuse_store_abuse_store_pb.CheckRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_abuse_store_abuse_store_pb.CheckReply|null) => void
  ): UnaryResponse;
  check(
    requestMessage: proto_abuse_store_abuse_store_pb.CheckRequest,
    callback: (error: ServiceError|null, responseMessage: proto_abuse_store_abuse_store_pb.CheckReply|null) => void
  ): UnaryResponse;
}

