import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Helper } from '../../utils/Global';
import { View } from 'react-native';

const WINDOW_WIDTH = Helper.getWindowWidth();
const CONTAINER_PADDING = 16;
const ITEMS_MARGIN = 12;

const PlaceHolder = (props) => {
  const rows = 2;
  const columns = 3;
  const itemSize =
    (WINDOW_WIDTH - 2 * CONTAINER_PADDING - (columns - 1) * ITEMS_MARGIN) /
    columns;
  const itemSizeWithMargin = itemSize + ITEMS_MARGIN;
  const containerWidth = WINDOW_WIDTH - 2 * CONTAINER_PADDING;
  const containerHeight = itemSizeWithMargin * 2;

  const initial = 32;
  const covers = Array(columns * rows).fill(1);

  return (
    <View
      style={{
        paddingHorizontal: 16,
      }}
    >
      <ContentLoader
        speed={1}
        width={containerWidth}
        height={containerHeight + initial}
        primaryColor="#242b34"
        secondaryColor="#343d4c"
        {...props}
      >
        <Rect x={0} y="0" rx="0" ry="0" width={containerWidth} height="20" />

        {covers.map((g, i) => {
          let vy = Math.floor(i / columns) * itemSizeWithMargin + initial;
          let vx = (i * itemSizeWithMargin) % (columns * itemSizeWithMargin);
          return (
            <Rect
              key={i}
              x={vx}
              y={vy}
              rx="0"
              ry="0"
              width={itemSize}
              height={itemSize}
            />
          );
        })}
      </ContentLoader>
    </View>
  );
};

export default PlaceHolder;
