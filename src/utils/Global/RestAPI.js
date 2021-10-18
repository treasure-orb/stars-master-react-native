import { formDataCall } from './ApiBase';

const RestAPI = {
  ErrCode: {
    EmailExist: 101,
    InvalidParams: 102,
    PackageInvalid: 103,
    RegisterFailed: 104,
  },

  login: (params, callBack) => {
    const data = {
      username: params.phone,
      password: params.password,
    };

    formDataCall('api/auth/login', data, {}, callBack, 'post');
  },

  signup: (params, callBack) => {
    const data = {
      username: params.username,
      phone: params.phone,
      password: params.password,
      userType: params.userType || 0,
    };

    formDataCall('api/auth/register', data, {}, callBack, 'post');
  },

  signin_or_signup: (params, callBack) => {
    const data = {
      username: params.username,
      password: params.password,
    };

    formDataCall('api/auth/loginOrRegister', data, {}, callBack, 'post');
  },

  update_profile_with_image: (params, callBack) => {
    let data = {
      userId: params.user_id,
      username: params.username,
      phone: params.phone,
    };

    if (params.username) {
      data.username = params.username;
    }

    if (params.photo) {
      data.photo = params.photo;
    }

    if (params.displayName) {
      data.displayName = params.displayName;
    }

    if (params.password) {
      data.password = params.password;
    }
    formDataCall('api/profile', data, {}, callBack, 'put');
  },

  add_video: (params, callBack) => {
    const data = {
      userId: params.userId,
      url: params.url,
      tags: params.tags,
      price: params.price,
      description: params.description,
      number: params.number,
      thumb: params.thumb,
      category: params.category,
      subCategory: params.subCategory,
      isPermanent: !!params.isPermanent,
    };
    formDataCall('api/video', data, {}, callBack, 'post');
  },

  add_post: (params, callBack) => {
    const data = {
      userId: params.userId,
      url: params.url,
      title: params.title,
      description: params.description,
      thumb: params.thumb,
    };
    formDataCall('api/post', data, {}, callBack, 'post');
  },

  get_user_video_list: (params, callBack) => {
    const data = {
      meId: params.me_id,
      userId: params.user_id,
      page: params.page_number,
      amount: params.count_per_page,
    };

    formDataCall('api/video/userVideo', data, {}, callBack, 'get');
  },

  get_user_post_list: (params, callBack) => {
    const data = {
      meId: params.me_id,
      userId: params.user_id,
      page: params.page_number,
      amount: params.count_per_page,
    };

    formDataCall('api/post/userPost', data, {}, callBack, 'get');
  },

  get_liked_video_list: (params, callBack) => {
    const data = {
      userId: params.user_id,
      page: params.page_number,
      amount: params.count_per_page,
    };

    formDataCall('api/video/likedVideos', data, {}, callBack, 'get');
  },

  get_new_post_list: (params, callBack) => {
    const data = {
      userId: params.userId,
      amount: params.amount,
      username: params.username,
      password: params.password,
    };

    formDataCall('api/post/newPosts', data, {}, callBack, 'get');
  },

  get_all_comment_list: (params, callBack) => {
    const data = {
      postId: params.postId,
      userId: params.user_id,
      page: params.page_number,
      amount: params.count_per_page,
    };

    formDataCall('api/post/comments', data, {}, callBack, 'get');
  },

  add_comment: (params, callBack) => {
    formDataCall('api/post/addComment', params, {}, callBack, 'post');
  },

  get_searched_video_list: (params, callBack) => {
    let data = {
      userId: params.user_id,
      page: params.page_number,
      amount: params.count_per_page,
      keyword: params.keyword,
    };

    formDataCall('api/video/searchVideo', data, {}, callBack, 'get');
  },

  get_category_video_list: (params, callBack) => {
    const data = {
      userId: params.user_id,
      page: params.page_number,
      amount: params.count_per_page,
    };

    if (params.category) {
      data.category = params.category;
    }

    if (params.subCategory) {
      data.subCategory = params.subCategory;
    }

    formDataCall('api/video/categoryVideo', data, {}, callBack, 'get');
  },

  get_random_video: (params, callBack) => {
    formDataCall('api/video/random', {}, {}, callBack, 'get');
  },

  get_top_page_text: (params, callBack) => {
    formDataCall('api/topPage/text', {}, {}, callBack, 'get');
  },

  get_room_list: (params, callBack) => {
    const data = {
      userId: params.user_id,
      page: params.page_number,
      amount: params.count_per_page,
    };

    formDataCall('api/productChat/roomList', data, {}, callBack, 'get');
  },

  get_message_list: (params, callBack) => {
    let data = {
      userId: params.userId,
      otherId: params.otherId,
      lastMessageCreatedAt: params.lastMessageCreatedAt,
    };
    if (params.lastMessageCreatedAt) {
      data.lastMessageCreatedAt = params.lastMessageCreatedAt;
    }
    formDataCall('api/productChat/messageList', data, {}, callBack, 'get');
  },

  get_liveStream_list: (params, callBack) => {
    const data = {
      userId: params.user_id,
      page: params.page_number,
      amount: params.count_per_page,
    };

    formDataCall('api/liveStream/all', data, {}, callBack, 'get');
  },

  get_liveStream: (params, callBack) => {
    const data = {
      id: params.roomId,
      userId: params.userId,
    };

    formDataCall('api/liveStream', data, {}, callBack, 'get');
  },

  get_gifts: (params, callBack) => {
    formDataCall('api/gifts/all', params, {}, callBack, 'get');
  },

  get_unread_count: (params, callBack) => {
    const data = {
      userId: params.user_id,
    };

    formDataCall('api/productChat/unReadCounts', data, {}, callBack, 'get');
  },

  set_read_status: (params, callBack) => {
    const data = {
      otherId: params.otherId,
      userId: params.userId,
    };

    formDataCall('api/productChat/readStatus', data, {}, callBack, 'patch');
  },

  register_push_token: (params, callBack) => {
    const data = {
      userId: params.user_id,
      oneSignalId: params.one_signal_id,
      token: params.token,
      deviceId: params.device_id,
      deviceType: params.device_type,
    };
    formDataCall('api/auth/registerPushToken', data, {}, callBack, 'put');
  },

  update_like_video: (params, callBack) => {
    const data = {
      userId: params.user_id,
      videoId: params.video_id,
      isLiked: params.is_like,
    };

    formDataCall('api/video/like', data, {}, callBack, 'put');
  },

  update_like_post: (params, callBack) => {
    const data = {
      userId: params.userId,
      ownerId: params.ownerId,
      postId: params.postId,
      isLiked: params.isLiked,
    };

    formDataCall('api/post/like', data, {}, callBack, 'put');
  },

  report_post: (params, callBack) => {
    const data = {
      userId: params.userId,
      postId: params.postId,
    };

    formDataCall('/api/post/report', data, {}, callBack, 'put');
  },

  get_filtered_user_list: (params, callBack) => {
    const data = {
      userId: params.user_id,
      page: params.page_number,
      amount: params.count_per_page,
      keyword: params.keyword,
    };

    formDataCall('api/user/all', data, {}, callBack, 'get');
  },
  get_fans_list: (params, callBack) => {
    const data = {
      userId: params.userId,
      page: params.page_number,
      amount: params.count_per_page,
    };
    formDataCall('api/user/fans', data, {}, callBack, 'get');
  },

  get_following_list: (params, callBack) => {
    const data = {
      userId: params.userId,
      page: params.page_number,
      amount: params.count_per_page,
    };
    formDataCall('api/user/followings', data, {}, callBack, 'get');
  },
  get_top_user_list: (params, callBack) => {
    const data = {
      sortBy: params?.sortBy || 'elixir',
      page: params?.page_number,
      amount: params?.count_per_page,
    };

    formDataCall('api/user/topUsers', data, {}, callBack, 'get');
  },

  get_all_users: (params, callBack) => {
    formDataCall('api/user/topSelectedUsers', {}, {}, callBack, 'get');
  },

  update_video_view: (params, callBack) => {
    const data = {
      videoId: params.video_id,
      viewerId: params.viewer_id,
      deviceType: params.device_type,
      deviceIdentifier: params.device_identifier,
    };

    formDataCall('api/video/view', data, {}, callBack, 'put');
  },

  update_post_view: (params, callBack) => {
    const data = {
      postId: params.postId,
      viewerId: params.viewerId,
      deviceType: params.deviceType,
      deviceIdentifier: params.deviceIdentifier,
    };

    formDataCall('api/post/view', data, {}, callBack, 'put');
  },

  update_video_sticker: (params, callBack) => {
    const data = {
      videoId: params.video_id,
      sticker: params.sticker,
    };

    formDataCall('api/video', data, {}, callBack, 'put');
  },
  delete_post: (params, callBack) => {
    formDataCall('api/post', params, {}, callBack, 'delete');
  },
  get_user_profile: (params, callBack) => {
    const data = {
      userId: params.user_id,
    };

    formDataCall('api/profile', data, {}, callBack, 'get');
  },

  get_chat_title: (params, callBack) => {
    formDataCall('api/message/chatTitle', {}, {}, callBack, 'get');
  },

  update_user_like: (params, callBack) => {
    const data = {
      userId: params.user_id,
      otherId: params.other_id,
    };

    formDataCall('api/user/like', data, {}, callBack, 'put');
  },
  get_product_categories: (params, callBack) => {
    const data = {
      userId: params.user_id,
    };
    formDataCall('api/categories', data, {}, callBack, 'get');
  },
  get_teams: (params, callBack) => {
    const data = {
      userId: params.user_id,
    };
    formDataCall('api/team/all', data, {}, callBack, 'get');
  },
  get_team_members: (params, callBack) => {
    const data = {
      userId: params.userId,
      page: params.page,
      amount: params.amount,
    };
    formDataCall(
      `api/team/${params?.teamId}/members`,
      data,
      {},
      callBack,
      'get',
    );
  },
};

export default RestAPI;
