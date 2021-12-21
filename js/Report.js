import React ,{useEffect, useState,useRef} from 'react';

import DefaultStyle from './Styles.js';
import Setup from './Setup.js'; 
import { GlobalGradientBG } from './GlobalComponent.js';
import { ShareButton } from './Share.js';

//import { BarChart, Grid } from 'react-native-svg-charts';
import { StyleSheet, Button, Text, View, BackHandler, Image, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//import { BarChart,} from "react-native-chart-kit";

import { StackedBarChart, BarChart , Grid } from 'react-native-svg-charts'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton } from 'react-native-paper';

import Images from '../assets/emotes';
import EmoteDusts from '../assets/emotedusts';

import { DateFunc, MathFunc } from './lib/Funclib.js';
//import LinearGradient from 'react-native-linear-gradient';

import {PanGestureHandler,ScrollView,State,  } from 'react-native-gesture-handler';
import Animated , { useSharedValue, withTiming, useAnimatedStyle, Easing, useAnimatedScrollHandler, interpolateColor, useDerivedValue } from 'react-native-reanimated';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const ReportTab = createMaterialTopTabNavigator();
const ScreenHeight = Dimensions.get('screen').height;

const ReportStyle = StyleSheet.create({
	TitleText:{fontFamily: 'Nolja', fontSize:26,},
	ContentText:{ fontFamily: 'Nolja', fontSize:20, },
	OverContainer:{backgroundColor:'rgb(255,235,240)',flex:2,marginTop:80},
}
)

const ChartPageWidth = Dimensions.get('window').width;

const MChartPageLabel = [
	'키워드 별 통계',
	'감정 먼지 별 통계',
	'주별 감정 먼지 통계',
]

const WChartPageLabel = [
	'키워드 별 통계',
	'감정 먼지 별 통계',
]

const MChartPageNum = MChartPageLabel.length-1;
const WChartPageNum = WChartPageLabel.length-1;

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// Main Screen
function Report({ navigation, route } ) {

	return (
		<>
		<GlobalGradientBG>
		{ /* Report Tabs */ }
		<ReportTab.Navigator sceneContainerStyle={{backgroundColor: 'transparent'}}
			screenOptions={{ tabBarIndicatorStyle:{opacity:0}, 
				tabBarLabelStyle: { fontSize: 15,paddingBottom:12, fontFamily: 'Nolja', fontSize:25, },
				tabBarItemStyle: { width: 75, height:40 },
				tabBarStyle: { backgroundColor: 'white', zIndex: 2, borderWidth: 2, borderColor: 'gray', borderRadius:7, 
				position:'absolute', width: 154,height:40 , alignSelf: 'center', flexDirection:'column', marginTop: 15, },
				swipeEnabled:false,
				tabBarActiveTintColor:'black',
				tabBarInactiveTintColor: 'gray',
				
			}}
			
		>
			<ReportTab.Screen name="주간" component={WReport} />
			<ReportTab.Screen name="월간" component={MReport} />

		</ReportTab.Navigator>
		</GlobalGradientBG>

		{/* Absolute pos button*/}
		<ShareButton {...navigation}/>

		</>
	);
}

