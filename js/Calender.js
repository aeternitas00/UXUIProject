import React, { useState, useRef, useEffect  } from 'react';
import DefaultStyle from './Styles.js';
import Setup from './Setup.js';

import { Image, StyleSheet,TouchableOpacity, Button, Text, View, Dimensions } from 'react-native';
import { DefaultTheme, Portal, TextInput , Button as PaperButton , IconButton } from 'react-native-paper';

import { GlobalGradientBG } from './GlobalComponent.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DiaryPopup from './Component/DiaryPopup.js'
import { DateFunc } from './lib/Funclib.js';

import { LogBox } from 'react-native';
import EmoteDusts from '../assets/emotedusts';
import ChatBot from 'react-native-chatbot';

LogBox.ignoreLogs([
 'Non-serializable values were found in the navigation state',
]);

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const DateBttnState = {
	DefaultState : 0,
	SelectedState : 1,
	WrittenState : 2,
}

// Date Button 
function DateButton(props){

	const [written, setbWritten] = useState(false);
	const [pressed, setPressed] = useState(false);
	const savedDate = useRef(props.date);
	const [savedDust,setSavedDust] = useState('');
	const [havetoReload, setReload] = useState(false);

	const getStateValue = ()=>pressed?DateBttnState.SelectedState:written?DateBttnState.WrittenState:DateBttnState.DefaultState;

	const setWritten = (i)=>{
		setbWritten(i);
		LoadData();
	}
	//const EmoteDustsEntry = useRef(Object.entries(EmoteDusts));

	const LoadData = ()=>{
		
		props.buttonsReloaders.current[props.item.index]=((newDate)=>{//console.log('Reload'); 
		savedDate.current = newDate; setReload(!havetoReload);});

		AsyncStorage.getItem('Diaries',(error,result)=>{
			
			var exist;
			if(result!=null){
				const storedDiaries = JSON.parse(result);
				const oldDiaryIdx = storedDiaries.findIndex(item=>((new Date(item.date)).toDateString()==savedDate.current.toDateString()));
				exist = (oldDiaryIdx != -1);
				if(exist) setSavedDust(storedDiaries[oldDiaryIdx].diaryEmoteDust??'emotedust_none')
			}
			if(!exist) setSavedDust('emotedust_blank');

			setbWritten(exist);
			//setSavedDate(item.date);
		});
	}

	useEffect(()=>{
		// LoadData();
		return ()=>{/*setButtonState(DateBttnState.DefaultState)*/};
	},[]
	);

	useEffect(()=>{
		// console.log('SetReload');
		LoadData();
		
		return ()=>{};
	},[havetoReload]
	);


	return(

		<View style={{alignItems:'center', justifyContent:'center'}} >
			
			<Text style={{fontFamily: 'Nolja',fontSize:17, color : props.item.color==null? 'black':props.item.color}} >
				{savedDate.current.getUTCDate()}
			</Text>
			
			<TouchableOpacity
				onBlur={()=>{console.log('hovered')}}
				onPress={() => {
					const rpressed = props.diaryPopupRef.current.updatePopupDate(savedDate.current,setWritten);
					
					setPressed(rpressed);
					props.centerExpand(rpressed);

					// 콜낭비 방지
					if(props.prevDateBttnSel.current!=setPressed) props.prevDateBttnSel.current(false);
					
					props.prevDateBttnSel.current=(setPressed);
					props.onPress(); 

				}} 
			>
				<Image style={{width:45,height:45}} source={Reflect.get(EmoteDusts,savedDust===''?"emotedust_none":savedDust)}/>
			</TouchableOpacity>

			<Text style={{fontFamily: 'Nolja',fontSize:17, color : props.item.color==null? 'black':props.item.color}} >
				{props.item.string}
			</Text>

		</View>
	);

}




