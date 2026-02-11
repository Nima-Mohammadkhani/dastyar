import { DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Text } from 'react-native';

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <Text style={{ fontSize: 18, margin: 16 }}>Chats</Text>
      
      <Text style={{ fontSize: 18, margin: 16 }}>Other</Text>
    </DrawerContentScrollView>
  );
}