// Inner Views
const ChartView = ( props ) => {

	const {chartData, chartLabel , labelSource} = props;

	const chartIcons = chartLabel.map((item)=>{
		const result = Reflect.get(labelSource,item);
		return (
			<View key={item??'Invalid'+Math.random().toString()} style={[DefaultStyle.SimpleBorder,{flex:1,maxHeight:30,maxWidth:30,alignItems:'center', justifyContent:'center' ,backgroundColor:'rgba(52, 52, 52, 0.4)'}]}>
				<Image source={result} style={{flex:1,width: 28, height: 28}}/>
			</View>
		  )
	});

	return(
		<View /*LinearGradient*/ style={[{width:ChartPageWidth ,marginTop:10,marginBottom:10}]} 
		colors={['rgb(255,225,230)',  'rgb(255,179,190)']}
		>
		<ScrollView horizontal={true} style={{}} 
			contentContainerStyle={[chartData.length==0?{flex:1,}:{},{alignItems:'center',justifyContent:chartData.length==0?'center':'flex-start'}]}
			//style={{width:342}} 
			>
				{(chartData.length==0)?
				<View style={{height:305, alignItems:'center', justifyContent:'center', opacity:0.5}}>
					<Image style={{width:100,height:100}} source={require('../assets/emotedusts/emotedust_9.png')}/>
					<Text style={{fontFamily:'Nolja',fontSize:30}}>기록이 없어요!</Text>
				</View>
				:
				<BarChart style={{height:305,width:chartData.length*45+50,}} yMin={0} spacingOuter={0.32} spacingInner={0.73}
				contentInset={{ top: 20, bottom: 40 ,left: 10, right:10}} showGrid={true} 
				data={chartData} svg={{fill:'rgb(254,203,76)', fillOpacity:1, stroke:'none'}}
				>
					
					<View style={[{width:chartData.length*45+50,flexDirection:'row',paddingHorizontal:7, paddingBottom:5,
					alignItems:'flex-end',justifyContent:'space-around'}]}>
					{chartIcons}
					
					</View>
				</BarChart>
				}

		</ScrollView>
		</View> /*LinearGradient*/
	)
}

const WeeklyChartView = ( props ) => {


	const {chartData, chartKeys, chartColors, labelSource} = props;

	const chartLabels = chartData.map((item)=>{
		return (
			<View key={item.Week} style={[{flex:1,maxHeight:30,maxWidth:30,alignItems:'center', justifyContent:'center' ,backgroundColor:'rgba(52, 52, 52, 0.4)'}]}>
				<Text style={{fontSize:11}}>{item.Week}주차</Text>
			</View>
		  )
	});


	chartData.forEach(dataobj=>{
		chartKeys.forEach(key => dataobj[key]==null ? dataobj[key]=0 : {})
	})

	//console.log(chartData,chartKeys, chartColors)

	return(
		<View /*LinearGradient*/ style={[{width:ChartPageWidth ,flex:1,marginTop:10,marginBottom:10}]} 
		colors={['rgb(255,225,230)',  'rgb(255,179,190)']}>
		<ScrollView horizontal={true} style={{flex:1,}} 
				contentContainerStyle={{flex:1,alignItems:'center',justifyContent:chartKeys.length==0?'center':'flex-start'}}
				//style={{width:342}} 
				>
					
				{(chartKeys.length==0)?
				<View style={[{flex:1, alignItems:'center', justifyContent:'center', opacity:0.5}]}>
					<Image style={{width:100,height:100}} source={require('../assets/emotedusts/emotedust_9.png')}/>
					<Text style={{fontFamily:'Nolja',fontSize:30}}>기록이 없어요!</Text>
				</View>
				:
				<StackedBarChart style={{flex:1,width:chartData.length*45+50}} yMin={0}
				contentInset={{ top: 20, bottom: 40 ,left: 10, right:10}} keys={chartKeys} colors={chartColors}
				data={chartData}  spacingOuter={0.32} spacingInner={0.73}
				svg={{fillOpacity:0.5,strokeWidth:1, strokeOpacity:1, stroke:'black'}} 
				>
				
					{/* <Grid /> */}
					<View style={[{width:chartData.length*45+100,flexDirection:'row', paddingBottom:5, paddingHorizontal:5,
						alignItems:'flex-end',justifyContent:'space-around'}]}>
						{chartLabels}
						
					</View>
				</StackedBarChart>
				}
					
		</ScrollView>
		</View>
	)
}

