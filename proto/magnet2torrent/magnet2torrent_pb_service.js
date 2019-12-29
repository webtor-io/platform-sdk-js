// package: 
// file: proto/magnet2torrent/magnet2torrent.proto

var proto_magnet2torrent_magnet2torrent_pb = require("../../proto/magnet2torrent/magnet2torrent_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Magnet2Torrent = (function () {
  function Magnet2Torrent() {}
  Magnet2Torrent.serviceName = "Magnet2Torrent";
  return Magnet2Torrent;
}());

Magnet2Torrent.Magnet2Torrent = {
  methodName: "Magnet2Torrent",
  service: Magnet2Torrent,
  requestStream: false,
  responseStream: false,
  requestType: proto_magnet2torrent_magnet2torrent_pb.Magnet2TorrentRequest,
  responseType: proto_magnet2torrent_magnet2torrent_pb.Magnet2TorrentReply
};

exports.Magnet2Torrent = Magnet2Torrent;

function Magnet2TorrentClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

Magnet2TorrentClient.prototype.magnet2Torrent = function magnet2Torrent(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Magnet2Torrent.Magnet2Torrent, {
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

exports.Magnet2TorrentClient = Magnet2TorrentClient;

