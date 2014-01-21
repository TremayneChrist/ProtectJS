var API = (function () {

  function API () {
    var uidHistory, date, uid, randomResult;
    this._init();
  }

  API.prototype = {

      // Initialise the API
      _init: function () {
          uidHistory = [];
      },

      // Gets a random digit string
      _getRandom: function (digits) {
          randomResult = '';
          for (var i = 0; i < digits; i++) {
              randomResult += Math.floor(Math.random() * 10);
          }
          return randomResult;
      },

      // Saves the last 10 UIDs
      _updateHistory: function (item) {
          uidHistory.unshift(item);
          if (uidHistory.length > 10) uidHistory.pop();
      },

      // Generates a new UID
      generateID: function () {
          date = new Date();

          uid = this._getRandom(2) +
              date.getYear() +
              date.getMonth() +
              date.getDate() +
              date.getHours() +
              date.getMinutes() +
              date.getSeconds() +
              date.getMilliseconds() +
              this._getRandom(2);

          this._updateHistory(uid);

          return uid;
      },

      // Gets the history of the last 10 UIDs
      getHistory: function () {
          return uidHistory;
      }
  }

  return API;
})();

var API_PROTECTED = (function () {

  function API_PROTECTED () {
    var uidHistory, date, uid, randomResult;
    this._init();
  }

  API_PROTECTED.prototype = {

      // Initialise the API
      _init: function () {
          uidHistory = [];
      },

      // Gets a random digit string
      _getRandom: function (digits) {
          randomResult = '';
          for (var i = 0; i < digits; i++) {
              randomResult += Math.floor(Math.random() * 10);
          }
          return randomResult;
      },

      // Saves the last 10 UIDs
      _updateHistory: function (item) {
          uidHistory.unshift(item);
          if (uidHistory.length > 10) uidHistory.pop();
      },

      // Generates a new UID
      generateID: function () {
          date = new Date();

          uid = this._getRandom(2) +
              date.getYear() +
              date.getMonth() +
              date.getDate() +
              date.getHours() +
              date.getMinutes() +
              date.getSeconds() +
              date.getMilliseconds() +
              this._getRandom(2);

          this._updateHistory(uid);

          return uid;
      },

      // Gets the history of the last 10 UIDs
      getHistory: function () {
          return uidHistory;
      }
  }

  return protect(API_PROTECTED);
})();

