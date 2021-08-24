// package: 
// file: proto/download-progress/download-progress.proto

var proto_download_progress_download_progress_pb = require("../../proto/download-progress/download-progress_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var DownloadProgress = (function () {
  function DownloadProgress() {}
  DownloadProgress.serviceName = "DownloadProgress";
  return DownloadProgress;
}());

DownloadProgress.Stat = {
  methodName: "Stat",
  service: DownloadProgress,
  requestStream: false,
  responseStream: false,
  requestType: proto_download_progress_download_progress_pb.StatRequest,
  responseType: proto_download_progress_download_progress_pb.StatReply
};

DownloadProgress.StatStream = {
  methodName: "StatStream",
  service: DownloadProgress,
  requestStream: false,
  responseStream: true,
  requestType: proto_download_progress_download_progress_pb.StatRequest,
  responseType: proto_download_progress_download_progress_pb.StatReply
};

exports.DownloadProgress = DownloadProgress;

function DownloadProgressClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

DownloadProgressClient.prototype.stat = function stat(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(DownloadProgress.Stat, {
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

DownloadProgressClient.prototype.statStream = function statStream(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(DownloadProgress.StatStream, {
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

exports.DownloadProgressClient = DownloadProgressClient;

