// package: 
// file: proto/abuse-store/abuse-store.proto

var proto_abuse_store_abuse_store_pb = require("../../proto/abuse-store/abuse-store_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var AbuseStore = (function () {
  function AbuseStore() {}
  AbuseStore.serviceName = "AbuseStore";
  return AbuseStore;
}());

AbuseStore.Push = {
  methodName: "Push",
  service: AbuseStore,
  requestStream: false,
  responseStream: false,
  requestType: proto_abuse_store_abuse_store_pb.PushRequest,
  responseType: proto_abuse_store_abuse_store_pb.PushReply
};

AbuseStore.Check = {
  methodName: "Check",
  service: AbuseStore,
  requestStream: false,
  responseStream: false,
  requestType: proto_abuse_store_abuse_store_pb.CheckRequest,
  responseType: proto_abuse_store_abuse_store_pb.CheckReply
};

exports.AbuseStore = AbuseStore;

function AbuseStoreClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

AbuseStoreClient.prototype.push = function push(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AbuseStore.Push, {
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

AbuseStoreClient.prototype.check = function check(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AbuseStore.Check, {
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

exports.AbuseStoreClient = AbuseStoreClient;

