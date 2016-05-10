/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const path = require('path');
const http = require('http');
const fs = require('fs');

class TestServer {
  constructor() {
    this._serverConnections = [];
    this._port = -1;
  }

  getUrl() {
    return 'http://localhost:' + this._port;
  }

  startServer(port) {
    return new Promise(resolve => {
      if (!port) {
        // Find next available port
        port = 0;
      }

      this._testServer = http.createServer(function(request, response) {
        try {
          const assetPath = path.join('.', request.url);

          // lstatSync throws if the file doesn't exist.
          fs.lstatSync(assetPath);
          const readStream = fs.createReadStream(assetPath);
          readStream.pipe(response);
        } catch (err) {
          response.end();
        }
      });

      const listener = this._testServer.listen(port, 'localhost', () => {
        const portNumber = listener.address().port;
        console.log('Server listening on: http://localhost:%s',
          portNumber);
        this._port = portNumber;

        resolve(portNumber);
      });

      listener.on('connection', socket => {
        this._serverConnections.push(socket);
        socket.on('close', () => {
          this._serverConnections.splice(
            this._serverConnections.indexOf(socket), 1);
        });
      });
    });
  }

  killServer() {
    return new Promise(resolve => {
      this._serverConnections.forEach(connection => {
        connection.destroy();
      });
      this._serverConnections = [];
      this._testServer.close(resolve);
    });
  }
}

module.exports = TestServer;
