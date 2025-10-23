// src/screens/Home.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
  TextInput,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

// Make card width exactly 80% of the screen
const CARD_WIDTH = Math.round(width * 0.8);
// Taller card to match your design (adjustable)
const CARD_HEIGHT = Math.round(CARD_WIDTH * 1.65);

// This is the height we give to the FlatList container so the whole card fits
const H_LIST_HEIGHT = CARD_HEIGHT + 36; // extra padding so top/bottom never get clipped

type Props = { navigation?: any };

type CardItem = {
  id: string;
  location: string;
  title: string;
  excerpt: string;
  author: string;
  time: string;
  colorStart: string;
  colorEnd: string;
};

const sampleData: CardItem[] = [
  {
    id: '1',
    location: 'San Francisco, CA',
    title: 'Wonderful building near London',
    excerpt: 'Big Ben with amazing windows...',
    author: 'Olivia Redman',
    time: '2 minutes ago',
    colorStart: '#11b77a',
    colorEnd: '#1b2452',
  },
  {
    id: '2',
    location: 'New York, NY',
    title: 'Cozy apartment in Brooklyn',
    excerpt: 'Quiet street, lots of sunlight...',
    author: 'Marcus Lane',
    time: '12 minutes ago',
    colorStart: '#1b2452',
    colorEnd: '#263159',
  },
  {
    id: '3',
    location: 'London, UK',
    title: 'Modern office space',
    excerpt: 'Open-plan with a great view...',
    author: 'Sophie Trent',
    time: '30 minutes ago',
    colorStart: '#0d6373',
    colorEnd: '#24304a',
  },
  {
    id: '4',
    location: 'Berlin, DE',
    title: 'Loft with industrial touch',
    excerpt: 'High ceilings and exposed beams...',
    author: 'Liam Wong',
    time: '1 hour ago',
    colorStart: '#9b59ff',
    colorEnd: '#2b2b46',
  },
  {
    id: '5',
    location: 'Tokyo, JP',
    title: 'Minimalist studio',
    excerpt: 'Compact but very well planned...',
    author: 'Aiko Tanaka',
    time: '2 hours ago',
    colorStart: '#11b77a',
    colorEnd: '#0d6373',
  },
];

