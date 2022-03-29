// package: webtor.url_store
// file: proto/url-store/url-store.proto

import * as proto_url_store_url_store_pb from "../../proto/url-store/url-store_pb";
import {grpc} from "@improbable-eng/grpc-web";

type UrlStorePush = {
  readonly methodName: string;
  readonly service: typeof UrlStore;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_url_store_url_store_pb.PushRequest;
  readonly responseType: typeof proto_url_store_url_store_pb.PushReply;
};

type UrlStoreCheck = {
  readonly methodName: string;
  readonly service: typeof UrlStore;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_url_store_url_store_pb.CheckRequest;
  readonly responseType: typeof proto_url_store_url_store_pb.CheckReply;
};

export class UrlStore {
  static readonly serviceName: string;
  static readonly Push: UrlStorePush;
  static readonly Check: UrlStoreCheck;
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

export class UrlStoreClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  push(
    requestMessage: proto_url_store_url_store_pb.PushRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_url_store_url_store_pb.PushReply|null) => void
  ): UnaryResponse;
  push(
    requestMessage: proto_url_store_url_store_pb.PushRequest,
    callback: (error: ServiceError|null, responseMessage: proto_url_store_url_store_pb.PushReply|null) => void
  ): UnaryResponse;
  check(
    requestMessage: proto_url_store_url_store_pb.CheckRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_url_store_url_store_pb.CheckReply|null) => void
  ): UnaryResponse;
  check(
    requestMessage: proto_url_store_url_store_pb.CheckRequest,
    callback: (error: ServiceError|null, responseMessage: proto_url_store_url_store_pb.CheckReply|null) => void
  ): UnaryResponse;
}

