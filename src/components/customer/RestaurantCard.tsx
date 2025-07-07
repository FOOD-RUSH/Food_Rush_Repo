import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface RestaurantCardProps {
  deliveryFee: number;
  restaurantName: string;
  distanceFromUser: number;
  estimatedTime: any;
  rating: number;
  image: any;
  restaurantID: string;
  onClick: () => void;
}

const RestaurantCard = ({
  deliveryFee,
  restaurantID,
  restaurantName,
  distanceFromUser,
  estimatedTime,
  rating,
  image,
  onClick,
}: RestaurantCardProps) => {
  return (
    <Card
      mode="outlined"
      style={{
        margin: 10,
        borderRadius: 16,
        overflow: 'hidden',
        borderColor: '#e0e0e0',
        elevation: 2,
      }}
    >
      <View style={{ position: 'relative' }}>
        <Card.Cover
          source={require('../assets/images/adaptive-icon.png')}
          style={{
            height: 150,
            width: '100%',
          }}
        />

        {/* Heart Icon */}
        <TouchableOpacity
          onPress={() => {}}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 8,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="heart-outline" size={20} color="#333" />
        </TouchableOpacity>

        {/* Promotional Badges */}
       

        {/* Bottom badges */}
        <View
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            flexDirection: 'row',
            gap: 8,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 6,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#333' }}>
              2ES
            </Text>
          </View>
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons name="star" size={12} color="yellow" />
            <Text style={{ fontSize: 12, color: 'white', marginLeft: 4 }}>
              {rating}
            </Text>
          </View>
        </View>
      </View>

      <Card.Content style={{ padding: 16 }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
            Diallo&lsquo;s Kitchen
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <Ionicons name="location" size={14} color="#007aff" />
              <Text style={{ fontSize: 14, color: '#007aff', marginLeft: 4 }}>
                190m
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: '#666' }}>
              500FCFA Delivery Fee
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 14, color: '#333', fontWeight: '500' }}>
              30 - 45 min
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};




//  <View
//           style={{
//             position: 'absolute',
//             top: 12,
//             left: 12,
//             flexDirection: 'row',
//             gap: 8,
//           }}
//         >
//           <View
//             style={{
//               backgroundColor: '#ff4444',
//               borderRadius: 12,
//               paddingHorizontal: 8,
//               paddingVertical: 4,
//             }}
//           >
//             <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
//               -24
//             </Text>
//           </View>
//           <View
//             style={{
//               backgroundColor: '#ff4444',
//               borderRadius: 12,
//               paddingHorizontal: 8,
//               paddingVertical: 4,
//             }}
//           >
//             <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
//               24
//             </Text>
//           </View>
//         </View>