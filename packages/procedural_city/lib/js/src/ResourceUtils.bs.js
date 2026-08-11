'use strict';


function buildEmptyResourceId(param) {
  return -1;
}

function isEmptyResourceId(resourceId) {
  return resourceId === -1;
}

exports.buildEmptyResourceId = buildEmptyResourceId;
exports.isEmptyResourceId = isEmptyResourceId;
/* No side effect */
