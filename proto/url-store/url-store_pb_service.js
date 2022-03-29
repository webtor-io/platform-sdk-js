// package: webtor.url_store
// file: proto/url-store/url-store.proto

var proto_url_store_url_store_pb = require("../../proto/url-store/url-store_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var UrlStore = (function () {
  function UrlStore() {}
  UrlStore.serviceName = "webtor.url_store.UrlStore";
  return UrlStore;
}());

UrlStore.Push = {
  methodName: "Push",
  service: UrlStore,
  requestStream: false,
  responseStream: false,
  requestType: proto_url_store_url_store_pb.PushRequest,
  responseType: proto_url_store_url_store_pb.PushReply
};

UrlStore.Check = {
  methodName: "Check",
  service: UrlStore,
  requestStream: false,
  responseStream: false,
  requestType: proto_url_store_url_store_pb.CheckRequest,
  responseType: proto_url_store_url_store_pb.CheckReply
};

exports.UrlStore = UrlStore;

function UrlStoreClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

UrlStoreClient.prototype.push = function push(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(UrlStore.Push, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

UrlStoreClient.prototype.check = function check(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(UrlStore.Check, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.UrlStoreClient = UrlStoreClient;

