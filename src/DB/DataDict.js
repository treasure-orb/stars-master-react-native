import RestAPI from './RestAPI';

const DataDict = {
  response: null,
  pageSize: 50,
  searchAll: (keyword, Callback) => {
    if (keyword === null) {
      RestAPI.searchDictPage(0, this.pageSize, null, function (err) {
        Callback(err, null);
      }).then(function (res) {
        this.response = res;
        Callback(null, res);
      });
    } else {
      RestAPI.searchKeyWord(
        keyword,
        null,
        this.pageSize,
        0,
        function (err, res) {
          this.response = res;
          Callback(err, res);
        },
      );
    }
  },
  searchNext: (Callback) => {
    if (response !== null && response.hasOwnProperty('data')) {
      try {
        if (response.data.hasnext === 1) {
          if (response.data.keyword !== null) {
            RestAPI.searchKeyWord(
              response.data.keyword,
              null,
              this.pageSize,
              response.data.page_no + 1,
              function (err, res) {
                this.response = res;
                Callback(err, res);
              },
            );
          } else {
            RestAPI.searchDictPage(
              response.data.page_no + 1,
              pageSize,
              null,
              function (err) {
                Callback(err, null);
              },
            ).then(function (res) {
              this.response = res;
              Callback(null, res);
            });
          }
        } else {
          Callback('Last page loaded.', null);
        }
      } catch (e) {
        Callback(e, null);
      }
    } else {
      Callback('init data is null', null);
    }
  },
};

export default DataDict;
