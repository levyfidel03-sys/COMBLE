import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import { useSettings } from '../context/SettingsContext';

const { width } = Dimensions.get('window');

const tabs = ['Parts', 'History', 'Fun Facts', 'Video'];
const OFFLINE_VIDEO_PATH = 'file:///data/user/0/com.combleapp/files/videos/';
const offlineVideos = [
  {
    title: 'Assembly',
    uri: `${OFFLINE_VIDEO_PATH}Assembly.mp4`,
  },
  {
    title: 'Disassembly',
    uri: `${OFFLINE_VIDEO_PATH}Disassembly.mp4`,
  },
];

const partImages: Record<string, number> = {
  CPU: require('../assets/images/cpu.png'),
  RAM: require('../assets/images/ram.png'),
  GPU: require('../assets/images/gpu.png'),
  Motherboard: require('../assets/images/motherboard.png'),
  PSU: require('../assets/images/psu.png'),
  SSD: require('../assets/images/ssd.png'),
  Monitor: require('../assets/images/monitor.jpg'),
  Keyboard: require('../assets/images/keyboard.png'),
  Mouse: require('../assets/images/mouse.png'),
  ROM: require('../assets/images/rom.png'),
};

const parts = [
  {
    name: 'CPU',
    full: 'Central Processing Unit',
    color: '#F5A623',
    icon: '🔲',
    description:
      'The brain of the computer. It processes all instructions from software and hardware. Speed is measured in GHz. Modern CPUs have multiple cores (4, 8, 16+) allowing them to run many tasks simultaneously.',
    facts: ['Intel and AMD are the two main CPU makers', 'A modern CPU can perform billions of calculations per second'],
  },
  {
    name: 'RAM',
    full: 'Random Access Memory',
    color: '#4A9EFF',
    icon: '📊',
    description:
      'Temporary memory that stores data currently being used by the CPU. It is much faster than storage drives but loses all data when the power is off. More RAM allows more programs to run at once.',
    facts: ['Common sizes: 8GB, 16GB, 32GB', 'RAM speed is measured in MHz (e.g. DDR4-3200)'],
  },
  {
    name: 'GPU',
    full: 'Graphics Processing Unit',
    color: '#7B52E8',
    icon: '🎮',
    description:
      'Handles all graphics rendering for your display. Has its own memory called VRAM. Essential for gaming, video editing, and 3D work. Connects to the monitor via HDMI or DisplayPort.',
    facts: ['NVIDIA and AMD make the most popular GPUs', 'Also used for AI and machine learning tasks'],
  },
  {
    name: 'Motherboard',
    full: 'Main Circuit Board',
    color: '#4CAF50',
    icon: '🖥️',
    description:
      'The main circuit board that connects all components together. Contains the CPU socket, RAM slots, PCIe slots, and connectors for storage and peripherals. Determines what CPU and RAM generations are compatible.',
    facts: ['Form factors include ATX, Micro-ATX, and Mini-ITX', 'Contains the BIOS chip for startup instructions'],
  },
  {
    name: 'PSU',
    full: 'Power Supply Unit',
    color: '#F44336',
    icon: '⚡',
    description:
      'Converts AC electricity from the wall outlet into DC power for all components. Rated in watts — a weak PSU can cause random shutdowns. Modular PSUs allow unused cables to be removed.',
    facts: ['Common wattages: 500W, 650W, 850W', 'Efficiency ratings: 80+ Bronze, Silver, Gold, Platinum'],
  },
  {
    name: 'SSD',
    full: 'Solid State Drive',
    color: '#00BCD4',
    icon: '💾',
    description:
      'Permanently stores your operating system, files, and programs. Much faster than old hard disk drives (HDD) because it has no moving parts. M.2 SSDs plug directly into the motherboard.',
    facts: ['NVMe SSDs are much faster than SATA SSDs', 'Can reach read speeds of 7,000 MB/s on PCIe 4.0'],
  },
  {
    name: 'Monitor',
    full: 'Display Screen',
    color: '#FF9800',
    icon: '🖵',
    description:
      'The output device that displays visual information from the GPU. Key specs include resolution (1080p, 1440p, 4K), refresh rate (60Hz, 144Hz, 240Hz), and panel type (IPS, TN, OLED).',
    facts: ['Higher refresh rate = smoother motion', 'IPS panels have better color accuracy than TN panels'],
  },
  {
    name: 'Keyboard',
    full: 'Input Device',
    color: '#9C27B0',
    icon: '⌨️',
    description:
      'Primary input device for typing text and commands. Mechanical keyboards use individual switches per key for better tactile feedback. Connected via USB or wirelessly via Bluetooth.',
    facts: ['Mechanical switches: Linear, Tactile, Clicky', 'The QWERTY layout was designed in the 1870s'],
  },
  {
    name: 'Mouse',
    full: 'Pointing Device',
    color: '#E91E63',
    icon: '🖱️',
    description:
      'Input device for moving the cursor and selecting items on screen. Gaming mice have higher DPI (dots per inch) for more precise tracking. Optical and laser sensors are most common.',
    facts: ['DPI range: 400 to 25,600+ for gaming mice', 'First mouse was invented by Douglas Engelbart in 1964'],
  },
  {
    name: 'ROM',
    full: 'Read Only Memory',
    color: '#795548',
    icon: '📀',
    description:
      'Permanently stores the BIOS/UEFI firmware that starts your computer. Unlike RAM, it retains data without power. Cannot be easily modified. Located as a chip on the motherboard.',
    facts: ['BIOS stands for Basic Input Output System', 'Modern systems use UEFI instead of legacy BIOS'],
  },
];

