import React from 'react';
import { Platform } from 'react-native';
import branch from 'react-native-branch';
/*
import { VESDK } from 'react-native-videoeditorsdk';
*/

import {
  PERMISSIONS,
  requestMultiple,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import axios from 'axios';

import Helper from './Util';
import RestAPI from './RestAPI';

const Global = {
  registerPushToken: () => {
    if (!global.me || !global._pushAppId || !global._deviceId) {
      return;
    }

    const params = {
      user_id: global.me?.id,
      one_signal_id: global._pushAppId,
      token: global._pushToken,
      device_id: global._deviceId,
      device_type: Platform.OS === 'ios' ? '1' : '0',
    };
    //global.showForcePageLoader(true);
    RestAPI.register_push_token(params, (json, err) => {
      global.showForcePageLoader(false);

      if (err !== null) {
        Helper.alertNetworkError();
      } else {
        if (json.status !== 204) {
          Helper.alertServerDataError();
        }
      }
    });
  },
  uploadToCloudinary: async (source, folder = 'unknown', adaptive = false) => {
    if (Platform.OS === 'ios') {
      source.uri = source?.uri?.replace('file://', '/');
    }
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('file', source);
      data.append('upload_preset', 'dmljgqvn');
      data.append('cloud_name', 'snaplist');
      data.append('folder', folder);
      data.append('api_key', '882925219281537');
      data.append('api_secret', 'ppqMDgtivesiIut2_uC0rSylJHM');

      const url = 'https://api.cloudinary.com/v1_1/snaplist/upload';

      axios({
        url,
        method: 'POST',
        data: data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          //'Authorization':'Basic YnJva2VyOmJyb2tlcl8xMjM='
        },
      })
        .then(function (response) {
          resolve(response?.data?.secure_url);
        })
        .catch(function (error) {
          console.log(error);
          resolve(null);
        });
    });
  },
  inviteToLiveStream: async (room, user) => {
    const userId = user?.id;
    const roomId = room?.id;

    const channelName = room?.topic || room?.roomName;
    const image = room?.thumbnail;

    const branchUniversalObject = await branch.createBranchUniversalObject(
      'canonicalIdentifier',
      {
        locallyIndex: true,
        title: 'Welcome to my channel.',
        contentImageUrl: image,
        contentDescription: '',
      },
    );

    const shareOptions = {
      messageHeader: 'Come to chat with me',
      messageBody: `${user?.username} invited you to channel ${channelName}!`,
    };
    const linkProperties = { feature: 'share', channel: 'facebook' };
    let controlParams = {
      roomId,
      inviterId: userId,
    };

    await branchUniversalObject.showShareSheet(
      shareOptions,
      linkProperties,
      controlParams,
    );
  },
  shareProduct: async (product, user) => {
    const userId = user?.id;

    const newTagList = product.tagList?.map((tag) => tag.name)?.join(' ');
    const image = product?.thumb;

    const branchUniversalObject = await branch.createBranchUniversalObject(
      'canonicalIdentifier',
      {
        locallyIndex: true,
        title: 'View product',
        contentImageUrl: image,
        contentDescription: '',
      },
    );

    const shareOptions = {
      messageHeader: 'Come to view product',
      messageBody: `${user?.username} invited you to a product ${newTagList}!`,
    };
    const linkProperties = { feature: 'share', channel: 'facebook' };
    let controlParams = {
      product: JSON.stringify(product),
      inviterId: userId,
    };

    await branchUniversalObject.showShareSheet(
      shareOptions,
      linkProperties,
      controlParams,
    );
  },
  sharePost: async (post, user) => {
    const userId = user?.id;
    if (!post) {
      return;
    }
    const title = post?.title;
    const image = post?.thumb;

    const branchUniversalObject = await branch.createBranchUniversalObject(
      'canonicalIdentifier',
      {
        locallyIndex: true,
        title: 'View Post',
        contentImageUrl: image,
        contentDescription: '',
      },
    );

    const shareOptions = {
      messageHeader: 'Come to view post',
      messageBody: `${user?.username} invited you to a post ${title}!`,
    };
    const linkProperties = { feature: 'share', channel: 'facebook' };
    let controlParams = {
      post: JSON.stringify(post),
      inviterId: userId,
    };

    await branchUniversalObject.showShareSheet(
      shareOptions,
      linkProperties,
      controlParams,
    );
  },
  makeId: (length) => {
    const result = [];
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength)),
      );
    }
    return result.join('');
  },
  checkPermissionsForVideo: async () => {
    try {
      const permissions =
        Platform.OS === 'ios'
          ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]
          : [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO];
      const statues = (await requestMultiple(permissions)) || {};
      if (Platform.OS === 'ios') {
        return (
          statues[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED &&
          statues[PERMISSIONS.IOS.MICROPHONE] === RESULTS.GRANTED
        );
      }
      if (Platform.OS === 'android') {
        return (
          statues[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED &&
          statues[PERMISSIONS.ANDROID.RECORD_AUDIO] === RESULTS.GRANTED
        );
      }
    } catch (error) {
      return false;
    }
  },
  checkPermissionsForStorage: async () => {
    try {
      const permissions =
        Platform.OS === 'ios'
          ? [PERMISSIONS.IOS.PHOTO_LIBRARY]
          : [
              PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
              PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            ];
      const statues = await requestMultiple(permissions);
      if (Platform.OS === 'ios') {
        return statues[PERMISSIONS.IOS.PHOTO_LIBRARY] === RESULTS.GRANTED;
      }
      if (Platform.OS === 'android') {
        return (
          statues[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] ===
            RESULTS.GRANTED &&
          statues[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
            RESULTS.GRANTED
        );
      }
    } catch (error) {
      return false;
    }
  },
  checkPermissionsForNotification: async () => {
    try {
      const result = await requestNotifications();
      return result?.status;
    } catch (error) {
      return '';
    }
  },
  convertToHLS: (url) => {
    return url
      ?.replace(
        'video/upload/',
        'video/upload/q_auto:eco,vc_h264:baseline:3.1/',
      )
      ?.replace(/\.[^/.]+$/, '.m3u8');
  },
  openEditor: async (videoUri) => {
    try {
      // if (videoUri) {
      //   let configuration = {
      //     audio: {
      //       categories: [
      //         {
      //           thumbnailURI: require('./../../assets/images/gifts/apple.png'),
      //           identifier: 'example_audio_category_logos',
      //           items: [
      //             {
      //               identifier: 'example_audio_item_1',
      //               thumbnailURI: require('./../../assets/images/gifts/bird.png'),
      //               duration: 30,
      //               audioURI:
      //                 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3',
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   };
      //   const result = await VESDK.openEditor(videoUri, configuration);
      //   if (result && result.video) {
      //     return result.video;
      //   }
      // }
    } catch (error) {
      console.log(error);
    }
    return videoUri;
  },
};

export default Global;