export default function Home({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'popular' | 'latest' | 'following'>('popular');

  // search
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // card states
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [shared, setShared] = useState<Record<string, boolean>>({});

  // coming soon modal
  const [comingVisible, setComingVisible] = useState(false);
  const [comingTitle, setComingTitle] = useState('Coming Soon!');

  // timers ref to clear on unmount
  const timersRef = useRef<Record<string, number>>({});

  // for small entrance animation of modal
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    return () => {
      // clear timers on unmount
      Object.values(timersRef.current).forEach((t) => {
        try {
          clearTimeout(t);
        } catch {}
      });
      timersRef.current = {};
    };
  }, []);

  // filter data based on search query
  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sampleData;
    return sampleData.filter((it) => {
      return (
        it.title.toLowerCase().includes(q) ||
        it.location.toLowerCase().includes(q) ||
        it.excerpt.toLowerCase().includes(q) ||
        it.author.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const onToggleLike = (id: string) => {
    setLiked((s) => ({ ...s, [id]: !s[id] }));
  };

  const onShareThenThumb = (id: string) => {
    // if already in shared state, ignore presses until it reverts
    if (shared[id]) return;

    // set to shared (thumbs up shown)
    setShared((s) => ({ ...s, [id]: true }));

    // revert after 2.5 seconds
    const t = setTimeout(() => {
      setShared((s) => ({ ...s, [id]: false }));
      delete timersRef.current[id];
    }, 2500) as unknown as number;

    timersRef.current[id] = t;
  };

  const openComing = (title?: string) => {
    setComingTitle(title || 'Coming Soon!');
    setComingVisible(true);
    scaleAnim.setValue(0.85);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 7, tension: 120 }).start();
  };

  const renderCard = ({ item }: { item: CardItem }) => {
    const isLiked = !!liked[item.id];
    const isShared = !!shared[item.id];

    return (
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={[item.colorStart, item.colorEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {/* media placeholder */}
          <View style={styles.mediaPlaceholder}>
            <View style={styles.mediaGray} />
          </View>

          {/* bottom content */}
          <View style={styles.cardBottom}>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color="rgba(255,255,255,0.95)" />
              <Text style={styles.locationText}>{item.location}</Text>
              <TouchableOpacity style={styles.connectPill} activeOpacity={0.85} onPress={() => openComing('Connect coming soon!')}>
                <Text style={styles.connectText}>Connect</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardExcerpt}>{item.excerpt}</Text>

            <View style={styles.authorRow}>
              <View style={styles.authorLeft}>
                <View style={styles.avatarPlaceholder} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.authorName}>{item.author}</Text>
                  <Text style={styles.authorTime}>{item.time}</Text>
                </View>
              </View>

              <View style={styles.stats}>
                <TouchableOpacity onPress={() => onToggleLike(item.id)} style={{ alignItems: 'center' }} activeOpacity={0.8}>
                  <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={18}
                    color={isLiked ? '#ff4d6d' : 'rgba(255,255,255,0.95)'}
                  />
                  <Text style={styles.statsText}>325</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onShareThenThumb(item.id)}
                  style={{ marginTop: 8, alignItems: 'center' }}
                  activeOpacity={0.8}
                >
                  {/* when shared show thumbs up filled, otherwise paper-plane */}
                  {isShared ? (
                    <Ionicons name="thumbs-up" size={18} color="rgba(255,255,255,0.95)" />
                  ) : (
                    <Ionicons name="paper-plane-outline" size={18} color="rgba(255,255,255,0.95)" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  // calculate side inset to center the focused card
  const sideInset = Math.round((width - CARD_WIDTH) / 2);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={() => openComing('Grid coming soon!')}>
            <View style={styles.gridCircle}>
              <Feather name="grid" size={18} color="#11b77a" />
            </View>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Activity</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => setSearchVisible((s) => !s)}
            >
              <Feather name="search" size={18} color="#2b2b46" />
            </TouchableOpacity>

            {/* notification non-clickable */}
            <View style={{ opacity: 1 }}>
              <View style={styles.bellWrap}>
                <Feather name="bell" size={18} color="#2b2b46" />
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>3</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Search bar (inline under header) */}
        {searchVisible && (
          <View style={styles.searchRow}>
            <Feather name="search" size={16} color="#9aa0b5" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by title, location, author..."
              placeholderTextColor="#9aa0b5"
              style={styles.searchInput}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x" size={18} color="#9aa0b5" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('popular')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'popular' ? styles.tabActive : null]}>
              Popular
            </Text>
            <View style={[styles.tabUnderline, activeTab === 'popular' && styles.tabUnderlineActive]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('latest')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'latest' ? styles.tabActive : null]}>
              Latest
            </Text>
            <View style={[styles.tabUnderline, activeTab === 'latest' && styles.tabUnderlineActive]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('following')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'following' ? styles.tabActive : null]}>
              Following
            </Text>
            <View style={[styles.tabUnderline, activeTab === 'following' && styles.tabUnderlineActive]} />
          </TouchableOpacity>
        </View>

        {/* --- IMPORTANT: Wrap FlatList in a container with fixed height --- */}
        <View style={{ height: H_LIST_HEIGHT, marginTop: 8 }}>
          <FlatList
            data={filteredData}
            renderItem={renderCard}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 12}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={[
              styles.flatListContent,
              { paddingHorizontal: sideInset },
            ]}
            // iOS consistent centering
            contentInset={{ left: sideInset, right: sideInset }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />
        </View>

        {/* Bottom navigation */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomIcon} onPress={() => openComing('Home coming soon!')}>
            <Feather name="home" size={20} color="#727c8f" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomIcon} onPress={() => openComing('Users coming soon!')}>
            <Feather name="users" size={20} color="#727c8f" />
          </TouchableOpacity>

          <View style={styles.fabWrap}>
            <TouchableOpacity style={styles.fab} onPress={() => openComing('Create feature coming soon!')}>
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.bottomIcon} onPress={() => openComing('Discover coming soon!')}>
            <Feather name="search" size={20} color="#727c8f" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomIcon} onPress={() => openComing('Profile coming soon!')}>
            <Feather name="user" size={20} color="#727c8f" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Coming soon modal */}
      <Modal visible={comingVisible} transparent animationType="none" onRequestClose={() => setComingVisible(false)}>
        <View style={styles.modalBackdrop}>
          <Animated.View style={[styles.modalCard, { transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient colors={['#11b77a', '#0d6373']} style={styles.modalIconWrap}>
              <Ionicons name="sparkles" size={36} color="#fff" />
            </LinearGradient>
            <Text style={styles.modalTitle}>{comingTitle}</Text>
            <Text style={styles.modalSub}>We're cooking something delightful ✨</Text>

            <Pressable
              onPress={() => setComingVisible(false)}
              style={({ pressed }) => [styles.modalButton, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  // bigger bottom padding so content isn't hidden under absolute bottom bar
  screen: { flex: 1, backgroundColor: '#ffffff', paddingBottom: 140 },

  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { width: 44 },
  gridCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e6f0ee',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // subtle drop shadow
    shadowColor: '#11b77a',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b2452',
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', width: 84, justifyContent: 'flex-end' },
  bellWrap: { position: 'relative' },
  bellBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#11b77a',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  // search styles
  searchRow: {
    marginHorizontal: 18,
    marginTop: 6,
    marginBottom: 2,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    height: '100%',
    color: '#333',
  },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 6,
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'flex-start',
    // keep left padding so items align with other content
    paddingLeft: 2,
  },
  tabText: {
    marginRight: 18,
    fontSize: 16,
    color: '#b7bccb',
  },
  tabActive: { color: '#1b2452', fontWeight: '700' },

  // small rounded underline under active tab (matches image)
  tabUnderline: {
    marginTop: 6,
    width: 36,
    height: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  tabUnderlineActive: {
    backgroundColor: '#11b77a',
    // slightly elevate so it looks like a pill under active text
    shadowColor: '#11b77a',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },

  flatListContent: {
    // vertically center the cards inside the list container
    alignItems: 'center',
    paddingVertical: 6,
  },

  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 8, // ensure spacing so top & bottom never touch edges
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 16,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 6,
  },
  mediaPlaceholder: {
    height: CARD_HEIGHT * 0.60, // large media area
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 14,
  },
  mediaGray: {
    flex: 1,
    backgroundColor: '#cfcfcf',
    borderRadius: 10,
    margin: 12,
  },

  cardBottom: { flex: 1, justifyContent: 'space-between', paddingBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: {
    color: 'rgba(255,255,255,0.95)',
    marginLeft: 6,
    fontSize: 12,
  },
  connectPill: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  connectText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    color: '#fff',
    marginTop: 8,
    fontSize: 18,
    fontWeight: '800',
  },
  cardExcerpt: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    fontSize: 14,
  },
  authorRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e9eef0',
    marginLeft: 2,
  },
  authorName: { color: '#fff', fontWeight: '700', fontSize: 14 },
  authorTime: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  stats: { alignItems: 'center' },
  statsText: { color: 'rgba(255,255,255,0.95)', fontSize: 12, marginTop: 4 },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  bottomIcon: { flex: 1, alignItems: 'center' },
  fabWrap: {
    position: 'absolute',
    left: (width / 2) - 36,
    top: -40,
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#11b77a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#11b77a',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#fff',
  },

  /* modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(20,20,20,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -48,
    marginBottom: 8,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1b2452',
    marginTop: 8,
  },
  modalSub: {
    marginTop: 6,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 14,
    backgroundColor: '#11b77a',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
