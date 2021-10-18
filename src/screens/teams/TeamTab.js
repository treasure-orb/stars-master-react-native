import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Constants, Helper, RestAPI } from '../../utils/Global';
import { GStyles } from '../../utils/Global/Styles';
import TopUserItem from '../../components/elements/TopUserItem';

const HomeVideoScreen = ({ team }) => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [curPage, setCurPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [onEndReachedDuringMomentum, setOnEndReachedDuringMomentum] = useState(
    true,
  );

  useEffect(() => {
    onRefresh('init');
  }, []);

  const onRefresh = (type) => {
    if (isFetching) {
      return;
    }

    const newPage = type === 'more' ? curPage + 1 : 1;
    setCurPage(newPage);
    if (type === 'more') {
      const maxPage =
        (totalCount + Constants.COUNT_PER_PAGE - 1) / Constants.COUNT_PER_PAGE;
      if (newPage > maxPage) {
        return;
      }
    }
    setCurPage(newPage);

    if (type === 'init') {
      //global.showForcePageLoader(true);
      setIsFetching(true);
    } else {
      setIsFetching(true);
    }
    let params = {
      userId: global.me ? global.me?.id : '',
      page: type === 'more' ? newPage : '1',
      amount: Constants.COUNT_PER_PAGE,
      teamId: team?.id,
    };
    RestAPI.get_team_members(params, (json, err) => {
      global.showForcePageLoader(false);
      setIsFetching(false);

      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else {
        if (json.status === 200) {
          setTotalCount(json.data.totalCount || 0);
          const list = json.data.userList || [];

          if (type === 'more') {
            let data = users.concat(list);
            setUsers(data);
          } else {
            setUsers(list);
          }
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  const onPressUser = (item) => {
    if (global.me) {
      if (item.id === global.me?.id) {
        navigation.navigate('profile');
      } else {
        global._opponentUser = item;
        global._prevScreen = 'home_users';
        navigation.navigate('profile_other');
      }
    } else {
      navigation.navigate('signin');
    }
  };
  const _renderUserList = () => {
    return (
      <>
        {users?.length ? (
          <FlatList
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
            onRefresh={() => onRefresh('pull')}
            refreshing={isFetching}
            ListFooterComponent={_renderFooter}
            onEndReachedThreshold={0.4}
            onMomentumScrollBegin={() => {
              console.log('scrolling...');
              setOnEndReachedDuringMomentum(false);
            }}
            onEndReached={() => {
              console.log('ended');
              if (!onEndReachedDuringMomentum) {
                setOnEndReachedDuringMomentum(true);
                onRefresh('more');
              }
            }}
            data={users}
            renderItem={_renderItem}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View style={{ flex: 1, ...GStyles.centerAlign }}>
            <Text style={GStyles.notifyDescription}>
              {isFetching ? '' : 'Not found.'}
            </Text>
          </View>
        )}
      </>
    );
  };

  const _renderFooter = () => {
    if (!isFetching) {
      return null;
    }
    return <ActivityIndicator style={{ color: '#000' }} />;
  };

  const _renderItem = ({ item, index }) => {
    return (
      <TopUserItem
        index={index}
        item={item}
        onPress={onPressUser}
        sortBy={'elixir'}
      />
    );
  };

  const _renderDescription = () => {
    return (
      <View style={{ padding: 16 }}>
        <Text style={GStyles.titleDescription}>{team?.description}</Text>
      </View>
    );
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {team?.description ? _renderDescription() : null}
        {_renderUserList()}
      </View>
    </>
  );
};

export default HomeVideoScreen;
