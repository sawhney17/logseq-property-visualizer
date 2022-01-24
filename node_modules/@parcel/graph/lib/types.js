"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toNodeId = toNodeId;
exports.fromNodeId = fromNodeId;

// forcing NodeId to be opaque as it should only be created once
function toNodeId(x) {
  return x;
}

function fromNodeId(x) {
  return x;
}