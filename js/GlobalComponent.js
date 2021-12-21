import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { View, Dimensions,} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Deprecated
export function BottomButton (props) {
	return (
	<View style={{position:'absolute',alignSelf:'center'}}>
		<PaperButton style={{bottom:-1*(Dimensions.get('window').height-112), alignSelf:'center',borderWidth:1, borderColor: 'black',}}
		contentStyle={{height:30,width:60}} color={'#54604C'}
		onPress = {props.onPress} mode='contained'>

		</PaperButton>
	</View>
	);
}

// Deprecated but will be changed
export function GlobalGradientBG (props)
{
	return (
		<View style={[props.style,{flex:1,borderRadius:0,backgroundColor:'rgb(251,191,191)'}]}>
			<LinearGradient colors={['rgb(255,235,240)', 'rgb(255,235,240)']} style={[props.innerStyle,{flex:1,borderTopRightRadius:20,borderTopLeftRadius:20}]}>
			{props.children}
			</LinearGradient>
		</View>
	);
}

//export { BottomButton, GlobalGradientBG} ;