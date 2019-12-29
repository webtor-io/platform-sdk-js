// package: 
// file: proto/torrent-web-seeder/torrent-web-seeder.proto

var proto_torrent_web_seeder_torrent_web_seeder_pb = require("../../proto/torrent-web-seeder/torrent-web-seeder_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TorrentWebSeeder = (function () {
  function TorrentWebSeeder() {}
  TorrentWebSeeder.serviceName = "TorrentWebSeeder";
  return TorrentWebSeeder;
}());

TorrentWebSeeder.Stat = {
  methodName: "Stat",
  service: TorrentWebSeeder,
  requestStream: false,
  responseStream: false,
  requestType: proto_torrent_web_seeder_torrent_web_seeder_pb.StatRequest,
  responseType: proto_torrent_web_seeder_torrent_web_seeder_pb.StatReply
};

TorrentWebSeeder.StatStream = {
  methodName: "StatStream",
  service: TorrentWebSeeder,
  requestStream: false,
  responseStream: true,
  requestType: proto_torrent_web_seeder_torrent_web_seeder_pb.StatRequest,
  responseType: proto_torrent_web_seeder_torrent_web_seeder_pb.StatReply
};

TorrentWebSeeder.Files = {
  methodName: "Files",
  service: TorrentWebSeeder,
  requestStream: false,
  responseStream: false,
  requestType: proto_torrent_web_seeder_torrent_web_seeder_pb.FilesRequest,
  responseType: proto_torrent_web_seeder_torrent_web_seeder_pb.FilesReply
};

exports.TorrentWebSeeder = TorrentWebSeeder;

function TorrentWebSeederClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TorrentWebSeederClient.prototype.stat = function stat(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TorrentWebSeeder.Stat, {
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

TorrentWebSeederClient.prototype.statStream = function statStream(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(TorrentWebSeeder.StatStream, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

TorrentWebSeederClient.prototype.files = function files(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TorrentWebSeeder.Files, {
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

exports.TorrentWebSeederClient = TorrentWebSeederClient;

