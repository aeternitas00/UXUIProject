// B577028 

// 


import React, { useState, setState, useEffect, useRef } from 'react';
import Home from './js/Home.js';
import {WriteDiary, DiaryDatePick} from './js/WriteDiary.js';
import { StyleSheet, Button, Text, View, BackHandler, Platform, SafeAreaView, Dimensions, Switch } from 'react-native';
import { DefaultTheme, Provider as PaperProvider , Button as PaperButton } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {  createDrawerNavigator,  DrawerContentScrollView,  DrawerItemList,  DrawerItem,} from '@react-navigation/drawer';
import { ShareDialog } from './js/Share.js';
import SwitchToggle from "react-native-switch-toggle";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawerItem(props) {

    const [ok,setOK] = useState(false);
	const toggleSwitch = () => {setOK(previousState => !previousState); AsyncStorage.setItem(props.name, (!ok).toString() );}

	const loadSetting = (propname)=>{
		AsyncStorage.getItem(propname,(err, result) => {
			
			var data = JSON.parse(result);
			//console.log(data);
			
			setOK(data);
		});
	};

	useEffect(() => {
		loadSetting(props.name);
	},[]) //언 / 마운팅될때 호출 -> onChange에서 말고 이 시점에서 세이브 하도록
	
    return (
		<View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',marginBottom:-5}}>
			<DrawerItem  {...props} style={{flex:1}} labelStyle={{fontFamily: 'Nolja',fontSize:18}}
			onPress={() => {toggleSwitch(); if (props.onPress) props.onPress();}}
			/>

			<View style={{position:'absolute', right:20,borderWidth:3,borderColor:'rgb(101,41,41)',borderRadius:5}}>
				<SwitchToggle 
					backgroundColorOn='rgb(255,234,171)'
					backgroundColorOff='rgb(101,41,41)'
					circleColorOff='rgb(255,234,171)'
					circleColorOn='rgb(101,41,41)'
					containerStyle={{ width: 48,height: 23,padding:2,borderRadius:3,margin:-0.5}}
					circleStyle={{ width: 20,height: 19,borderRadius:3}}
					onPress={toggleSwitch}
					switchOn={ok}
				/>
			</View>
        {/* //style={[props.style,{backgroundColor : ok ? 'gray':'transparent' }]} */}
     	
		</View>
	)
}


function CustomDrawerContent(props) {

	return (
		<View style={{flex: 1,backgroundColor:'rgb(248,158,160)'}} forceInset={{top: 'always', horizontal: 'never'}}>
			<DrawerContentScrollView {...props}>
					
				<DrawerItem
					label=">   설정" labelStyle={{fontFamily: 'Nolja', left:0, alignSelf:'flex-start',fontSize:18}}
					onPress={() => props.navigation.closeDrawer()}
				/>
				
				<MyDrawerItem label='잠금설정' name='LockMode' onPress={()=>{}}/>
				<MyDrawerItem label='진동모드' name='SilentMode' onPress={()=>{}}/>
				<MyDrawerItem label='다크모드' name='DarkMode' onPress={()=>{}}/>
				{/* <Text style={{alignSelf:'center'}}> ------ DEV TEST ------ </Text> */}
				{/* { <DrawerItemList {...props} /> } */}
				{/*--- no default tabs*/}

			</DrawerContentScrollView>

			<View>
				<DrawerItem labelStyle={{fontFamily: 'Nolja', paddingLeft:27, alignSelf:'center',fontSize:22}}
					label="공유하기" onPress={() => {}} style={{borderBottomWidth:1,marginVertical:0}}
				/>
				<DrawerItem labelStyle={{fontFamily: 'Nolja',paddingLeft:27, alignSelf:'center',fontSize:22}}
					label="문의하기" onPress={() => {}} style={{borderBottomWidth:1,marginVertical:0}}
				/>
				<DrawerItem labelStyle={{fontFamily: 'Nolja',paddingLeft:27, alignSelf:'center',fontSize:22}}
					label="어플정보" onPress={() => {}} style={{borderBottomWidth:1,marginVertical:0}}
				/>
				<DrawerItem labelStyle={{fontFamily: 'Nolja',paddingLeft:27, alignSelf:'center',fontSize:22}}
					label="초기화" onPress={() => {AsyncStorage.clear()}} style={{marginVertical:0}}
				/>
			</View>
		</View>
		

	);

}

function MyDrawer() {

	return (
		<Drawer.Navigator screenOptions={{drawerPosition:'right', overlayColor:'transparent',
		gestureEnabled:false,drawerStyle:{width:172,height:Dimensions.get('window').height-79,}}}
		drawerContent={(props) => <CustomDrawerContent {...props} />}
		>
			<Drawer.Screen name="Home" component={Home} options={{headerShown:false}} />
			<Drawer.Screen name="ShareDialog" component={ShareDialog} options={{headerShown:false}} />
			<Drawer.Screen name="DiaryDatePick" component={DiaryDatePick} options={{headerShown:false}} />

		</Drawer.Navigator>
	);
}

function App() {
	const [loaded] = useFonts({
		Nolja: require('./assets/fonts/nolja.ttf'),
	});
		
	useEffect(()=>{
		//just rd
		setModalVisible(modalVisible);
	},[loaded])

	const [modalVisible, setModalVisible] = useState(false);

	var tempToggle = () => {
		setModalVisible(!modalVisible);
	}

	return (
		
		<GestureHandlerRootView style={{flex:1}}>
			<PaperProvider>
				<SafeAreaView style={{paddingTop: Platform.OS === "android" ? 24 : 0,flex:1, }}>
					<NavigationContainer>
						<MyDrawer/>
					</NavigationContainer>
				</SafeAreaView>
			</PaperProvider>
		</GestureHandlerRootView>
	);
}

export default App;
