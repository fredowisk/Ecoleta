import styled from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';


interface ItemContainerProps {
  selected: boolean;
}

export const Container = styled.View`
  flex: 1;
  padding-left: 32px;
  padding-right: 32px;
  padding-top: ${getStatusBarHeight() + 20}px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-family: 'Ubuntu-Bold';
  margin-top: 24px;
`;

export const Description = styled.Text`
  color: #6c6c80;
  font-size: 16px;
  margin-top: 4px;
  font-family: 'Roboto-Regular';
`;

export const MapContainer = styled.View`
  flex: 1;
  width: 100%;
  border-radius: 10px;
  margin-top: 16px;
`;

export const MapMarkerContainer = styled.View`
  width: 90px;
  height: 70px;
  background-color: #34cb79;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  align-items: center;
`;

export const MapMarkerTitle = styled.Text`
  flex: 1;
  font-family: 'Roboto-Regular';
  color: #fff;
  font-size: 13px;
  line-height: 23px;
`;

export const ItemsContent = styled.ScrollView.attrs({
  contentContainerStyle: { paddingHorizontal: 24 },
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})``;

export const ItemsContainer = styled.View`
  flex-direction: row;
  margin-top: 16px;
  margin-bottom: 32px;
`;

export const Item = styled.TouchableOpacity<ItemContainerProps>`
  border-color: ${props => (props.selected ? '#34cb79' : '#eee')};
  background-color: #fff;
  border-width: 2px;
  height: 100px;
  width: 100px;
  border-radius: 8px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 20px;
  padding-bottom: 16px;
  margin-right: 8px;
  align-items: center;
  justify-content: space-between;

  text-align: center;
`;

export const ItemTitle = styled.Text`
  font-family: 'Roboto-Regular';
  text-align: center;
  font-size: 13px;
`;