const history: {
  year: string;
  title: string;
  description: string;
  color: string;
  image?: number;
}[] = [
  {
    year: '1822',
    title: 'First Mechanical Computer',
    description: 'Charles Babbage designed the Difference Engine, a mechanical calculator considered the first concept of a computer.',
    color: '#F5A623',
    image: require('../assets/images/fmc.jpg'),
  },
  {
    year: '1936',
    title: 'Turing Machine',
    description: 'Alan Turing proposed the theoretical Turing Machine, laying the foundation for modern computer science and computation.',
    color: '#4A9EFF',
    image: require('../assets/images/turing.jpg'),
  },
  {
    year: '1945',
    title: 'ENIAC — First Electronic Computer',
    description: 'ENIAC (Electronic Numerical Integrator and Computer) was built at the University of Pennsylvania. It weighed 30 tons and occupied 1,800 square feet.',
    color: '#4CAF50',
    image: require('../assets/images/eniac.jpg'),
  },
  {
    year: '1958',
    title: 'Integrated Circuit Invented',
    description: 'Jack Kilby invented the integrated circuit (microchip), revolutionizing electronics by fitting many transistors on a single chip.',
    color: '#7B52E8',
    image: require('../assets/images/ICI.jpg'),
  },
  {
    year: '1971',
    title: 'First Microprocessor',
    description: 'Intel released the Intel 4004, the first commercially available microprocessor. It had 2,300 transistors and ran at 740 kHz.',
    color: '#F44336',
    image: require('../assets/images/first micro.jpg'),
  },
  {
    year: '1981',
    title: 'IBM Personal Computer',
    description: 'IBM launched the IBM PC, setting the standard for personal computers. It used an Intel 8088 processor and ran MS-DOS.',
    color: '#00BCD4',
    image: require('../assets/images/IBM.jpg'),
  },
  {
    year: '1984',
    title: 'Apple Macintosh',
    description: 'Apple launched the Macintosh, the first mass-market personal computer to feature a graphical user interface (GUI) and mouse.',
    color: '#FF9800',
    image: require('../assets/images/apple.jpg'),
  },
  {
    year: '1991',
    title: 'World Wide Web',
    description: 'Tim Berners-Lee launched the World Wide Web, transforming computers from isolated machines into a globally connected network.',
    color: '#9C27B0',
    image: require('../assets/images/www.jpg'),
  },
  {
    year: '2007',
    title: 'Smartphone Era Begins',
    description: 'Apple released the first iPhone, merging a computer, phone, and internet device into one pocket-sized device, changing computing forever.',
    color: '#E91E63',
    image: require('../assets/images/smartphone.jpg'),
  },
  {
    year: '2020s',
    title: 'AI and Quantum Computing',
    description: 'Artificial intelligence and quantum computing are pushing the boundaries of what computers can do, solving problems impossible for classical computers.',
    color: '#4CAF50',
    image: require('../assets/images/ai.jpg'),
  },
];