// Tab screen
function CalenderMain( props ) {

	const DiaryPopupRef = useRef(null);
	
	const prevDateBtnHandle = useRef( (i) => {} );
	const buttonsReloaders = useRef([()=>{},]);
	
	const [__rd,__setRd] = useState(false);

	const Redraw = ()=>{__setRd(!__rd)};

	const [curDate,setCurDate] = useState(new Date());

	const refDateButtons = useRef(<View/>);

	const dateBttnGen = ()=>{
		// TODO : 년 단위로 미리 받아서.
		let curDay__ = curDate.getDay();

		return ( DateFunc.weekMap.map( (item,index)=> {
			//console.log('new Date buttn' + curDate);
			var loopDate = new Date(curDate);
			loopDate.setDate(curDate.getDate()-(curDay__--));
			item.index=index;
			return (
				<DateButton item={item} key={item.string} date={loopDate} diaryPopupRef={DiaryPopupRef} centerExpand={props.centerExpand} 
				prevDateBttnSel={prevDateBtnHandle} buttonsReloaders={buttonsReloaders} 
				onPress={()=>{
				}}
				/>
			)
			}
		)
		)
	}

	useEffect(()=>{
		refDateButtons.current = dateBttnGen();
		Redraw();
	}
	,[]);	

	useEffect(()=>{
		console.log('Calander redraw');

		const exp = props.route?.params?.date ?? curDate;

		setCurDate(exp);
	}
	,[__rd]);

	useEffect(()=>{
		DiaryPopupRef?.current.setPopupVisibility(false);
		props.centerExpand(false);

		prevDateBtnHandle.current(false);

		let curDay__ = curDate.getDay();
		
		buttonsReloaders.current.forEach((item)=>{
			//console.log(item);
			let loopDate = new Date(curDate);
			loopDate.setDate(curDate.getDate()-(curDay__--));
			item(loopDate);}
		)
	}
	,[curDate]);	

	return (
		<>
		
		<GlobalGradientBG>

			<View style={[{alignSelf:'center',justifyContent: 'center',flex:1, width:Dimensions.get('window').width-30}]}>

				{ /* Title */ }
				<View style={{flexDirection:'row',marginTop:5, alignSelf:'center', alignItems:'center'}}>
					<IconButton style={{marginVertical:-20}} icon='chevron-left' size={50} onPress={() => {
						setCurDate(curDate.addDays(-DateFunc.getLastDateofMonth(curDate)));
					}}/>
					<View style={{flexDirection:'column',alignItems:'center'}}>
						<Text style={[DefaultStyle.NoljaFont,{fontSize: 40,}]} >{curDate.getFullYear()}</Text>
						<Text style={[DefaultStyle.NoljaFont,{fontSize: 28, marginTop:-5,}]}>{DateFunc.monthMap[curDate.getUTCMonth()]}</Text>
						{/* <Text style={{fontSize: 18, fontStyle: 'italic',marginBottom:2}}>  {Math.floor(curDate.getUTCDate()/7 + 1)}주차</Text> */}
					</View>
					<IconButton style={{marginVertical:-20}} icon='chevron-right' size={50} onPress={() => {
						setCurDate(curDate.addDays(DateFunc.getLastDateofMonth(curDate)));
					}}/>
				</View>
				<View style={{marginTop:-30,left:10,flexDirection:'row-reverse', alignItems:'center', justifyContent:'flex-start'}}> 			
						<IconButton icon='arrow-down-drop-circle-outline' size={13} onPress={() => {
							// props.navigation.setParams({redrawCall:Redraw});
							// console.log(props.route.params);
							props.navigation.navigate('DiaryDatePick',{redrawCall:Redraw});
							
						}}/>
						<Text style={[DefaultStyle.NoljaFont,{fontSize: 16}]}>날짜 선택</Text>	
					</View>
				{ /* Date Buttons */ }
				<View style={{flexDirection:'row', marginTop:6, alignContent:'stretch',justifyContent:'space-between'}}>
					<IconButton style={{marginVertical:-20,marginHorizontal:-20,alignSelf:'center'}} icon='chevron-left' size={24} onPress={() => {
						setCurDate(curDate.addDays(-7));
					}}/>
					{refDateButtons.current}
					<IconButton style={{marginVertical:-20,marginHorizontal:-20,alignSelf:'center'}} icon='chevron-right' size={24} onPress={() => {
						setCurDate(curDate.addDays(7));
					}}/>
				</View>

				{ /* Popup */ }
				<DiaryPopup {...props.navigation} style={{flex:1,marginTop:10}} nativeID='Popup' ref={DiaryPopupRef}/>

			</View>

		</GlobalGradientBG>

		</>
	);
}

export { CalenderMain };
