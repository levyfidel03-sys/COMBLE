import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, StatusBar, Image,
  TouchableOpacity, ScrollView, Animated, Dimensions,
} from 'react-native';
import { useSettings } from '../context/SettingsContext';

const TOTAL_TIME  = 180;
const TOTAL_PARTS = 11;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Part = {
  id: string;
  label: string;
  image: any;
  clue: string;
};

const PARTS: Part[] = [
  { id: 'cpu',         label: 'CPU',         image: require('../assets/images/cpu.png'), clue: 'This part acts as the brain of the PC and fits into the motherboard socket.' },
  { id: 'ram',         label: 'RAM',         image: require('../assets/images/ram.png'), clue: 'This memory stores data temporarily while the computer is running.' },
  { id: 'gpu',         label: 'GPU',         image: require('../assets/images/gpu.png'), clue: 'This card renders graphics and usually installs in a PCIe x16 slot.' },
  { id: 'motherboard', label: 'Motherboard', image: require('../assets/images/motherboard.png'), clue: 'This is the main circuit board that connects every part together.' },
  { id: 'psu',         label: 'PSU',         image: require('../assets/images/psu.png'), clue: 'This unit supplies power to every component in the system.' },
  { id: 'ssd',         label: 'SSD',         image: require('../assets/images/ssd.png'), clue: 'This storage drive stores files permanently and is faster than a hard disk drive.' },
  { id: 'fan',         label: 'Case Fan',    image: require('../assets/images/fan.png'), clue: 'This part moves air through the case to keep components cool.' },
  { id: 'audio',       label: 'Audio Port',  image: require('../assets/images/audio_port.png'), clue: 'This port handles sound input/output on the motherboard’s I/O panel.' },
  { id: 'usb',         label: 'USB Port',    image: require('../assets/images/usb_port.png'), clue: 'This port connects keyboards, mice, and other USB devices.' },
  { id: 'vga',         label: 'VGA/HDMI',    image: require('../assets/images/vga_port.png'), clue: 'This port sends video signals from the PC to a monitor.' },
  { id: 'bios',        label: 'BIOS Chip',   image: require('../assets/images/bios.png'), clue: 'This chip stores the firmware that initializes the hardware at boot.' },
];