const CommentView = ( props ) => {

	const sharedEasing= {
		duration: 600,
		easing: Easing.bezier(0.25, 0.1, 0.25, 1),
	};

	const animatedIndicatorColorStyles = useAnimatedStyle(() => {
		return { backgroundColor:withTiming(props.swipeState?'rgb(254,167,175)':'rgb(255,235,240)',sharedEasing), };
	});

	return (

	<View style={[{backgroundColor:'rgb(254,167,175)',marginTop:15,zIndex:1,}]}>
		
		<Animated.View style={[animatedIndicatorColorStyles,{top:-11, borderRadius:45, position:'absolute',alignSelf:'center',zIndex:2,}]}>
			<IconButton style={{margin:-5}} icon={props.swipeState?'chevron-up':'chevron-down'} size={25} />
		</Animated.View>

		<View style={[{alignSelf:'center',marginTop:20}]}>
			<Text style={ReportStyle.TitleText}>감정 추천글</Text>
		</View>
		<View style={[{marginTop:20,marginHorizontal:10,marginBottom:10,alignItems:'center',}]}>
			<Image source={require('../assets/bg/bg1.png')} style={{width:300,height:78,marginBottom:20,}} />
			<View style={[{justifyContent:'center' ,height:270}]}>
				<Text style={[ReportStyle.ContentText,]}>Comment goes here</Text>
			</View>
		</View>
	</View>

	);
}

// Helpers
const makeRangedResult = (parsedResult, MinDate,MaxDate) =>{
	return (parsedResult.map(item=>{
		const itemDate = new Date(item.date);
		//console.log('item '+ itemDate);
		if(itemDate.getTime()<=MaxDate.getTime() && itemDate.getTime()>=MinDate.getTime()) {
			return item;
		}
		return null;
	}));
}

const chartDataUpdater = ( Target , inItem ) => {
	if (inItem!=null && inItem!==""){
		const newValue = Reflect.get(Target,inItem) ?? 0;
		Reflect.set(Target, inItem, newValue + 1 );
	}
}

