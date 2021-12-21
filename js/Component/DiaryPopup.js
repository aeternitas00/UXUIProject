import React, { setState, useState, useRef, Component, useEffect  } from 'react';
import DefaultStyle from '../Styles.js';

import { Image, StyleSheet,TouchableOpacity, Button, Text, View, FlatList , ScrollView,  Dimensions, } from 'react-native';
import { DefaultTheme, Portal, TextInput , Button as PaperButton , IconButton } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated , { useSharedValue, withTiming, useAnimatedStyle, Easing, useAnimatedScrollHandler } from 'react-native-reanimated';

import Images from '../../assets/emotes';
import EmoteDusts from '../../assets/emotedusts';
import { DateFunc } from '../lib/Funclib.js';
import ChatBot from 'react-native-chatbot';
import { DrawerLayoutAndroid } from 'react-native-gesture-handler';
// useRef 사용 + 서브 컴포넌트 셀렉션 편의를 위해 클래스로 만듬
export default class DiaryPopup extends Component {

	constructor(props) {
		super(props);
		this.setPopupMode = this.setPopupMode.bind(this);
		this.setDate = this.setDate.bind(this);
		this.RenderEmote = this.RenderEmote.bind(this);
		//this.TestView = this.TestView.bind(this);
		this.Popup_WriteDiary = this.Popup_WriteDiary.bind(this);
		this.Popup_EmoteSelector = this.Popup_EmoteSelector.bind(this);
		this.state = {
			popupVisible: 			false,
			isLoaded: 				false,
			PopupMode: 				'Popup_EmoteSelector',
			selectedDate: 			new Date(),
			selectedEmotes: 		[],
			setDateBtnWritten: 		()=>{},
		};

	}


	// Helper method for outer 

	updatePopupDate = (iDate,setWritten) =>
	{
		AsyncStorage.getItem('Diaries',(error,result)=>{
		
			const storedDiary = JSON.parse(result??'[]');
			
			const oldDiaryIdx = storedDiary.findIndex(item=>{
				return DateFunc.isSameDay((new Date(item.date)),iDate);
				}
			);
			
			if (oldDiaryIdx != -1) {this.setPopupMode('Popup_WriteDiary');}
			else {this.setPopupMode('Popup_EmoteSelector');}

			this.setState({...{selectedDate:iDate,isLoaded:!this.state.isLoaded,setDateBtnWritten:setWritten}});
			//this.setIsLoaded();
		})

		if (!DateFunc.isSameDay(iDate,this.state.selectedDate)){
			this.setState({...{popupVisible:true, selectedEmotes:[]}});
			return true;
		}
		else {this.setPopupVisibility(!this.state.popupVisible); return !this.state.popupVisible;}
	}

	// simple setter
	setPopupMode = (iMode) =>
	{
		this.setState({...{PopupMode:iMode}});
	}

	setPopupVisibility = (inBool) =>
	{
		this.setState({...{popupVisible:inBool}});
	}

	setDate = (iDate) =>
	{
		this.setState({...{selectedDate:iDate}});
	}
	
	setIsLoaded = (iloaded) =>
	{
		this.setState({...{isLoaded:iloaded}});
	}