export default function HardModeScreen({ navigation }: any) {
  const { theme, isDarkMode } = useSettings();
  const [gameOrder, setGameOrder] = useState<string[]>(() => shuffle(PARTS).map(part => part.id));
  const [currentTarget, setCurrentTarget] = useState<string>(gameOrder[0]);
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [placed,    setPlaced]    = useState<string[]>([]);
  const [trayParts, setTrayParts] = useState<Part[]>(() => shuffle(PARTS));
  const [score,     setScore]     = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(TOTAL_TIME);
  const [gameOver,  setGameOver]  = useState(false);
  const [feedback,  setFeedback]  = useState<{msg:string;ok:boolean}|null>(null);
  const [wrongZone, setWrongZone] = useState<string|null>(null);

  const scoreRef    = useRef(0);
  const gameOverRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const blinkAnim      = useRef(new Animated.Value(1)).current;
  const checkScale     = useRef(new Animated.Value(0)).current;
  const clueAnim       = useRef(new Animated.Value(0)).current;
  const trayScrollRef  = useRef<ScrollView>(null);
  const trayOffsetRef  = useRef(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(intervalRef.current!); triggerEnd(scoreRef.current, false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTrayParts(shuffle(PARTS));
  }, []);

  useEffect(() => {
    clueAnim.setValue(0);
    Animated.timing(clueAnim, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }, [currentTarget, clueAnim]);

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(blinkAnim, { toValue: 0.15, duration: 600, useNativeDriver: true }),
      Animated.timing(blinkAnim, { toValue: 1,    duration: 600, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [blinkAnim]);

  const triggerEnd = (finalScore: number, complete: boolean) => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    setGameOver(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    showFeedback(complete ? 'Assembly Complete! 🎉' : "Time's Up!", complete);
    setTimeout(() => navigation.navigate('Result', { score: finalScore, total: TOTAL_PARTS, mode: 'hard' }), 1600);
  };

  const showFeedback = (msg: string, ok: boolean) => {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 1000);
  };

  const fmt = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  const handleZoneTap = (zoneId: string) => {
    if (gameOver || !selectedPart || placed.includes(zoneId)) return;
    if (selectedPart === currentTarget && currentTarget === zoneId) {
      const ns = score + 1;
      scoreRef.current = ns;
      setScore(ns);
      const np = [...placed, zoneId];
      setPlaced(np);
      showFeedback('Correct! +1', true);
      checkScale.setValue(0);
      Animated.spring(checkScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
      const currentIndex = gameOrder.indexOf(currentTarget);
      const next = gameOrder[currentIndex + 1];
      setCurrentTarget(next ?? '');
      setSelectedPart('');
      setTrayParts(shuffle(PARTS));
      if (np.length === TOTAL_PARTS) setTimeout(() => triggerEnd(ns, true), 800);
    } else {
      setWrongZone(zoneId);
      showFeedback('Wrong part or slot! Try again', false);
      setTimeout(() => setWrongZone(null), 600);
    }
  };

  const zoneStyle = (id: string) => {
    if (placed.includes(id)) return s.slotDone;
    if (wrongZone === id)    return s.slotWrong;
    return {};
  };

  const slotContent = (id: string, imgSrc: any, small?: boolean) => (
    <>
      {currentTarget === id && !placed.includes(id) && (
        <Animated.View style={[s.blinkBorder,{opacity:blinkAnim}]}/>
      )}
      {placed.includes(id) && <Image source={imgSrc} style={s.fillImg} resizeMode="contain"/>}
      {placed.includes(id) && <Text style={small ? s.ckxs : s.ck}>✓</Text>}
    </>
  );

  const currentPart = PARTS.find(p => p.id === currentTarget);
  const placedCount  = placed.length;

  return (
    <View style={[s.root, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      {/* ─ HEADER ─ */}
      <View style={[s.header, { backgroundColor: theme.card, borderBottomColor: theme.border }] }>
        <Text style={[s.hTitle, { color: theme.text }]}>HARD MODE</Text>
        <View style={s.hRight}>
          <View style={[s.timerBox, { backgroundColor: theme.bg }] }>
            <Text style={[s.timerTxt, timeLeft < 30 && s.timerRed, { color: theme.text }]}>{fmt(timeLeft)}</Text>
          </View>
          <Text style={[s.scoreTxt, { color: theme.text }]}>{score}/{TOTAL_PARTS}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[s.pauseIco, { color: theme.text }]}>⏸</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─ STEP INDICATOR ─ */}
      <View style={[s.stepBar, { backgroundColor: theme.card, borderBottomColor: theme.border }] }>
        <View style={s.stepLeft}>
          <Text style={[s.stepLbl, { color: theme.textSub }]}>PLACE:  </Text>
          <Text style={[s.stepPart, { color: theme.text }]}>{currentPart?.label ?? '—'}</Text>
          <Text style={[s.stepCount, { color: theme.textSub }]}>  {placedCount}/{TOTAL_PARTS}</Text>
        </View>
      </View>

      {/* ─ CLUE ─ */}
      <Animated.View style={[s.clueCard, { backgroundColor: theme.card, borderColor: theme.border, opacity: clueAnim, transform:[{ translateY: clueAnim.interpolate({ inputRange:[0,1], outputRange:[12,0] }) }] }] }>
        <Text style={[s.clueLabel, { color: theme.textSub }]}>Clue</Text>
        <Text style={[s.clueText, { color: theme.text }]}>{currentPart?.clue}</Text>
      </Animated.View>
      <View style={s.dotsRow}>
        {PARTS.map((p, i) => (
          <View key={p.id} style={[
            s.dot,
            placed.includes(p.id) ? s.dotDone : i === placed.length ? s.dotActive : s.dotGray,
          ]} />
        ))}
      </View>

      {/* ─ PC CASE ─ */}
      <View style={[s.caseFrame, { backgroundColor: theme.card, borderColor: theme.border }]}>

        {/* ─ Top fan rail ─ */}
        <View style={[s.topRail, { backgroundColor: theme.bg, borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={()=>handleZoneTap('fan')} style={[s.fanCircle, zoneStyle('fan')]}>
            {[0,45,90,135].map(a=>(<View key={a} style={[s.blade,{transform:[{rotate:`${a}deg`}]}]}/>))}
            <View style={s.fanHub}/>
            {slotContent('fan', PARTS[6].image)}
          </TouchableOpacity>
          <View style={s.fanCircle}>
            {[0,45,90,135].map(a=>(<View key={a} style={[s.blade,{transform:[{rotate:`${a}deg`}]}]}/>))}
            <View style={s.fanHub}/>
          </View>
        </View>

        {/* ─ Main interior ─ */}
        <View style={s.interior}>

          {/* Left wall fan */}
          <View style={[s.leftCol, { backgroundColor: theme.bg, borderRightColor: theme.border }]}>
            <View style={s.sideFanSm}>
              {[0,60,120].map(a=>(<View key={a} style={[s.smBlade,{transform:[{rotate:`${a}deg`}]}]}/>))}
              <View style={s.smHub}/>
            </View>
          </View>

          {/* ─ Motherboard zone ─ */}
          <View style={s.mbZone}>
            {/* Rear I/O shield */}
            <View style={s.ioShield}>
              <View style={s.ioPortWrap}>
                <TouchableOpacity onPress={()=>handleZoneTap('usb')} style={[s.ioPort,s.usbSt,zoneStyle('usb')]}>
                  {slotContent('usb', PARTS[8].image, true)}
                </TouchableOpacity>
              </View>
              <View style={s.ioPortWrap}>
                <TouchableOpacity onPress={()=>handleZoneTap('audio')} style={[s.ioPort,s.audioSt,zoneStyle('audio')]}>
                  {slotContent('audio', PARTS[7].image, true)}
                </TouchableOpacity>
              </View>
              <View style={s.ioPortWrap}>
                <TouchableOpacity onPress={()=>handleZoneTap('vga')} style={[s.ioPort,s.vgaSt,zoneStyle('vga')]}>
                  {slotContent('vga', PARTS[9].image, true)}
                </TouchableOpacity>
              </View>
            </View>

            {/* PCB — motherboard slot */}
            <TouchableOpacity onPress={()=>handleZoneTap('motherboard')} activeOpacity={0.9} style={[s.pcbSlot, zoneStyle('motherboard')]}>
              {slotContent('motherboard', PARTS[3].image)}

              {/* VRM caps */}
              <View style={s.vrmRow}>{[0,1,2,3,4].map(i=>(<View key={i} style={s.cap}/>))}</View>

              {/* CPU socket */}
              <TouchableOpacity onPress={()=>handleZoneTap('cpu')} style={[s.cpuSock, zoneStyle('cpu')]}>
                <View style={s.cpuInner}/>
                {slotContent('cpu', PARTS[0].image)}
              </TouchableOpacity>

              {/* RAM slots — 4 DIMM slots, first is the drop target */}
              <View style={s.ramCol}>
                <TouchableOpacity onPress={()=>handleZoneTap('ram')} style={[s.ramSlot, zoneStyle('ram')]}>
                  <View style={s.ramChannel}/>
                  <View style={s.ramPins}>
                    {[0,1,2,3,4,5].map(i=>(<View key={i} style={s.ramPinDot}/>))}
                  </View>
                  <View style={[s.ramClipBar,{left:0}]}/>
                  <View style={[s.ramClipBar,{right:0}]}/>
                  {slotContent('ram', PARTS[1].image, true)}
                </TouchableOpacity>
                {[0,1,2].map(i=>(
                  <View key={i} style={s.ramSlotD}>
                    <View style={s.ramChannel}/>
                    <View style={[s.ramClipBar,{left:0}]}/>
                    <View style={[s.ramClipBar,{right:0}]}/>
                  </View>
                ))}
              </View>

              {/* PCIe slots */}
              <View style={s.pcieArea}>
                <TouchableOpacity onPress={()=>handleZoneTap('gpu')} style={[s.pcieX16, zoneStyle('gpu')]}>
                  {slotContent('gpu', PARTS[2].image)}
                </TouchableOpacity>
                <View style={s.pcieX1}/>
                <View style={s.pcieX1}/>
              </View>

              {/* BIOS + chipset + CMOS */}
              <View style={s.chipRow}>
                <TouchableOpacity onPress={()=>handleZoneTap('bios')} style={[s.biosChip, zoneStyle('bios')]}>
                  {slotContent('bios', PARTS[10].image, true)}
                </TouchableOpacity>
                <View style={s.chipset}/>
                <View style={s.cmosChip}/>
              </View>

              {/* SATA ports */}
              <View style={s.sataRow}>{[0,1,2,3].map(i=>(<View key={i} style={s.sata}/>))}</View>
            </TouchableOpacity>
          </View>

          {/* ─ Middle: SSD bay + cable holes ─ */}
          <View style={s.midCol}>
            <TouchableOpacity onPress={()=>handleZoneTap('ssd')} style={[s.ssdBay, zoneStyle('ssd')]}>
              {/* M.2 edge connector */}
              <View style={s.ssdConnHead}>
                {[0,1,2,3,4,5,6,7].map(i=>(<View key={i} style={s.ssdPin}/>))}
              </View>
              {/* key notch + groove */}
              <View style={s.ssdKey}/>
              <View style={s.ssdGroove}/>
              {/* retention screw hole */}
              <View style={s.ssdScrewHole}>
                <View style={s.ssdScrewInner}/>
              </View>
              {slotContent('ssd', PARTS[5].image)}
            </TouchableOpacity>
            {[0,1,2].map(i=>(<View key={i} style={s.cableHole}/>))}
          </View>

          {/* ─ Right: 3 exhaust fans ─ */}
          <View style={s.rightCol}>
            {[0,1,2].map(i=>(
              <View key={i} style={s.rFan}>
                {[0,45,90,135].map(a=>(<View key={a} style={[s.rBlade,{transform:[{rotate:`${a}deg`}]}]}/>))}
                <View style={s.rHub}/>
              </View>
            ))}
          </View>
        </View>

        {/* ─ Bottom bar: PSU ─ */}
        <View style={[s.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TouchableOpacity onPress={()=>handleZoneTap('psu')} style={[s.psuBay, zoneStyle('psu')]}>
            {slotContent('psu', PARTS[4].image)}
          </TouchableOpacity>
          <View style={s.psuVents}>
            {[0,1,2,3,4,5,6].map(i=>(<View key={i} style={s.ventSlot}/>))}
          </View>
        </View>
      </View>

      {/* ─ FEEDBACK LINE ─ */}
      {feedback && (
        <View style={[s.feedbackLine, feedback.ok ? s.fbOk : s.fbErr]}>
          <Text style={s.fbTxt}>{feedback.msg}</Text>
        </View>
      )}

      {/* ─ PARTS TRAY ─ */}
      <View style={[s.tray, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <Text style={[s.trayLbl, { color: theme.textSub }]}>PARTS TO INSTALL</Text>
        <View style={s.trayRow}>
          <TouchableOpacity
            style={s.trayArrow}
            onPress={() => {
              trayOffsetRef.current = 0;
              trayScrollRef.current?.scrollTo({ x: 0, animated: true });
            }}>
            <Text style={s.trayArrowTxt}>◀</Text>
          </TouchableOpacity>
          <ScrollView
            ref={trayScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.trayScroll}
            onScroll={e => { trayOffsetRef.current = e.nativeEvent.contentOffset.x; }}
            scrollEventThrottle={16}
            style={s.trayScrollView}>
            {trayParts.map(part => {
              const isPlaced = placed.includes(part.id);
              const isSel    = selectedPart === part.id;
              return (
                <TouchableOpacity
                  key={part.id}
                  onPress={() => { if (!isPlaced && !gameOver) setSelectedPart(part.id); }}
                  disabled={isPlaced || gameOver}
                  style={[s.card, isSel && s.cardSel, isPlaced && s.cardPlaced, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                  <Image source={part.image} style={[s.cardImg, isPlaced && s.cardImgDim]} resizeMode="contain"/>
                  <Text style={[s.cardLbl, isPlaced && s.cardLblDim, { color: theme.text }]}>{part.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            style={s.trayArrow}
            onPress={() => {
              trayScrollRef.current?.scrollToEnd({ animated: true });
            }}>
            <Text style={s.trayArrowTxt}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A1628' },

  /* Header */
  header:   { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#7B52E8', paddingTop:48, paddingBottom:12, paddingHorizontal:16 },
  hTitle:   { color:'#FFFFFF', fontSize:16, fontWeight:'800', letterSpacing:2 },
  hRight:   { flexDirection:'row', alignItems:'center', gap:12 },
  timerBox: { backgroundColor:'rgba(0,0,0,0.25)', borderRadius:6, paddingHorizontal:8, paddingVertical:3 },
  timerTxt: { color:'#F5A623', fontSize:18, fontWeight:'900', letterSpacing:1 },
  timerRed: { color:'#F44336' },
  scoreTxt: { color:'#FFFFFF', fontSize:16, fontWeight:'800' },
  pauseIco: { color:'#FFFFFF', fontSize:20, paddingHorizontal:4 },

  /* Step indicator */
  stepBar:  { backgroundColor:'#0d1b30', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingVertical:8, borderBottomWidth:1, borderBottomColor:'#1E3A5F' },
  stepLeft: { flexDirection:'row', alignItems:'center' },
  stepLbl:  { color:'#8B9EC3', fontSize:12, fontWeight:'700', letterSpacing:1 },
  stepPart:  { color:'#F5A623', fontSize:12, fontWeight:'800' },
  stepCount: { color:'#8B9EC3', fontSize:11, fontWeight:'600' },
  clueCard: { marginHorizontal:16, marginVertical:12, padding:14, borderRadius:12, borderWidth:1 },
  clueLabel: { color:'#8B9EC3', fontSize:11, fontWeight:'800', marginBottom:6, letterSpacing:1 },
  clueText: { color:'#FFFFFF', fontSize:14, lineHeight:20 },
  dotsRow:  { flexDirection:'row', gap:4 },
  dot:      { width:8, height:8, borderRadius:4 },
  dotGray:  { backgroundColor:'#2a3a5a' },
  dotActive:{ backgroundColor:'#F5A623' },
  dotDone:  { backgroundColor:'#4CAF50' },

  /* PC Case */
  caseFrame:  { flex:1, margin:6, backgroundColor:'#1a1a1a', borderRadius:8, borderWidth:3, borderColor:'#0a0a0a', overflow:'hidden' },
  topRail:    { height:60, backgroundColor:'#151515', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:24, borderBottomWidth:2, borderBottomColor:'#0a0a0a', paddingHorizontal:8 },
  fanCircle:  { width:50, height:50, borderRadius:25, borderWidth:2, borderColor:'#666', backgroundColor:'#111', alignItems:'center', justifyContent:'center', overflow:'hidden', elevation:4, shadowColor:'#000', shadowOpacity:0.6, shadowRadius:4 },
  blade:      { position:'absolute', width:2, height:42, backgroundColor:'#787878' },
  fanHub:     { width:10, height:10, borderRadius:5, backgroundColor:'#cccccc', position:'absolute', zIndex:1, borderWidth:1, borderColor:'#888' },
  interior:   { flex:1, flexDirection:'row', backgroundColor:'#181818' },
  leftCol:    { width:30, backgroundColor:'#1c1c1c', alignItems:'center', justifyContent:'center', borderRightWidth:1, borderRightColor:'#0a0a0a' },
  sideFanSm:  { width:24, height:24, borderRadius:12, borderWidth:1, borderColor:'#555', backgroundColor:'#111', alignItems:'center', justifyContent:'center' },
  smBlade:    { position:'absolute', width:1.5, height:18, backgroundColor:'#707070' },
  smHub:      { width:6, height:6, borderRadius:3, backgroundColor:'#aaa', position:'absolute' },
  mbZone:     { flex:5, flexDirection:'row', padding:3 },
  ioShield:   { width:38, backgroundColor:'#242424', borderRadius:2, alignItems:'center', paddingVertical:6, paddingHorizontal:3, gap:5, borderRightWidth:1, borderRightColor:'#111' },
  ioPortWrap: { alignItems:'center', gap:2 },
  ioLbl:      { color:'#aaaaaa', fontSize:6, fontWeight:'800', letterSpacing:0.5 },
  ioPort:     { width:28, borderRadius:3, alignItems:'center', justifyContent:'center', borderWidth:1.5, overflow:'hidden' },
  usbSt:      { height:20, backgroundColor:'#0a2040', borderColor:'#1a6aff' },
  audioSt:    { height:14, backgroundColor:'#1a0a00', borderColor:'#ff6a00', borderRadius:7 },
  vgaSt:      { height:24, backgroundColor:'#1a1800', borderColor:'#e8d000' },
  pcbSlot:    { flex:1, backgroundColor:'#1a4028', borderRadius:3, marginLeft:2, borderWidth:1, borderColor:'#2d7a40', overflow:'visible' },
  vrmRow:     { position:'absolute', top:4, left:5, flexDirection:'row', gap:2 },
  cap:        { width:5, height:12, backgroundColor:'#5a4010', borderRadius:1, borderWidth:1, borderColor:'#c8a020', elevation:1 },
  cpuSock:    { position:'absolute', top:'15%', left:'10%', width:'34%', height:'28%', backgroundColor:'#1e1800', borderWidth:2, borderColor:'#c8a020', borderRadius:3, alignItems:'center', justifyContent:'center', overflow:'hidden', elevation:3 },
  cpuInner:   { width:'78%', height:'78%', backgroundColor:'#100e00', borderWidth:1, borderColor:'#a08010', borderRadius:1, alignItems:'center', justifyContent:'center' },
  ramCol:     { position:'absolute', top:'5%', right:'3%', width:'18%', height:'60%', gap:3 },
  ramSlot:    { flex:1, backgroundColor:'#08081a', borderWidth:1.5, borderColor:'#5050c0', borderRadius:2, overflow:'hidden', elevation:2 },
  ramSlotD:   { flex:1, backgroundColor:'#060610', borderWidth:1, borderColor:'#20203a', borderRadius:2, overflow:'hidden' },
  ramChannel: { position:'absolute', left:4, right:4, top:'38%', height:6, backgroundColor:'#12123a', borderWidth:1, borderColor:'#3838a0', borderRadius:1 },
  ramPins:    { position:'absolute', bottom:2, left:0, right:0, flexDirection:'row', justifyContent:'center', gap:2 },
  ramPinDot:  { width:2, height:5, backgroundColor:'#c8a020', borderRadius:0.5 },
  ramClipBar: { position:'absolute', top:0, bottom:0, width:4, backgroundColor:'#2a3090', borderRadius:1 },
  pcieArea:   { position:'absolute', bottom:'10%', left:'2%', right:'2%', gap:4 },
  pcieX16:    { height:18, backgroundColor:'#0a0a18', borderWidth:1.5, borderColor:'#4040a0', borderRadius:2, alignItems:'center', justifyContent:'center', overflow:'hidden', flexDirection:'row', paddingHorizontal:2 },
  pcieX1:     { height:8, width:'52%', backgroundColor:'#0a0a18', borderWidth:1, borderColor:'#1e1e38', borderRadius:1 },
  chipRow:    { position:'absolute', bottom:'25%', left:'3%', flexDirection:'row', gap:5, alignItems:'center' },
  biosChip:   { width:28, height:20, backgroundColor:'#111', borderWidth:1.5, borderColor:'#888', borderRadius:3, alignItems:'center', justifyContent:'center', overflow:'hidden', elevation:2 },
  chipset:    { width:24, height:24, backgroundColor:'#0d0d0d', borderWidth:1, borderColor:'#444', borderRadius:2 },
  cmosChip:   { width:16, height:16, borderRadius:8, backgroundColor:'#2a1400', borderWidth:1.5, borderColor:'#c87000', elevation:1 },
  sataRow:    { position:'absolute', right:3, top:'52%', gap:2 },
  sata:       { width:11, height:7, backgroundColor:'#0f1a0f', borderWidth:1, borderColor:'#3a6a3a', borderRadius:1 },
  midCol:     { flex:2, padding:5, gap:5 },
  ssdBay:      { height:42, backgroundColor:'#0e0e0e', borderRadius:4, borderWidth:1.5, borderColor:'#666', overflow:'hidden', elevation:2, flexDirection:'row', alignItems:'center', paddingHorizontal:5, gap:3 },
  ssdConnHead: { width:10, alignSelf:'stretch', backgroundColor:'#1a1a1a', borderRadius:2, borderWidth:1, borderColor:'#555', paddingVertical:2, gap:1.5, alignItems:'center', justifyContent:'center' },
  ssdPin:      { width:'85%', height:2, backgroundColor:'#c8a020', borderRadius:0.5 },
  ssdKey:      { width:3, height:12, backgroundColor:'#0e0e0e', borderRadius:1, borderWidth:1, borderColor:'#333' },
  ssdGroove:   { flex:1, height:10, backgroundColor:'#050505', borderRadius:2, borderWidth:1, borderColor:'#444' },
  ssdScrewHole:{ width:11, height:11, borderRadius:6, backgroundColor:'#1a1a1a', borderWidth:1.5, borderColor:'#777', alignItems:'center', justifyContent:'center' },
  ssdScrewInner:{ width:5, height:5, borderRadius:3, backgroundColor:'#333' },
  cableHole:  { height:28, backgroundColor:'#0f0f0f', borderRadius:14, borderWidth:1, borderColor:'#333' },
  rightCol:   { flex:2, backgroundColor:'#1c1c1c', borderLeftWidth:1, borderLeftColor:'#0a0a0a', alignItems:'center', justifyContent:'space-evenly', paddingVertical:6 },
  rFan:       { width:42, height:42, borderRadius:21, borderWidth:2, borderColor:'#555', backgroundColor:'#111', alignItems:'center', justifyContent:'center', overflow:'hidden', elevation:3 },
  rBlade:     { position:'absolute', width:2, height:34, backgroundColor:'#707070' },
  rHub:       { width:8, height:8, borderRadius:4, backgroundColor:'#bbb', position:'absolute', borderWidth:1, borderColor:'#888' },
  bottomBar:  { height:62, backgroundColor:'#141414', borderTopWidth:2, borderTopColor:'#0a0a0a', flexDirection:'row', alignItems:'center', paddingHorizontal:10, gap:10 },
  psuBay:     { width:'44%', height:46, backgroundColor:'#7a7a7a', borderRadius:5, borderWidth:2, borderColor:'#aaaaaa', alignItems:'center', justifyContent:'center', overflow:'hidden', elevation:4, shadowColor:'#000', shadowOpacity:0.5, shadowRadius:4 },
  psuVents:   { flex:1, height:46, flexDirection:'row', gap:4, alignItems:'center', justifyContent:'center' },
  ventSlot:   { width:4, height:36, backgroundColor:'#2a2a2a', borderRadius:2, borderWidth:0.5, borderColor:'#444' },
  fillImg:    { width:'82%', height:'82%', position:'absolute' },
  ck:         { color:'#4CAF50', fontSize:10, fontWeight:'900', position:'absolute', top:2, right:3, zIndex:5 },
  ckxs:       { color:'#4CAF50', fontSize:7,  fontWeight:'900', position:'absolute', top:1, right:1, zIndex:5 },
  compLabel:  { color:'rgba(255,255,255,0.55)', fontSize:7, fontWeight:'800', textAlign:'center', letterSpacing:1, zIndex:2 },
  compLabelSm:{ color:'rgba(255,255,255,0.55)', fontSize:6, fontWeight:'800', textAlign:'center', letterSpacing:0.5, zIndex:2 },
  slotDone:   { borderWidth:2, borderStyle:'solid', borderColor:'#4CAF50', backgroundColor:'rgba(76,175,80,0.2)' },
  slotWrong:  { borderWidth:2, borderStyle:'solid', borderColor:'#F44336', backgroundColor:'rgba(244,67,54,0.18)' },
  blinkBorder:{ ...StyleSheet.absoluteFill, borderWidth:2, borderColor:'#ffffff', borderRadius:4 },
  ovImg:      { width:'70%', height:'70%' },
  checkSm:    { color:'#4CAF50', fontSize:9, fontWeight:'900', position:'absolute', top:1, right:2 },

  /* Feedback */
  feedbackLine:{ paddingVertical:6, paddingHorizontal:24, borderRadius:20, alignSelf:'center', marginVertical:4, borderWidth:1 },
  fbOk:  { backgroundColor:'#1B5E20', borderColor:'#4CAF50' },
  fbErr: { backgroundColor:'#B71C1C', borderColor:'#F44336' },
  fbTxt: { color:'#FFFFFF', fontSize:13, fontWeight:'800' },

  /* Parts tray */
  tray:         { backgroundColor:'#0D1F3C', borderTopWidth:2, borderTopColor:'#1E3A5F', paddingTop:8, paddingBottom:10, paddingHorizontal:8, height:118 },
  trayLbl:      { color:'#8B9EC3', fontSize:9, letterSpacing:3, marginBottom:5 },
  trayRow:      { flexDirection:'row', alignItems:'center', gap:4 },
  trayScrollView:{ flex:1 },
  trayScroll:   { gap:6, paddingHorizontal:4 },
  trayArrow:    { width:26, height:80, alignItems:'center', justifyContent:'center', backgroundColor:'#1E3A5F', borderRadius:6 },
  trayArrowTxt: { color:'#FFFFFF', fontSize:13, fontWeight:'900' },
  card:   { width:72, height:80, backgroundColor:'#162040', borderRadius:8, borderWidth:2, borderColor:'#1E3A5F', alignItems:'center', justifyContent:'center', padding:4 },
  cardSel:   { borderColor:'#F5A623', elevation:6, shadowColor:'#F5A623', shadowOpacity:0.5, shadowRadius:6 },
  cardPlaced:{ opacity:0.2 },
  cardImg:   { width:38, height:38 },
  cardImgDim:{ opacity:0.4 },
  cardLbl:   { color:'#FFFFFF', fontSize:8, fontWeight:'700', marginTop:2, textAlign:'center' },
  cardLblDim:{ opacity:0.4 },
});