// Thinkable Option = merge WReport and MReport
function WReport( { navigation, route } ) {

	// datainput
	const [currentDate, setCurrentDate] = useState(DateFunc.normalizeDate(new Date(),true));

	const [statechartData, setChartData] = useState([[],[]]);
	const [statechartLabel, setChartLabel] = useState([[],[]]);
	const TypeScrollRef=useRef(null);
	const [TypeScrollIdx,setTypeScrollIdx] = useState(0);

	const [__rd, Redraw] = useState(false);

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth()+1;
	const week = Math.floor(currentDate.getUTCDate()/7);
	const weekF = currentDate.getUTCDate();//1 + 7*week;
	const weekE = weekF+6 <= DateFunc.getLastDateofMonth(currentDate) ? weekF+6 : DateFunc.getLastDateofMonth(currentDate);
	
	// Manual Redraw
	useEffect(()=>{
		AsyncStorage.getItem('Diaries',(error,result)=>{

			let numPerEmotes={};
			let numPerEmoteDusts={};
			const MinDate = new Date(currentDate);
			const MaxDate = new Date(currentDate);
			MinDate.setHours(0,0,0,0);
			MaxDate.setDate(weekE+1);
			MaxDate.setHours(0,0,0,0);

			const parsedResult = JSON.parse(result??'[]');
			const rangedResult = makeRangedResult(parsedResult,MinDate,MaxDate)			

			const storedEmotes = rangedResult.map(item=>item?.diaryEmote);
			const storedEmoteDusts = rangedResult.map(item=>item?.diaryEmoteDust);

			storedEmoteDusts.forEach(emoteDust=>chartDataUpdater(numPerEmoteDusts,emoteDust))
			storedEmotes.forEach(emoteArray=>emoteArray?.forEach(emoteString=>chartDataUpdater(numPerEmotes,emoteString)))
			
			const chartLabel = [Object.keys(numPerEmotes), Object.keys(numPerEmoteDusts)];
			const chartData = [chartLabel[0].map(key => numPerEmotes[key]), chartLabel[1].map(key => numPerEmoteDusts[key]) ] ;
			
			setChartData(chartData);
			setChartLabel(chartLabel);
			
			if (!__rd) {Redraw(true);console.log('Redraw');}
			
		})
	},[__rd]
	)


	// ---------------- Anims -------------------
	const [swipeState,setSwipeState] = useState(true); // true = down , false = up

	const onSwipeUp = (gestureState) => { console.log('up'); setSwipeState(false) }
	const onSwipeDown = (gestureState) => { console.log('down'); setSwipeState(true) }

	const animModifier = useSharedValue(0);

	const ChartViewMargins = 242.5;
	const DefaultCommentViewHeight = 70;
	const DefaultChartViewHeight = ScreenHeight-ChartViewMargins-DefaultCommentViewHeight;

	useEffect(()=>{
		animModifier.value=swipeState?0:390;
	},[swipeState])

	const sharedEasing= {
		duration: 600,
		easing: Easing.bezier(0.25, 0.1, 0.25, 1),
	};

	const animatedChartViewStyles = useAnimatedStyle(() => {
		return { height: withTiming(DefaultChartViewHeight-animModifier.value, sharedEasing), };
	});

	const animatedCommentViewStyles = useAnimatedStyle(() => {
		return { height: withTiming(DefaultCommentViewHeight+animModifier.value, sharedEasing), };
	});

	
	return (
		// <GlobalGradientBG>
		<GestureRecognizer style={{flex:1}}
		onSwipeUp={(state) => onSwipeUp(state)}
        onSwipeDown={(state) => onSwipeDown(state)}
		>
			<View style={[{flex:1, marginTop:-15, borderTopWidth:0}]}>

				{/* <ScrollView showsVerticalScrollIndicator={false} overScrollMode={'never'} style={[ReportStyle.OverContainer]}> */}
				{ /* Charts */}
				<Animated.View style={[animatedChartViewStyles,{backgroundColor:'rgb(255,235,240)',marginTop:80}]} >
					<View style={{flex:1}}>
						<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:10}}>
							<IconButton icon={'chevron-double-left'} size={20} onPress={()=>{
								const NV=MathFunc.clamp(TypeScrollIdx-1,0,WChartPageNum)
								setTypeScrollIdx(NV);
								
								TypeScrollRef.current.scrollTo({ x: (ChartPageWidth) * NV, y: 0, animated: true })
							}}/>
							<Text style={ReportStyle.TitleText}>{WChartPageLabel[TypeScrollIdx]}</Text>
							<IconButton icon={'chevron-double-right'} size={20} onPress={()=>{
								const NV=MathFunc.clamp(TypeScrollIdx+1,0,WChartPageNum);
								setTypeScrollIdx(NV);
								
								TypeScrollRef.current.scrollTo({ x: (ChartPageWidth) * NV, y: 0, animated: true })
							}}/>
						</View>
						
						{ /* Charts */ }
						<ScrollView horizontal={true} scrollEnabled={false} ref={TypeScrollRef} showsHorizontalScrollIndicator={false}>
							<ChartView chartData={statechartData[0]} chartLabel={statechartLabel[0]} labelSource={Images}/>
							<ChartView chartData={statechartData[1]} chartLabel={statechartLabel[1]} labelSource={EmoteDusts}/>
						</ScrollView>

						{ /* Buttons */}
						<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10}}>
							<IconButton icon={'chevron-left'} size={20} onPress={()=>{setCurrentDate(DateFunc.normalizeDate(currentDate.addDays(-2),true)); Redraw(false);}}/>
							<Text style={ReportStyle.ContentText}> {year}년 {month}월 {week+1}주차 ( {weekF}일 ~ {weekE}일 ) </Text>
							<IconButton icon={'chevron-right'} size={20} onPress={()=>{setCurrentDate(DateFunc.normalizeDate(currentDate.addDays(7),true)); Redraw(false);}}/>
						</View>
					</View>
				</Animated.View>
					
				{ /* Comments */ }
				<Animated.View style={[animatedCommentViewStyles]}> 
					<CommentView swipeState={swipeState}/>
				</Animated.View>
				
					
				{/* </ScrollView> */}
				
			</View>
		</GestureRecognizer>
		// </GlobalGradientBG>
	);
}