	// Mode 'Popup_WriteDiary'
	Popup_WriteDiary = ( { navigation } ) => {

		const EmoteDustsEntry = useRef(Object.entries(EmoteDusts));
		const [DiaryText, setDiaryText] = useState("");
		const DiaryEmotes = useRef([]);
		const [SelectorExpand,setSelectorExpand]= useState(false);
		const Partial= useRef([]);

		// Manual Reload
		useEffect( ()=>{

			//시점 파악이 제일 간단해서 여기에 사용함
			AsyncStorage.getItem('Diaries',(error,result)=>{
			
			let storedDiary = [];
			let oldDiaryIdx = -1;
			let SavedDiaryEmoteImages;
			if(result!=null){
				storedDiary = JSON.parse(result);
				
				oldDiaryIdx = storedDiary.findIndex(item=>{
					return (DateFunc.isSameDay(new Date(item.date),this.state.selectedDate));
					}
				);
			
			}
			

			if (oldDiaryIdx != -1) {
				setDiaryText(storedDiary[oldDiaryIdx].diaryText);
				DiaryEmotes.current=(storedDiary[oldDiaryIdx].diaryEmote);
			}

			SavedDiaryEmoteImages = (oldDiaryIdx==-1?this.state.selectedEmotes:storedDiary[oldDiaryIdx].diaryEmote).map((value)=>{
				return (<Image style={{width: 35, height: 35, }}source={Reflect.get(Images,value)} key={value}/> );
			});

			let counter = 0;
			Partial.current = [];
			while( SavedDiaryEmoteImages.length>=counter  )	{
				Partial.current.push(<View style={{flexDirection:'row'}}>{SavedDiaryEmoteImages.slice(counter,counter+6)}</View>);
				counter+=6;
			}

			this.setIsLoaded(true);
		})
		},[this.state.isLoaded]);


		// Anims
		const animScaleX = useSharedValue(1);
		const animScaleY = useSharedValue(0.5);
		const animOffsetY = useSharedValue(880);

		useEffect(()=>{
			animScaleX.value=this.state.popupVisible?1:1; 
			animScaleY.value=this.state.popupVisible?1:0.5;
			animOffsetY.value=this.state.popupVisible?0:880;
		}
		, [this.state.popupVisible] );

		const animScaleStyles = useAnimatedStyle(() => {
			
			return {
				transform:[{scaleX: withTiming(animScaleX.value, {
					duration: 500,
					easing: Easing.bezier(0.25, 0.1, 0.25, 1),
				  }),},
				  {scaleY: withTiming(animScaleY.value, {
					duration: 500,
					easing: Easing.bezier(0.25, 0.1, 0.25, 1),
				  }),},
				  {translateY: withTiming(animOffsetY.value, {
					duration: 500,
					easing: Easing.bezier(0.25, 0.1, 0.25, 1),
				  }),},
				],
			};
		});

		const animHeightSub = useSharedValue(0);

		useEffect(()=>{
			animHeightSub.value=SelectorExpand?170:0;
		}
		, [SelectorExpand] );

		const animSubStyles = useAnimatedStyle(() => {
			
			return {
				height: withTiming(animHeightSub.value, {
					duration: 300,
					easing: Easing.bezier(0.25, 0.1, 0.25, 1),
				}),
			};
		});
		
		// Chatbot Props
		const ChatbotTitle = () => {
			return (
				<View style={{alignSelf:'stretch',alignItems:'center',marginBottom:15,	}}>
					
					<View style={{flexDirection:'row',alignSelf:'flex-end'}}>

						<View>

							<TouchableOpacity onPress={()=>{
								this.setState({...{PopupMode:'Popup_EmoteSelector',selectedEmotes:DiaryEmotes.current}});
							}}>

							<View style={{marginBottom:7.5, padding: 7,width:Dimensions.get('window').width*0.60, backgroundColor:'rgb(255,234,171)',
							borderRadius:10, borderBottomRightRadius:0}}>
								
								<Text style={{fontFamily:'Nolja',fontSize:15}}> 오늘은 무슨 일이 있었나요? </Text>

								<View style={{marginHorizontal:10,marginTop:7.5}}> 
									{
										DiaryEmotes.current.length==0 || DiaryEmotes.current == null ?
										
										<View style={{flex:1, justifyContent:'center', alignItems:'center',flexDirection:'row',opacity:0.5}}>
											<Image style={{width: 35, height: 35, marginRight: 10}} source={require('../../assets/emotedusts/emotedust_9.png')}/>
											<Text style={[DefaultStyle.NoljaFont,{fontSize:14,alignSelf:'center'}]} >
												내용이 없어요!
												{'\n'} 
												클릭하여 추가해 주세요
											</Text>
										</View>

										:
										
										// 스크롤 내에 플랫리스트 사용 불가능해 수동으로 만듬.
										<>
										{Partial.current}						
								
										<View style={{flex:1, marginTop:10, justifyContent:'center', alignItems:'center',flexDirection:'row',opacity:0.5}}>
											<Image style={{width: 35, height: 35, marginRight: 10}} source={require('../../assets/emotedusts/emotedust_none.png')}/>
											<Text style={[DefaultStyle.NoljaFont,{fontSize:14,alignSelf:'center'}]} >
												클릭하여 추가할 수 있어요
											</Text>
										</View>										
										</>
									}
								</View>

							</View>

							</TouchableOpacity>

							<View style={{marginVertical:7.5,padding: 7,width:Dimensions.get('window').width*0.60, backgroundColor:'rgb(255,234,171)',
							borderRadius:10, borderTopRightRadius:0}}>
								<Text style={{fontFamily:'Nolja',fontSize:15}}> 간단한 메모 </Text>
								<View style={{marginLeft:10, flexDirection:'row',marginTop:7.5,marginBottom:2.5}}> 
									<Text style={{fontFamily:'Nolja',color:'rgb(142,110,111)',fontSize:17}}> {(DiaryText.length==0||DiaryText==="")?'[ 내용이 없어요! ]':DiaryText} </Text>
								</View>
							</View>
						</View>

						<View style={{alignSelf:'flex-end',marginBottom:0,marginLeft:5,}}>
							<Image style={{width:80,height:80,marginBottom:-5,marginRight:-4}} 
								source={require('../../assets/emotedusts/emotedust_2.png')}
							/> 
						</View>
					</View>	
				</View>)
		}

		const steps = [
			{
				id: '0',
				component: (
					<ChatbotTitle/>
				),
				trigger: '1',
			},
			{
				id: '1',
				message: '오늘의 피드백\n\n 사용자님,오늘은 기쁜 날이었군요!\n ...[Feedback goes here]',
				trigger: '10',
			},
			{
				id: '2',
				message: 'Memo Saved!',
				// component: (<SimpleSaver value={'text'}/>),
				trigger: '3',
			},
			{
				id: '3',
				message: 'Memo Saved!',
				trigger: '10',
			},			
			{
				id: '4',
				message: 'Error! ( Empty input )',
				trigger: '10',
			},		
			{
				id: '10',
				user:true,
				trigger: ({value})=>{
									
					if (value==null || value==='') return '4';
					AsyncStorage.getItem('Diaries',(error,result)=>{

						var SavingDatas=[];

						if(result!=null){
							const storedDiary = JSON.parse(result);
							
							const oldDiaryIdx = storedDiary.findIndex(item=>{
								
								return ((new Date(item.date)).toDateString()==this.state.selectedDate.toDateString());
								}
							);
							
							if (oldDiaryIdx != -1) storedDiary[oldDiaryIdx].diaryText+=(value + '\n');

							SavingDatas=storedDiary;

							AsyncStorage.setItem('Diaries',JSON.stringify(SavingDatas),(error)=>{error?console.log(error):{}});
							
						}
						else{
							console.log('invalid saving data');
						}

					})

					return '3';
				},
			},
		];

		return (
	
		
		<Animated.View style={[animScaleStyles,{width:Dimensions.get('screen').width,alignSelf:'center',flex:1,
		transform: [{scaleY:0.5},{translateY:880}],backgroundColor:'rgb(255,235,240)',
		borderTopLeftRadius:10 ,borderTopRightRadius:10}]}>
			
			<ChatBot

			width={Dimensions.get('screen').width-4} 
			contentStyle ={{backgroundColor:'rgb(255,166,175)'}} 
			customStyle={{backgroundColor:'transparent',borderWidth:0,marginTop:-10,marginBottom:-20,marginLeft:-10,marginRight:-10}}  
			style={{flex:1, borderTopLeftRadius: 10,borderTopRightRadius: 10,backgroundColor:'rgb(255,166,175)'}} steps={steps} 
			
			headerComponent={
				<Text style={{fontFamily:'Nolja',fontSize:23,marginVertical:10, alignSelf:'center'}}>
					{this.state.selectedDate.getFullYear()}. {this.state.selectedDate.getMonth()+1}. {this.state.selectedDate.getDate()} {DateFunc.weekMap[this.state.selectedDate.getDay()].string}
				</Text>
			}

			botFontColor={'rgb(82,52,64)'} userFontColor={'black'}
			bubbleFontStyle={{fontFamily:'Nolja',fontSize:16,fontColor:'black'}}
			bubbleStyle={{backgroundColor:'rgb(255,203,76)'}} keyboardVerticalOffset={24}	
			botBubbleColor={'rgb(255,234,171)'} userBubbleColor={'rgb(255,234,171)'}

			avatarStyle={{width:80,height:80,marginVertical:-20,marginHorizontal:-5}} 	
			botAvatar={require('../../assets/emotedusts/emotedust_bot.png')}
			userAvatar={require('../../assets/emotedusts/emotedust_2.png')}

			footerStyle={{backgroundColor:'white'}}
			inputStyle={{fontFamily:'Nolja',fontSize:18}}
			submitButtonStyle={{backgroundColor:'rgb(163,79,115)',fontFamily:'Nolja',fontSize:30,fontColor:'white',}}
			submitButtonContent='올리기'
			placeholder={'오늘의 일기를 기록해주세요!'} 
			onEmoteButtonPressed={()=>{
				console.log('emote')
				setSelectorExpand(!SelectorExpand);
			}}
			emoteButtonImage={Reflect.get(EmoteDusts,'emotedust_picker')}


			key={this.state.selectedDate.toDateString()+DiaryText} // redraw
			customDelay={0} botDelay={0} userDelay={0} 
			
			/>



			<Animated.View 
			//contentContainerStyle={{alignItems:'center', }}
			style={[animSubStyles,{shadowOpacity:0, position: 'absolute', bottom:0, alignSelf:'center', 
			width:Dimensions.get('screen').width,
			zIndex:1, backgroundColor:'rgba(255,255,255,0.9)', transform:[{translateY:-50},]}]}>
	
				<FlatList style={{alignSelf:'stretch', marginTop:7.5, marginHorizontal:7.5, flexDirection:'column'}} 
				data={EmoteDustsEntry.current} keyExtractor={item=>item[0]}
				numColumns={5} scrollEnabled={true} showsVerticalScrollIndicator={true}

				ListHeaderComponent={<Text style={{alignSelf:'center',fontFamily:'Nolja',fontSize:20,}}>감정먼지 선택</Text>}

				renderItem={({item, index, separators}) => 
				<View style={{flex:1,alignItems:'center',paddingVertical:0}}>
					<TouchableOpacity
						onPress={()=>{
							console.log(item[0]);
							const SaveData = {
								diaryEmoteDust: item[0],
							};
							
							AsyncStorage.getItem('Diaries',(error,result)=>{
								if(result!=null){
									const storedDiary = JSON.parse(result);
									
									const oldDiaryIdx = storedDiary.findIndex(item=>{
										return ((new Date(item.date)).toDateString()==this.state.selectedDate.toDateString());
										}
									);
									
									if(oldDiaryIdx != -1) {										
										storedDiary[oldDiaryIdx].diaryEmoteDust=SaveData.diaryEmoteDust;
										const SavingDatas = storedDiary;
										AsyncStorage.setItem('Diaries',JSON.stringify(SavingDatas),(error)=>{error?console.log(error):{}});
										this.state.setDateBtnWritten(true);
									}
								}
							})
						}}
						><Image source={item[1]} style={{width: 70, height: 70}}/>
					</TouchableOpacity>
				</View> 
				}
				/>

			</Animated.View>
		
		</Animated.View>
	
		);
	}
	


