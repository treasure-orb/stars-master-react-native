import { Text, View } from 'react-native';
import { GStyles, Helper } from '../../utils/Global';
import React from 'react';

const Achievements = (props) => {
  const opponentUser = props.opponentUser;
  const lvl = Helper.getLvLGuest(opponentUser?.diamondSpent || 0);

  return (
    <View style={[GStyles.rowEvenlyContainer, { width: '100%' }]}>
      {opponentUser?.userType === 1 ? (
        <>
          <View style={GStyles.centerAlign}>
            <Text style={[GStyles.regularText, GStyles.boldText]}>
              {opponentUser?.elixir || 0}
            </Text>
            <Text style={GStyles.elementLabel}>Elixir</Text>
          </View>
          <View style={GStyles.centerAlign}>
            <Text style={[GStyles.regularText, GStyles.boldText]}>
              {opponentUser?.elixirFlame || 0}
            </Text>
            <Text style={GStyles.elementLabel}>Elixir Fire</Text>
          </View>
          {props.showDiamond && (
            <View style={GStyles.centerAlign}>
              <Text style={[GStyles.regularText, GStyles.boldText]}>
                {opponentUser?.diamond || 0}
              </Text>
              <Text style={GStyles.elementLabel}>Diamond</Text>
            </View>
          )}
          <View style={GStyles.centerAlign}>
            <Text style={[GStyles.regularText, GStyles.boldText]}>
              {opponentUser?.fansCount || 0}
            </Text>
            <Text style={GStyles.elementLabel}>Fans</Text>
          </View>
        </>
      ) : (
        <>
          <View style={GStyles.centerAlign}>
            <Text style={[GStyles.regularText, GStyles.boldText]}>
              {opponentUser?.diamond || 0}
            </Text>
            <Text style={GStyles.elementLabel}>Diamonds</Text>
          </View>
          <View style={GStyles.centerAlign}>
            <Text style={[GStyles.regularText, GStyles.boldText]}>{lvl}</Text>
            <Text style={GStyles.elementLabel}>LvL</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default Achievements;