function MReport( { navigation, route } ) {
  
	const [currentDate, setCurrentDate] = useState(DateFunc.normalizeDate(new Date(),false));

	const [statechartData, setChartData] = useState([[],[],[],[]]);
	const [statechartLabel, setChartLabel] = useState([[],[],[]]);

	const [__rd, Redraw] = useState(false);

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth()+1;

	const TypeScrollRef=useRef(null);
	const [TypeScrollIdx,setTypeScrollIdx] = useState(0);

	useEffect(()=>{
		AsyncStorage.getItem('Diaries',(error,result)=>{
			let numPerEmotes={};
			let numPerEmoteDusts={};
			const MinDate = new Date(currentDate);
			const MaxDate = (new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0)).addDays(1);
			MinDate.setHours(0,0,0,0);

			const parsedResult = JSON.parse(result??'[]');
			const rangedResult = makeRangedResult(parsedResult,MinDate,MaxDate);

			// const storedEmotes = rangedResult.map(item=>item?.diaryEmote)
			// storedEmotes.forEach(emoteArray=>emoteArray?.forEach(emoteString=>chartDataUpdater(numPerEmotes,emoteString)))

			// const storedEmoteDusts = rangedResult.map(item=>item?.diaryEmoteDust)
			// storedEmoteDusts.forEach(emoteDust=>chartDataUpdater(numPerEmoteDusts,emoteDust))

			let weeklyDatas = [];
			let loopDate = MinDate;
			let weekCounter = 1;
			while ( loopDate.getTime()<= MaxDate.getTime() ){
				weeklyDatas.push({Week : weekCounter++});
				loopDate=loopDate.addDays(7);
			}

			// let emoteKeys=[];
			// let emoteColors=[];
			let emoteDustKeys=[];
			let emoteDustColors=[];
			weeklyDatas.forEach( item => {

				const weekMin = MinDate.addDays((item.Week-1)*7);
				const weekMax = (MinDate.addDays((item.Week)*7-1)).getTime() <= MaxDate.getTime() ? MinDate.addDays((item.Week)*7-1) : MaxDate;
				
				//console.log(weekMin,weekMax);
				const weekRangedResult = makeRangedResult(parsedResult,weekMin,weekMax);
				weekRangedResult.forEach(mitem=>{
					mitem?.diaryEmote?.forEach(emoteString=>{
						// chartDataUpdater(item,emoteString)
						// emoteKeys.push(emoteString);
						// emoteColors.push("#"+Math.round(Math.random()*0xffffff).toString(16));
						chartDataUpdater(numPerEmotes,emoteString)
					})
					if (mitem?.diaryEmoteDust!=null && mitem?.diaryEmoteDust!==''){
						chartDataUpdater(item,mitem?.diaryEmoteDust)
						chartDataUpdater(numPerEmoteDusts,mitem?.diaryEmoteDust)
						if(emoteDustKeys.find(item=>item==mitem?.diaryEmoteDust)!=null) return;
						emoteDustKeys.push(mitem?.diaryEmoteDust);
						let colorcode = Math.round(Math.random()*0xffffff).toString(16);
						while (colorcode.length < 6)
						colorcode = '0' + colorcode;
						emoteDustColors.push("#"+colorcode);
					}
				});
				
			})
			//console.log(weeklyDatas);

			const chartLabel = [Object.keys(numPerEmotes), Object.keys(numPerEmoteDusts),emoteDustKeys,emoteDustColors];
			const chartData = [chartLabel[0].map(key => numPerEmotes[key]), chartLabel[1].map(key => numPerEmoteDusts[key]),weeklyDatas] ;
			setChartData(chartData);
			setChartLabel(chartLabel);
			if (!__rd) {Redraw(true);console.log('Redraw');}

		})
	},[__rd]
	)

	// ---------------- Anims -------------------

	const [swipeState,setSwipeState] = useState(true); // true = down , false = up

	const onSwipeUp = (gestureState) => { console.log('up'); setSwipeState(false) }
	const onSwipeDown = (gestureState) => { console.log('down'); setSwipeState(true) }

	const animModifier = useSharedValue(0);

	const ChartViewMargins = 242.5;
	const DefaultCommentViewHeight = 70;
	const DefaultChartViewHeight = ScreenHeight-ChartViewMargins-DefaultCommentViewHeight;

	useEffect(()=>{
		animModifier.value=swipeState?0:390;
	},[swipeState])

	const sharedEasing= {
		duration: 600,
		easing: Easing.bezier(0.25, 0.1, 0.25, 1),
	};

	const animatedChartViewStyles = useAnimatedStyle(() => {
		return { height: withTiming(DefaultChartViewHeight-animModifier.value, sharedEasing), };
	});

	const animatedCommentViewStyles = useAnimatedStyle(() => {
		return { height: withTiming(DefaultCommentViewHeight+animModifier.value, sharedEasing), };
	});

	
	return (
		<GestureRecognizer style={{flex:1}}
		onSwipeUp={(state) => onSwipeUp(state)}
        onSwipeDown={(state) => onSwipeDown(state)}
		>

			<View style={[{flex:1, marginTop:-15, borderTopWidth:0}]}>

				{ /* Chart View */}
				<Animated.View style={[animatedChartViewStyles,{backgroundColor:'rgb(255,235,240)',marginTop:80}]} >

					{ /* Chart title */}
					<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:10,zIndex:2}}>
						<IconButton icon={'chevron-double-left'} size={20} onPress={()=>{
							const NV=MathFunc.clamp(TypeScrollIdx-1,0,MChartPageNum)
							setTypeScrollIdx(NV);
							
							TypeScrollRef.current.scrollTo({ x: (ChartPageWidth) * NV, y: 0, animated: true })
						}}/>
						<Text style={ReportStyle.TitleText}>{MChartPageLabel[TypeScrollIdx]}</Text>
						<IconButton icon={'chevron-double-right'} size={20} onPress={()=>{
							const NV=MathFunc.clamp(TypeScrollIdx+1,0,MChartPageNum);
							setTypeScrollIdx(NV);
							
							TypeScrollRef.current.scrollTo({ x: (ChartPageWidth) * NV, y: 0, animated: true })
						}}/>
					</View>
					
					{ /* Charts */ }
					<ScrollView horizontal={true} scrollEnabled={false} ref={TypeScrollRef} showsHorizontalScrollIndicator={false}>
						<ChartView chartData={statechartData[0]} chartLabel={statechartLabel[0]} labelSource={Images}/>
						<ChartView chartData={statechartData[1]} chartLabel={statechartLabel[1]} labelSource={EmoteDusts}/>
						<WeeklyChartView chartData={statechartData[2]} chartKeys={statechartLabel[2]} chartColors={statechartLabel[3]} labelSource={Images}/>
					</ScrollView>

					{ /* Buttons */ }
					<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10,zIndex:1}}>
						<IconButton icon={'chevron-left'} size={20} onPress={()=>{setCurrentDate(DateFunc.normalizeDate(currentDate.addDays(-2),false)); Redraw(false);}}/>
						<Text style={ReportStyle.ContentText}> {year}년 {month}월 </Text>
						<IconButton icon={'chevron-right'} size={20} onPress={()=>{setCurrentDate(DateFunc.normalizeDate(currentDate.addDays(31),false)); Redraw(false);}}/>
					</View>

					
				</Animated.View>


				{ /* Comments */ }
				<Animated.View style={[animatedCommentViewStyles]}> 
					<CommentView swipeState={swipeState}/>
				</Animated.View>
				
			</View>

		</GestureRecognizer>
	);
}

export default Report;