	RenderEmote = ( {item,PopupSelectedEmotes} ) => {
		const [isSelected,setIsSelected] = useState(false);
		//useEffect(()=>{console.log('EmoteSelectBtn Mount')},[]);
		const bttnProp = useRef(DefaultStyle.EmoteButton);

		useEffect( ()=>{
			// console.log(this.state.selectedEmotes)
			const foundIdx=this.state.selectedEmotes.findIndex(loopitem=>{
				
				return (loopitem===item[0])
			})
			foundIdx==-1? setIsSelected(false):setIsSelected(true);
		},[])

		useEffect( ()=>{
			bttnProp.current=isSelected?DefaultStyle.EmoteButton:DefaultStyle.SelectedEmoteButton;
		}
		,[isSelected])
	  	return (
		<View style={[bttnProp.current,{marginHorizontal:10,marginBottom:15}]}>
			<TouchableOpacity style={bttnProp.current} 
			onPress={()=>{
				//console.log(this.state.selectedEmotes);
				setIsSelected(!isSelected);
				
				if (!isSelected) PopupSelectedEmotes.current.push(item[0])
				else { 
					const idx = PopupSelectedEmotes.current.indexOf(item[0])
					PopupSelectedEmotes.current.splice(idx,1) 
				}

				// this.setState({...{selectedEmotes:[item[0]]}});

			}}>
				<Image source={item[1]} style={{width: 50, height: 50}}/>
			</TouchableOpacity>
		</View>
	 	)
	}


