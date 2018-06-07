// Returns if we are running in development mode
function devMode() {
  return location.hostname === "localhost" || location.hostname === "127.0.0.1";
}

@autobind
class VocloudTask {
  listeners = new Map();
  vocloudUrl = 'https://cloud.voctrolabs.com/api';

  static api = {
    ajaxSettings: {
      contentType: 'application/json',
      dataType: 'json',
      headers: {Authorization: eval('(function(){var F=Array.prototype.slice.call(arguments),Z=F.shift();return F.reverse().map(function(y,k){return String.fromCharCode(y-Z-0-k)}).join(\'\')})(52,176,147,170,176,169,209,162,172,176,133,196,167,180,199,158,188,154,199,150,162,163,188,129,180,169,117,146,117,164,115,130,111,160,177,146,130,148,89,155,160,169,150,118)+(845).toString(36).toLowerCase()+(11).toString(36).toLowerCase().split(\'\').map(function(H){return String.fromCharCode(H.charCodeAt()+(-13))}).join(\'\')+(959).toString(36).toLowerCase().split(\'\').map(function(q){return String.fromCharCode(q.charCodeAt()+(-39))}).join(\'\')+(function(){var a=Array.prototype.slice.call(arguments),d=a.shift();return a.reverse().map(function(y,J){return String.fromCharCode(y-d-10-J)}).join(\'\')})(27,124,107,153)+(24).toString(36).toLowerCase().split(\'\').map(function(G){return String.fromCharCode(G.charCodeAt()+(-39))}).join(\'\')+(750873).toString(36).toLowerCase()+(45066).toString(36).toLowerCase().split(\'\').map(function(H){return String.fromCharCode(H.charCodeAt()+(-39))}).join(\'\')+(18).toString(36).toLowerCase()+(16).toString(36).toLowerCase().split(\'\').map(function(a){return String.fromCharCode(a.charCodeAt()+(-13))}).join(\'\')+(32).toString(36).toLowerCase()+(29).toString(36).toLowerCase().split(\'\').map(function(U){return String.fromCharCode(U.charCodeAt()+(-39))}).join(\'\')+(3383).toString(36).toLowerCase()+(35).toString(36).toLowerCase().split(\'\').map(function(y){return String.fromCharCode(y.charCodeAt()+(-39))}).join(\'\')+(28865).toString(36).toLowerCase()+(588).toString(36).toLowerCase().split(\'\').map(function(z){return String.fromCharCode(z.charCodeAt()+(-13))}).join(\'\')+(44813).toString(36).toLowerCase().split(\'\').map(function(B){return String.fromCharCode(B.charCodeAt()+(-39))}).join(\'\')+(25385).toString(36).toLowerCase()+(11).toString(36).toLowerCase().split(\'\').map(function(n){return String.fromCharCode(n.charCodeAt()+(-13))}).join(\'\')+(862).toString(36).toLowerCase().split(\'\').map(function(A){return String.fromCharCode(A.charCodeAt()+(-39))}).join(\'\')+(0).toString(36).toLowerCase()+(15).toString(36).toLowerCase().split(\'\').map(function(r){return String.fromCharCode(r.charCodeAt()+(-13))}).join(\'\')+(28963).toString(36).toLowerCase()+(34).toString(36).toLowerCase().split(\'\').map(function(I){return String.fromCharCode(I.charCodeAt()+(-39))}).join(\'\')+(22).toString(36).toLowerCase()+(function(){var m=Array.prototype.slice.call(arguments),z=m.shift();return m.reverse().map(function(u,K){return String.fromCharCode(u-z-7-K)}).join(\'\')})(50,181,161,164,156,143,144,156,158,177,154,165,176,169,151,153,112,134,132,145,123,169)+(19).toString(36).toLowerCase().split(\'\').map(function(O){return String.fromCharCode(O.charCodeAt()+(-39))}).join(\'\')+(550).toString(36).toLowerCase().split(\'\').map(function(O){return String.fromCharCode(O.charCodeAt()+(-13))}).join(\'\')+(13).toString(36).toLowerCase()+(1257).toString(36).toLowerCase().split(\'\').map(function(K){return String.fromCharCode(K.charCodeAt()+(-39))}).join(\'\')+(23).toString(36).toLowerCase()+(1108).toString(36).toLowerCase().split(\'\').map(function(K){return String.fromCharCode(K.charCodeAt()+(-39))}).join(\'\')')}
    },
    maxWait: 1000 * 60 * 10, // Max wait time for a task to finish (in milliseconds): 10min
  };

  constructor(api) {
    this.api = api;
    this.logEnabled = devMode();
  }

  // JQuery Ajax call configured to handle errors and log responses
  // Return (data, textStatus, jqXHR) for resolved promise
  async ajax(settings) {
    return new Promise((resolve, reject) => {
      $.ajax(settings)
        .done((...args) => this.ajaxDone(resolve, ...args))
        .fail((...args) => this.ajaxFail(reject, ...args));
    });
  };

