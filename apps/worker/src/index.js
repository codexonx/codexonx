'use strict';

/* eslint-disable no-console */
console.log('[worker] starting job runner...');

setInterval(() => {
  console.log('[worker] heartbeat', new Date().toISOString());
}, 60000);
/* eslint-enable no-console */