	// EmoteSelector - TODO :: Multi Select?

	Popup_EmoteSelector = ( { navigation } ) => {

		// const [emoteExpand, setemoteExpand] = useState(false);			
		const RenderEmote = this.RenderEmote;
		const PopupSelectedEmotes = useRef([]);

		const result = useRef(Object.entries(Images));

		// const ExpandEmotePopup = (ib)=>{
		// 	animHeight.value = ib?360:120;
		// 	setemoteExpand(ib);
		// 	if(ib){

		// 	}
		// }

		// const animScaleX = useSharedValue(1);
		// const animScaleY = useSharedValue(1);
		const animOffsetY = useSharedValue(390);
		// const animHeight = useSharedValue(360);

		useEffect(()=>{
			// animScaleX.value=this.state.popupVisible?1:0.5; 
			// animScaleY.value=this.state.popupVisible?1:0.5;
			animOffsetY.value=this.state.popupVisible?0:390;
			// animHeight.value = this.state.popupVisible?360:120;
			//if(this.state.popupVisible==false )ExpandEmotePopup(false);
		}
		, [this.state.popupVisible] );

		useEffect(()=>{
			//console.log('ref clear')
			PopupSelectedEmotes.current.splice(0,PopupSelectedEmotes.current.length);
			PopupSelectedEmotes.current.push(...this.state.selectedEmotes);
		}
		)

		const animScaleStyles = useAnimatedStyle(() => {
			
			return {
				transform:[//{scaleX: withTiming(animScaleX.value, {
				// 	duration: 500,
				// 	easing: Easing.bezier(0.25, 0.1, 0.25, 1),
				//   }),},
				//   {scaleY: withTiming(animScaleY.value, {
				// 	duration: 500,
				// 	easing: Easing.bezier(0.25, 0.1, 0.25, 1),
				//   }),},
				  {translateY: withTiming(animOffsetY.value, {
					duration: 500,
					easing: Easing.bezier(0.25, 0.1, 0.25, 1),
				  }),},
				],
			};
		});

		// const animatedStyles = useAnimatedStyle(() => {
			
		// 	return {
		// 		height: withTiming(animHeight.value, {
		// 			duration: 1000,
		// 			easing: Easing.bezier(0.25, 0.1, 0.25, 1),
		// 		  }),
		// 	};
		// });

		return (
		<Animated.View style={[{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'flex-end',bottom:10}]}>
	
			<Animated.View style={[animScaleStyles,{height:360,backgroundColor:'rgb(255,234,171)',borderColor:'black',borderRadius:6,borderWidth:2,width:340,marginBottom:10,}]}>

				<View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
						<Text style={{fontSize:25,marginTop:15,marginBottom:12, fontFamily: 'Nolja',}}>
						오늘은 무슨 일이 있었나요?
						</Text>
					
						<IconButton icon="pencil" size={22} style={{left: 30, marginTop:-5,marginBottom:-7,marginHorizontal:-10}} 
						onPress={()=>{
							//console.log(PopupSelectedEmotes.current)
							const SaveData = {
								date: this.state.selectedDate,
								bIsWritten: true,
								diaryEmote: PopupSelectedEmotes.current,
								diaryText: "",
								diaryFeed: "",
								diaryEmoteDust: '',
							};
							
							AsyncStorage.getItem('Diaries',(error,result)=>{
		
								var SavingDatas=[];
		
								if(result!=null){
									const storedDiary = JSON.parse(result);
									
									const oldDiaryIdx = storedDiary.findIndex(item=>{
										
										return ((new Date(item.date)).toDateString()==SaveData.date.toDateString());
										}
									);
									
									if(oldDiaryIdx == -1) storedDiary.push(SaveData) 
									else{										
										storedDiary[oldDiaryIdx].diaryEmote=SaveData.diaryEmote;
									} 
		
									SavingDatas=storedDiary;
								}
								else{
									SavingDatas=[SaveData];
								}
		
								AsyncStorage.setItem('Diaries',JSON.stringify(SavingDatas),(error)=>{error?console.log(error):{}});
								this.state.setDateBtnWritten(true);
								this.setState({...{PopupMode: 'Popup_WriteDiary',selectedEmotes: PopupSelectedEmotes.current}});
							})
		

							
						}}/>
				</View>	

				{/* {emoteList.current} */}

				<FlatList style={{flex:0.9,marginTop:7.5, marginHorizontal:7.5, flexDirection:'column'}} 
				data={result.current} 
				renderItem={({item, index, separators}) => <RenderEmote item={item} PopupSelectedEmotes={PopupSelectedEmotes}/> }
				keyExtractor={item=>item[0]}
				numColumns={4}
				scrollEnabled={true}
				showsVerticalScrollIndicator={true}
				key={Math.random().toString()} // this line makes redraw to initalize scroll pos
				/>
				
				
				{/* Expander 기능 삭제
				
				<View style={{flex:0.1,justifyContent:'flex-end',alignItems:'center'}}>
					<IconButton style={{marginBottom:0,transform:[{scaleX:1.3}]}} size={18}
					icon = {emoteExpand ? "chevron-up" : "chevron-down"}
					onPress={()=> {
						ExpandEmotePopup(!emoteExpand);						
					}}/>
				</View> */}

			</Animated.View>
	
		</Animated.View>
		);
	}

	// Render

	render() {	
		const Mode = Reflect.get(this,this.state.PopupMode);
		
		return (
		<View {...this.props} style={[this.props.style,{width:Dimensions.get('window').width,alignSelf:'center', //borderWidth:1,borderColor:'red'
		},
		{/*opacity:this.state.popupVisible ? 1 : 0*/}
		]}>
			<Mode navigation={this.props.navigation} />
		</View>
		 );
		 
	}
  }
