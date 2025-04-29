import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { styles } from './dashboard.styles';

const dummyVideos = [
  { id: '1', title: 'Driver Recording 1' },
  { id: '2', title: 'Driver Recording 2' },
  { id: '3', title: 'Driver Recording 3' },
  { id: '4', title: 'Driver Recording 4' },
];

const DashboardScreen = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const renderVideoItem = ({ item }: { item: { id: string; title: string } }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => setSelectedVideo(item.title)}
    >
      <Text style={styles.videoText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Videos</Text>

      {selectedVideo ? (
        <>
          <View style={styles.videoPlayer}>
            <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', marginTop: 100 }}>
              Playing {selectedVideo}
            </Text>
          </View>

          <TouchableOpacity onPress={() => setSelectedVideo(null)} style={styles.backButton}>
            <Text style={styles.backText}>Back to list</Text>
          </TouchableOpacity>
        </>
      ) : (
        <FlatList
          data={dummyVideos}
          keyExtractor={(item) => item.id}
          renderItem={renderVideoItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default DashboardScreen;
