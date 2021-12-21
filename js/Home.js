import React , { useState , useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Report from './Report.js';
import { CalenderMain , Notes } from './Calender.js';
import Alarm  from './Alarm.js';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Animated , { useSharedValue, withTiming, useAnimatedStyle, Easing, useAnimatedScrollHandler } from 'react-native-reanimated';

import { View,StyleSheet, Dimensions, Button,TouchableOpacity,Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import DefaultStyle from './Styles.js';
import Setup from './Setup.js';

const Tab = createBottomTabNavigator();

// Move this to glob?
const { width, height } = Dimensions.get('screen');

// UNUSED
const S = StyleSheet.create({
	container: { flexDirection: 'row',
    position: 'absolute',
    bottom: 25,
    backgroundColor: "#182028",
    borderRadius: 25,
    marginHorizontal: width*0.1 },
	tabButton: { flex: 1, justifyContent: "center", alignItems: "center" }
});

// For making procedual btn  
const CustomTabBarBtn = (item) => {

	// TODO : Make Inactive / active state

	return (
		<View style={[{flex:1,alignItems:'center',margin:10}]}>
			<IconButton icon={item.icon} size={32} onPress={item.onPress} color='rgb(248,127,162)'/> 
		</View>
	)
}

// Center Button with scaling , UNUSED
const CenterButton = (props) => {


	//console.log(animatedStyles.);

	// Render 
	return (
		<Animated.View style={[props.bottomBttnProps.animviewStyles,{flex:1,alignItems:'center',margin:10}]}>

			<Animated.View style={[props.bottomBttnProps.animBtnStyles,{flex:1}]} >

				<IconButton style={{flex:1}}
				//onPress={toggleExpand} 
				icon='cog' size={32}/>

			</Animated.View>

		</Animated.View>
	);
}

// Tab Setup Btn , UNUSED
const BottomTabSetupBtn = (props) => {
	return(
		<View style={[{flex:1,alignItems:'center',margin:10}]}>
				
			<IconButton
			onPress={()=>{			
				props.navigation.toggleDrawer();
			}} 
			icon='cog' size={32}/>

		</View>
	)
}

// Custom Tab bar for non screen btn
const CustomTabBar = (props) =>{

	// Commented one is deep copy
	const PrevCalExpand = useRef(false);
	const PrevCalExpandInit = useRef(false);
	var routes = props.state.routes;//JSON.parse(JSON.stringify(props.state.routes));

	const mappedRoutes = routes.map((item)=>{	
		return ( 
			<CustomTabBarBtn {...item} key={item.name} bottomBttnProps={props.bottomBttnProps} 
			icon={Reflect.get(props.descriptors,item.key).options.tabBarIcon} 
			onPress={()=>{
				if(item.name=='CalenderMain'){
					if(PrevCalExpandInit.current){
						PrevCalExpandInit.current=false;
						props.centerExpand(PrevCalExpand.current);
					}
				}
				else{
					if(!PrevCalExpandInit.current){
						PrevCalExpandInit.current=true;
						PrevCalExpand.current=props.btnExpanded;
						
						console.log(props.btnExpanded);
						props.centerExpand(false);
					}
				}

				props.navigation.navigate(item.name)}} 
			/>
		);
	})

	return (
	<View style={{flexDirection:'row',alignItems:'center', justifyContent:'space-evenly', backgroundColor:'rgb(57,27,29)',height:55}}>
		
		{/* Custom Order */}
		{mappedRoutes[0]}
		{mappedRoutes[1]}
		{/* <CenterButton {...props}/> */}
		{mappedRoutes[2]}
		{/* <BottomTabSetupBtn {...props}/> */}

	</View> 
	);
}


// Main Render

function Home( props ) {
    
	const [btnExpanded, setBtnExpand] = useState(false);	

	const animHeight = useSharedValue(40);
	const animY = useSharedValue(0);

	const animSize = useSharedValue({X:1,Y:1});
	//const animSize = useRef(new Animated.Value(20)).current;
	
	const defAnimSetting = {
		duration: 500,
		easing: Easing.bezier(0.25, 0.1, 0.25, 1),
	};

	// Container anim
	const animatedStyles = useAnimatedStyle(() => {
		
		return {
			height: withTiming(animHeight.value, defAnimSetting),
			transform: [ {translateY: withTiming(animY.value, defAnimSetting)} ],
		};
	});

	// Btn anim
	const animatedBtnStyles = useAnimatedStyle(() => {
		
		return {
			transform: [
				{scaleX: withTiming(animSize.value.X,defAnimSetting)},
				{scaleY: withTiming(animSize.value.Y,defAnimSetting)},
			],
		};
	});

	useEffect(()=>{
		animHeight.value = !btnExpanded?40:80;					
		animSize.value= !btnExpanded?{X:1,Y:1}:{X:2,Y:2};	
		animY.value = !btnExpanded?0:-30;
	},[btnExpanded]
	)




	return (
  
		<>
      
		<Tab.Navigator 
		tabBar={
			//props => <View></View>
			props => <CustomTabBar {...props} 
			centerExpand={setBtnExpand} btnExpanded={btnExpanded}
			bottomBttnProps={{animviewStyles: animatedStyles, animBtnStyles: animatedBtnStyles}}
			/>
		} 	
		screenOptions={{headerShown:false, headerRight:(headerprops=><IconButton icon='cog' size={30} color='rgb(83,51,62)' onPress={()=>{
			props.navigation.toggleDrawer()
		}}/>) , 
		headerShadowVisible:false, headerStyle:{height:50,backgroundColor:'rgb(251,191,191)'},headerTitleStyle:[DefaultStyle.NoljaFont,{fontSize:24}]
		}} 
		initialRouteName={'CalenderMain'}  
		//activeColor="#003319" inactiveColor="#61574D" make this styling
		>
			{/* <Tab.Screen name="CalenderMain" component={CalenderMain} options={{ tabBarIcon:"calendar-plus"}} initialParams={{centerExpand:setBtnExpand}}/> */}

			<Tab.Screen name="CalenderMain"  options={{ title:" 감정일기", tabBarIcon:"calendar-plus", headerShown:true}}>
				{(props)=> <CalenderMain {...props} centerExpand={setBtnExpand} />}
			</Tab.Screen>
			<Tab.Screen name="Alarm" component={Alarm} options= {{ title:" 알람설정", tabBarIcon :"clock", headerShown:true}} />
			<Tab.Screen name="Report" component={Report} options={{ title:" 통계", tabBarIcon: "chart-bar" , headerShown:true}}/>
			

		</Tab.Navigator>
		
		</>

  );
}
export default Home;


