import React , {useEffect, useState} from 'react';
import DefaultStyle from './Styles.js'
import { StyleSheet, Button, Text, View, TextInput,TouchableOpacity  } from 'react-native';
import { IconButton } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';


// Deprecated
export const WriteDiary = ( props ) => {

  return (
    <View style={DefaultStyle.container}>
      <Text>WriteDiary 

        Image upload... etc 
      </Text>
      
      <Button title="Complete" 
        onPress={()=> {
          props.navigation.goBack(null);
        }} />
    </View>
  );
}

export const DiaryDatePick = ( { navigation, route } ) => {
	
	const [date, setDate] = useState(new Date());
	
	function CloseButton(navigation) {
		return (
		<View style={{position: 'absolute', flex : 1,zIndex: 1,right: 5, top: 5,
		}} 
		pointerEvents='box-none'
		>
	  
			<IconButton style={{zIndex: 1}} 
			icon="window-close" size={30} color={'rgb(90,13,33)'} onPress={() => {

				// Closing too fast makes unchanged data goes in. have to fix this.
				navigation.navigate('Home',{screen:'CalenderMain', params:{navigation:navigation, route:route, date:date}});
				route.params.redrawCall();
				//console.log(route.params);
			}} />
	  
		</View>
		);
	  }

	return(
	<>
		<View style={{flex:1, backgroundColor:'rgb(155,109,109)'}}>
			
			<View style={[{flex:1,justifyContent:'center',marginHorizontal:30,marginTop:60,marginBottom:100}]}>
				
				<View style={{alignSelf:'flex-start',marginVertical:20,marginHorizontal:10}}>
					<Text style={{fontSize:30, fontFamily:'Nolja',color:'rgb(90,13,33)'}}>날짜 선택</Text>
				</View>

				<View style={[{borderRadius:5,borderWidth:2,flex:1,backgroundColor:'rgb(255,234,171)'}]}>
					<View style={[DefaultStyle.content,{transform: [{ scale: 1.5, }]}]}>
						<DatePicker style={{height:150,alignSelf:'center' }} locale={'ko'} androidVariant={"nativeAndroid"}
						date= {date} mode= "date" onDateChange={setDate} 
						/>				
					</View>
				</View>
			</View>
		</View>

		<CloseButton {...navigation} />
	</>
	);
}
//export default WriteDiary;
