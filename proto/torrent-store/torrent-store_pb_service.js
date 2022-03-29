// package: 
// file: proto/torrent-store/torrent-store.proto

var proto_torrent_store_torrent_store_pb = require("../../proto/torrent-store/torrent-store_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TorrentStore = (function () {
  function TorrentStore() {}
  TorrentStore.serviceName = "TorrentStore";
  return TorrentStore;
}());

TorrentStore.Push = {
  methodName: "Push",
  service: TorrentStore,
  requestStream: false,
  responseStream: false,
  requestType: proto_torrent_store_torrent_store_pb.PushRequest,
  responseType: proto_torrent_store_torrent_store_pb.PushReply
};

TorrentStore.Pull = {
  methodName: "Pull",
  service: TorrentStore,
  requestStream: false,
  responseStream: false,
  requestType: proto_torrent_store_torrent_store_pb.PullRequest,
  responseType: proto_torrent_store_torrent_store_pb.PullReply
};

TorrentStore.Touch = {
  methodName: "Touch",
  service: TorrentStore,
  requestStream: false,
  responseStream: false,
  requestType: proto_torrent_store_torrent_store_pb.TouchRequest,
  responseType: proto_torrent_store_torrent_store_pb.TouchReply
};

exports.TorrentStore = TorrentStore;

function TorrentStoreClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TorrentStoreClient.prototype.push = function push(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TorrentStore.Push, {
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

TorrentStoreClient.prototype.pull = function pull(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TorrentStore.Pull, {
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

TorrentStoreClient.prototype.touch = function touch(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TorrentStore.Touch, {
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

exports.TorrentStoreClient = TorrentStoreClient;

