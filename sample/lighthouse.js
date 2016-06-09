/**
 * @license
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

const lighthouse = require('../lighthouse/');
const url = 'https://voice-memos.appspot.com/';
const flags = {};
const config = {
  passes: require('./configs/passes.json'),
  audits: require('./configs/audits.json'),
  aggregations: require('./configs/aggregations.json')
};

lighthouse(url, flags, config).then(aggregations => {
  console.log(aggregations);
}, err => console.log(err));