const funFacts = [
  { icon: '🖥️', fact: 'The first computer bug was an actual bug — a moth found inside a Harvard Mark II computer in 1947.' },
  { icon: '💾', fact: 'The first hard disk drive in 1956 weighed over a ton and stored only 5 MB of data.' },
  { icon: '🔲', fact: 'A modern smartphone has more computing power than all of NASA had when they sent astronauts to the moon in 1969.' },
  { icon: '🌐', fact: 'Over 90% of the world\'s data was created in the last two years alone.' },
  { icon: '⚡', fact: 'If cars had developed as fast as computers, a car today would cost $0.00001 and travel at the speed of light.' },
  { icon: '🎮', fact: 'The video game industry generates more revenue than the movie and music industries combined.' },
  { icon: '📊', fact: 'The average person blinks 15-20 times per minute but only 7 times per minute while using a computer.' },
  { icon: '🔒', fact: 'About 30,000 websites are hacked every day around the world.' },
  { icon: '📱', fact: 'There are more computers in the world than there are people.' },
  { icon: '🤖', fact: 'The word "computer" originally referred to a human whose job was to perform calculations manually.' },
];

export default function InformationScreen({ navigation }: any) {
  const { theme, isDarkMode } = useSettings();
  const [activeTab, setActiveTab] = useState(0);
  const [expandedPart, setExpandedPart] = useState<number | null>(null);
  const [videoErrors, setVideoErrors] = useState<Record<string, boolean>>({});
  const [selectedVideo, setSelectedVideo] = useState(offlineVideos[0].title);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}> 
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.headerBorder }] }>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtn, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>INFORMATION</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => setActiveTab(i)}>
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* PARTS TAB */}
        {activeTab === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Computer Parts</Text>
            <Text style={styles.sectionSub}>Tap any part to learn more</Text>
            {parts.map((part, i) => (
              <TouchableOpacity
                key={i}
                style={styles.partCard}
                onPress={() => setExpandedPart(expandedPart === i ? null : i)}
                activeOpacity={0.8}>
                <View style={styles.partHeader}>
                  <View style={[styles.partIconBox, { backgroundColor: part.color + '22' }]}>
                    {partImages[part.name] ? (
                      <Image source={partImages[part.name]} style={styles.partImage} resizeMode="contain" />
                    ) : (
                      <Text style={styles.partIconText}>{part.icon}</Text>
                    )}
                  </View>
                  <View style={styles.partInfo}>
                    <Text style={styles.partName}>{part.name}</Text>
                    <Text style={styles.partFull}>{part.full}</Text>
                  </View>
                  <Text style={[styles.partArrow, { color: part.color }]}>
                    {expandedPart === i ? '▲' : '▼'}
                  </Text>
                </View>
                {expandedPart === i && (
                  <View style={styles.partExpanded}>
                    <View style={[styles.partDivider, { backgroundColor: part.color }]} />
                    <Text style={styles.partDesc}>{part.description}</Text>
                    <View style={styles.factsBox}>
                      {part.facts.map((fact, j) => (
                        <View key={j} style={styles.factRow}>
                          <Text style={[styles.factDot, { color: part.color }]}>•</Text>
                          <Text style={styles.factText}>{fact}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* HISTORY TAB */}
        {activeTab === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Computer History</Text>
            <Text style={styles.sectionSub}>From 1822 to today</Text>
            {history.map((item, i) => (
              <View key={i} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: item.color }]} />
                  {i < history.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <View style={[styles.yearBadge, { backgroundColor: item.color + '22' }]}>
                    <Text style={[styles.yearText, { color: item.color }]}>{item.year}</Text>
                  </View>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineDesc}>{item.description}</Text>
                  {item.image && (
                    <Image
                      source={item.image}
                      style={styles.timelineImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* FUN FACTS TAB */}
        {activeTab === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Did You Know?</Text>
            <Text style={styles.sectionSub}>Interesting facts about computers</Text>
            {funFacts.map((item, i) => (
              <View key={i} style={styles.factCard}>
                <Text style={styles.factCardIcon}>{item.icon}</Text>
                <Text style={styles.factCardText}>{item.fact}</Text>
              </View>
            ))}
          </View>
        )}

        {/* OFFLINE VIDEO TAB */}
        {activeTab === 3 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Computer Videos</Text>
            <Text style={styles.sectionSub}>Stored locally for offline playback</Text>
            <View style={styles.videoPicker}>
              {offlineVideos.map(video => (
                <TouchableOpacity
                  key={video.title}
                  style={[styles.videoPickerButton, selectedVideo === video.title && styles.videoPickerButtonActive]}
                  onPress={() => {
                    setVideoErrors(errors => ({ ...errors, [video.title]: false }));
                    setSelectedVideo(video.title);
                  }}>
                  <Text style={[styles.videoPickerText, selectedVideo === video.title && styles.videoPickerTextActive]}>
                    {video.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {offlineVideos.filter(video => video.title === selectedVideo).map(video => (
              <View key={video.title} style={styles.videoCard}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <View style={styles.videoFrame}>
                  {videoErrors[video.title] ? (
                    <View style={styles.videoMessage}>
                      <Text style={styles.videoMessageTitle}>Video unavailable</Text>
                      <Text style={styles.videoMessageText}>
                        Unable to play {video.title}.mp4 on this device.
                      </Text>
                    </View>
                  ) : (
                    <Video
                      source={{ uri: video.uri }}
                      style={styles.video}
                      controls
                      resizeMode="contain"
                      paused={activeTab !== 3}
                      onError={() => setVideoErrors(errors => ({ ...errors, [video.title]: true }))}
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
  },
  backBtn: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 3,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#162040',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
    padding: 4,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#7B52E8',
  },
  tabText: {
    color: '#8B9EC3',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: 1,
  },
  sectionSub: {
    color: '#8B9EC3',
    fontSize: 12,
    marginBottom: 16,
    letterSpacing: 1,
  },
  partCard: {
    backgroundColor: '#162040',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  partHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  partIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partIconText: {
    fontSize: 22,
  },
  partImage: {
    width: 34,
    height: 34,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  partFull: {
    color: '#8B9EC3',
    fontSize: 11,
    marginTop: 2,
  },
  partArrow: {
    fontSize: 12,
    fontWeight: '700',
  },
  partExpanded: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  partDivider: {
    height: 2,
    borderRadius: 1,
    marginBottom: 10,
    width: 40,
  },
  partDesc: {
    color: '#C8D8F0',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  factsBox: {
    backgroundColor: '#0A1628',
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  factRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  factDot: {
    fontSize: 14,
    lineHeight: 20,
  },
  factText: {
    color: '#8B9EC3',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 4,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#1E3A5F',
    marginTop: 4,
    marginBottom: -4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  yearBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 6,
  },
  yearText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  timelineTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  timelineDesc: {
    color: '#8B9EC3',
    fontSize: 12,
    lineHeight: 18,
  },
  timelineImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginTop: 10,
  },
  factCard: {
    backgroundColor: '#162040',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  factCardIcon: {
    fontSize: 28,
  },
  factCardText: {
    color: '#C8D8F0',
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  videoCard: {
    marginBottom: 16,
  },
  videoPicker: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  videoPickerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    backgroundColor: '#162040',
  },
  videoPickerButtonActive: {
    backgroundColor: '#7B52E8',
    borderColor: '#7B52E8',
  },
  videoPickerText: {
    color: '#8B9EC3',
    fontSize: 12,
    fontWeight: '700',
  },
  videoPickerTextActive: {
    color: '#FFFFFF',
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  videoFrame: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#050B16',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  videoMessageTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  videoMessageText: {
    color: '#8B9EC3',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});