  // JQuery Ajax call configured to handle errors, log responses and
  // set the default parameters for Vocloud API
  async ajaxApi(settings) {
    const mergedSettings = Object.assign({}, this.constructor.api.ajaxSettings, settings);
    return this.ajax(mergedSettings);
  }

  ajaxDone(resolve, data, textStatus, jqXHR) {
    this.log('Response: ' + JSON.stringify(data));
    resolve({data, textStatus, jqXHR});
  }

  // Common fail function for all AJAX calls
  ajaxFail(reject, jqXHR, textStatus, errorThrown) {
    this.log('Error: ' + textStatus);
    let msg;
    if (jqXHR.status === 0) {
      msg = 'No connection: Verify Network.';
    } else if (jqXHR.status === 404) {
      msg = 'Requested page not found [404]';
    } else if (jqXHR.status === 500) {
      msg = 'Internal server error [500].';
    } else if (jqXHR.status === 429) {
      msg = 'You have exceeded the maximum amount of requests allowed. Please wait some minutes and try later.';
    } else if (jqXHR.status === 403) {
      msg = 'Access forbidden [403].\nYou have exceeded the maximum amount of requests allowed. Please wait some minutes and try later.';
    } else if (textStatus === 'parsererror') {
      msg = 'Requested JSON parse failed.';
    } else if (textStatus === 'timeout') {
      msg = 'Time out error.';
    } else if (textStatus=== 'abort') {
      msg = 'Ajax request aborted.';
    } else {
      msg = 'Unknown error';
    }
    reject(new Error(msg));
  };

  log(text) {
    if (this.logEnabled) console.log(text);
  };

  async create(postData) {
    this.trigger('create:start');
    this.log(`POST create ${this.api} task`);
    const {data, jqXHR} = await this.ajaxApi({
      type: 'POST',
      url: [this.vocloudUrl, this.api, 'tasks'].join('/'),
      data: JSON.stringify(postData)
    });
    $.extend(this, data); // copy response attributes to task object
    this.uri = jqXHR.getResponseHeader('Location');
    this.trigger('create:end');
  };

  async uploadFile(uploadUrl, data, contentType) {
    this.log(`PUT upload to S3 for ${this.api} task`);
    return this.ajax({
      type: 'PUT',
      url: uploadUrl,
      data: data,
      contentType: contentType,
      processData: false
    });
  };

  async start() {
    this.trigger('start:start');
    this.log(`POST create ${this.api} task`);
    await this.ajaxApi({
      type: 'POST',
      url: [this.uri, 'start'].join('/')
    });
    this.trigger('start:end');
  };

  async update() {
    this.trigger('update:start');
    const {data} = await this.ajaxApi({
      type: 'GET',
      url: this.uri
    });
    $.extend(this, data); // copy response attributes to task object
    this.trigger('update:end');
  };

  async updateUntilProcessed(milliseconds = 1000) {
    for (let i = 0; i < this.constructor.api.maxWait; i += milliseconds) {
      if (this.status === 'finished') break;
      if (this.status === 'failed') {
        const msg = `There was an error processing ${this.api} task: ${this.error}`;
        this.log(msg);
        throw new Error(msg);
      }
      await new Promise((resolve) => setTimeout(resolve, milliseconds));
      await this.update();
    }
  };

  async process(parameters, uploads) {
    this.trigger('process:start');
    await this.create(this._processParameters(parameters, uploads));
    await this._processUploads(uploads);
    await this.start();
    await this.updateUntilProcessed();
    this.trigger('process:end');
  };

  _processParameters(parameters = {}, uploads = {}) {
    const processedParams = Object.assign({}, parameters); // clone input parameters
    // Add parameters so that Vocloud returns the urls for uploading files
    for (let key in uploads) processedParams[`${key}_upload_parts`] = 1
    return processedParams;
  }

  // Upload files
  async _processUploads(uploads = {}) {
    const promises = [];
    let upload, uploadUrl, promise;
    for (let key in uploads) {
      upload = uploads[key];
      uploadUrl = this[`${key}_upload_urls`][0];
      promise = this.uploadFile(uploadUrl, upload.data, upload.contentType);
      promises.push(promise);
    }
    return Promise.all(promises);
  };

  // Unregister a listener
  off(eventName, callback) {
    if (eventName === undefined) this.listeners.clear();
    else {
      const eventListeners = this.listeners.get(eventName);
      if (!eventListeners) return;
      const index = eventListeners.indexOf(callback);
      if (index > -1) eventListeners.splice(index, 1);
    }
  }

  // Register a new listener and return a disposer
  on(eventName, callback) {
    let eventListeners = this.listeners.get(eventName);
    if (!eventListeners) {
      eventListeners = [];
      this.listeners.set(eventName, eventListeners)
    }
    eventListeners.push(callback);
    return () => this.off(eventName, callback);
  }

  // Emit and event
  trigger(eventName, ...args) {
    const eventListeners = this.listeners.get(eventName);
    eventListeners && eventListeners.forEach(listener => listener(...args));
  }

}
