import React, {useEffect, useState} from 'react';
import DefaultStyle from './Styles.js';
import DatePicker from 'react-native-date-picker'
import { StyleSheet, Button, Text, View, Platform,  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { createDrawerNavigator } from '@react-navigation/drawer';
//import { HeaderBackButton } from '@react-navigation/stack';
import Setup from './Setup.js';
import { BottomButton, GlobalGradientBG } from './GlobalComponent.js';
import { TouchableOpacity } from 'react-native-gesture-handler';


const AlarmStyle= StyleSheet.create({
	NormalText:{
		fontSize:24,
		fontFamily: 'Nolja',
	},

	NormalButton:{


	}
});


function Alarm( { navigation, route } ) {

	useEffect(() => {
		loadAlarmTime();
	},[]) //언 / 마운팅될때 호출 -> onChange에서 말고 이 시점에서 세이브 하도록
	
	const saveAlarmTime =  (time) => {
		AsyncStorage.setItem('AlarmTime', time.toUTCString(), () => {
			console.log(time+' 저장 완료');
		});
	}
		
	const loadAlarmTime =  () => {
		AsyncStorage.getItem('AlarmTime',(err, result) => {
			var date = new Date(result);
			console.log(date +' 로드 완료');
		
			setDate(date);
		});
	}
		
	const [date, setDate] = useState(new Date(1598051730000));

	return(
	<>
		<GlobalGradientBG>

		<View style={[DefaultStyle.container,{backgroundColor:'rgb(255,234,171)',borderWidth:1,borderRadius:5,borderColor:'black',marginHorizontal:30,marginTop:60,marginBottom:90}]}>
			
			{ /* Plain Text */}
			{/* <View style={{alignSelf:'flex-start',margin:20,flex:0.8}}>
				<Text style={AlarmStyle.NormalText}></Text>
			</View> */}
			<View style={{alignSelf:'flex-start',marginTop:20,marginHorizontal:30,flex:2}}>
				<Text style={AlarmStyle.NormalText}>오늘은 일기를</Text>
			</View>
			
			{/* Date Picker */}
			<View style={{flexDirection:'row',flex:6,alignItems:'center'}}>						
				<View style={{marginBottom:30, marginRight: 0, transform: [{ scale: 1.8, }]}}>
					<DatePicker style={{height:140, }} locale={'ko'} androidVariant={"nativeAndroid"} 
					date= {date} mode= "time" onDateChange={setDate}
					/>				
				</View>
			</View>

			{ /* Plain Text */}
			<View style={{alignSelf:'flex-end',marginHorizontal:20,flex:1}}>
				<Text style={AlarmStyle.NormalText}> 에 쓸래요! </Text>
			</View>

			{ /* Save Button */}
			<View style={{flex:1,marginBottom:10}}>
				<TouchableOpacity onPress={()=>{saveAlarmTime(date);}}>
					<Text style={{fontFamily: 'Nolja',fontSize:30}}>저장</Text>
				</TouchableOpacity>
			</View>
		</View>

		</GlobalGradientBG>

		{/* <Setup {...navigation}/> */}
		{/* <BottomButton onPress={()=>{}}/> */}
	</>
	);

}


export default Alarm;
