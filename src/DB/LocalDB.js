var Realm = require('realm');
import LocalStore from './local_store';

const RealmDB = {
  initDB: () => {
    let realm = new Realm({
      path: LocalStore.keys.realmPathName,
      schema: [
        {
          name: LocalStore.keys.dictTblName,
          primaryKey: 'id',
          properties: {
            id: { type: 'int', default: 0 },
            name: 'string',
            value: 'string',
          },
        },
      ],
    });
  },
  initLocalDBFromJSON: (jsonList, callBack) => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    let dicts = realm
      .objects(LocalStore.keys.dictTblName)
      .sorted('eword', false);
    if (dicts.length > 0) {
      realm.write(() => {
        realm.delete(dicts);
        for (var i = 0; i < jsonList.length; i++) {
          let item = jsonList[i];

          realm.create(LocalStore.keys.dictTblName, {
            eword: item.eword,
            edesc: item.edesc,
            aword: item.aword,
            adesc: item.adesc,
            dict_id: i + 1,
          });
        }
        callBack();
      });
    } else {
      realm.write(() => {
        for (var i = 0; i < jsonList.length; i++) {
          let item = jsonList[i];
          realm.create(LocalStore.keys.dictTblName, {
            eword: item.eword,
            edesc: item.edesc,
            aword: item.aword,
            adesc: item.adesc,
            dict_id: i + 1,
          });
        }

        callBack();
      });
    }
  },
  getAllSettingList: () => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    return realm.objects(LocalStore.keys.dictTblName).sorted('name', false);
  },
  getLang: () => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });

    let findItems = [];
    try {
      findItems = realm
        .objects(LocalStore.keys.dictTblName)
        .filtered('name ==[c] "lang"');
      if (findItems.length > 0) {
        return findItems[0].value;
      } else {
        return '';
      }
    } catch (e) {
      return '';
    }
  },
  setLang: (val) => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    let findItems = [];
    try {
      findItems = realm
        .objects(LocalStore.keys.dictTblName)
        .filtered('name ==[c] "lang"');
    } catch (e) {}
    if (findItems.length > 0) {
      realm.write(() => {
        realm.delete(findItems);
        realm.write(() => {
          let envs = realm
            .objects(LocalStore.keys.dictTblName)
            .sorted('id', true);
          var ID = envs.length > 0 ? envs[0].id + 1 : 1;

          realm.create(LocalStore.keys.dictTblName, {
            id: ID,
            name: 'lang',
            value: val,
          });
        });
      });
    } else {
      realm.write(() => {
        let envs = realm
          .objects(LocalStore.keys.dictTblName)
          .sorted('id', true);
        var ID = envs.length > 0 ? envs[0].id + 1 : 1;
        realm.create(LocalStore.keys.dictTblName, {
          id: ID,
          name: 'lang',
          value: val,
        });
      });
    }
  },

  getAllDictList: () => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    return realm.objects(LocalStore.keys.dictTblName).sorted('eword', false);
  },
  updateEnv: (keyName, val) => {
    let findItems = [];
    try {
      findItems = realm
        .objects(LocalStore.keys.dictTblName)
        .filtered('name ==[c] "' + keyName + '"');
    } catch (e) {}
    if (findItems.length > 0) {
      realm.write(() => {
        realm.delete(findItems);
        this.createNewEnvItem(keyName, val);
      });
    } else {
      this.createNewEnvItem(keyName, val);
    }
  },
  createNewEnvItem: (key, value) => {
    realm.write(() => {
      let envs = realm.objects(LocalStore.keys.dictTblName).sorted('id', true);
      var ID = envs.length > 0 ? envs[0].id + 1 : 1;

      realm.create(LocalStore.keys.favTblName, {
        id: ID,
        name: key,
        value: value,
      });
    });
  },

  getTestDictList: (eword) => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    try {
      return realm
        .objects(LocalStore.keys.dictTblName)
        .filtered('eword ==[c] "' + eword + '"');
    } catch (e) {
      return [];
    }
  },

  insertFav: (item, callBack) => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    let findItems = [];
    try {
      findItems = realm
        .objects(LocalStore.keys.favTblName)
        .filtered('eword ==[c] "' + item.eword + '"');
    } catch (e) {}

    if (findItems.length > 0) {
      realm.write(() => {
        realm.delete(findItems);
        callBack(false);
      });
    } else {
      realm.write(() => {
        let favs = realm
          .objects(LocalStore.keys.favTblName)
          .sorted('fav_id', true);
        var ID = favs.length > 0 ? favs[0].fav_id + 1 : 1;

        realm.create(LocalStore.keys.favTblName, {
          fav_id: ID,
          eword: item.eword,
          edesc: item.edesc,
          aword: item.aword,
          adesc: item.adesc,
        });
        callBack(true);
      });
    }
  },
  removeFav: (item, callBack): Boolean => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });

    if (item === null) {
      let findItems = realm.objects(LocalStore.keys.favTblName);
      if (findItems.length > 0) {
        realm.write(() => {
          realm.delete(findItems);
          callBack(true);
        });
      } else {
        callBack(false);
      }
    } else {
      let findItems = [];
      try {
        findItems = realm
          .objects(LocalStore.keys.favTblName)
          .filtered('eword ==[c] "' + item.eword + '"');
      } catch (e) {}

      if (findItems.length > 0) {
        realm.write(() => {
          realm.delete(findItems);
          callBack(true);
        });
      } else {
        callBack(false);
      }
    }
  },
  getAllFavList: (sort) => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    var reverse = false;
    if (sort === null) {
      sort = 'eword';
    } else if (sort == 1) {
      // a - z
      sort = 'eword';
      reverse = false;
    } else if (sort == 2) {
      // z-a
      sort = 'eword';
      reverse = true;
    } else if (sort == 3) {
      // first added
      sort = 'fav_id';
      reverse = false;
    } else if (sort == 4) {
      // last added
      sort = 'fav_id';
      reverse = true;
    } else {
      sort = 'eword';
    }

    return realm.objects(LocalStore.keys.favTblName).sorted(sort, reverse);
  },

  findFavItem: (eword) => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    try {
      let findItems = realm
        .objects(LocalStore.keys.favTblName)
        .filtered('eword ==[c] "' + eword + '"');
      return findItems.length > 0 ? findItems[0] : null;
    } catch (e) {
      return [];
    }
  },
  isInFavList: (eword): Boolean => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    try {
      let findItems = realm
        .objects(LocalStore.keys.favTblName)
        .filtered('eword ==[c] "' + eword + '"');
      return findItems.length > 0;
    } catch (e) {
      return [];
    }
  },

  insertRecent: (item, callBack) => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    let findItems = [];
    try {
      findItems = realm
        .objects(LocalStore.keys.recentTblName)
        .filtered('eword ==[c] "' + item.eword + '"');
    } catch (e) {}

    if (findItems.length > 0) {
      callBack(true);
    } else {
      realm.write(() => {
        let recents = realm
          .objects(LocalStore.keys.recentTblName)
          .sorted('recent_id', true);
        var ID = recents.length > 0 ? recents[0].recent_id + 1 : 1;

        realm.create(LocalStore.keys.recentTblName, {
          recent_id: ID,
          eword: item.eword,
          edesc: item.edesc,
          aword: item.aword,
          adesc: item.adesc,
        });
        callBack(true);
      });
    }
  },
  removeRecent: (eword, callBack): Boolean => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });

    let findItems = null;
    if (eword === null) {
      findItems = realm.objects(LocalStore.keys.recentTblName);
    } else {
      try {
        findItems = realm
          .objects(LocalStore.keys.recentTblName)
          .filtered('eword ==[c] "' + eword + '"');
      } catch (e) {
        findItems = [];
      }
    }

    if (findItems.length > 0) {
      realm.write(() => {
        realm.delete(findItems);
        callBack(true);
      });
    } else {
      callBack(false);
    }
  },
  getAllRecentList: () => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    return realm.objects(LocalStore.keys.recentTblName).sorted('eword', false);
  },
  findRecentItem: (eword) => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    try {
      let findItems = realm
        .objects(LocalStore.keys.recentTblName)
        .filtered(' eword ==[c] "' + eword + '"');
      return findItems.length > 0 ? findItems[0] : null;
    } catch (e) {
      return [];
    }
  },
  isInRecentList: (eword): Boolean => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    try {
      let findItems = realm
        .objects(LocalStore.keys.recentTblName)
        .filtered(' eword ==[c] "' + eword + '"');
      return findItems.length > 0;
    } catch (e) {
      return [];
    }
  },
  getLastRecent: () => {
    let realm = new Realm({ path: LocalStore.keys.realmPathName });
    let res = realm
      .objects(LocalStore.keys.recentTblName)
      .sorted('eword', false);
    return res === null || res.length <= 0 ? null : res[0];
  },
};

export default RealmDB;
