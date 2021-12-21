import React, {useEffect, useState, useRef } from 'react';
import ViewPagerAndroid from 'react-native-pager-view';
import DefaultStyle from './Styles.js';
import { Image ,StyleSheet, Text, View, Platform, TouchableOpacity,  } from 'react-native';
import { Button as PaperButton ,IconButton  } from 'react-native-paper';
import { createNativeWrapper, DrawerLayoutAndroid } from 'react-native-gesture-handler';

const ShareStyle= StyleSheet.create({
	NormalText:{
		fontSize:18,
		fontFamily: 'Nolja',
	},
	TitleText:{
		fontSize:35,
		fontFamily: 'Nolja',
	},
	NormalButton:{


	},
	
});
  
export function ShareDialog( { navigation, route } ) {

	const CloseButton = (navigation)=> {
		return (
		<View style={{position: 'absolute', flex : 1,zIndex: 1,right: 5, top: 5,
		}} 
		pointerEvents='box-none'
		>
	  
		  <IconButton style={{zIndex: 1}} 
			  icon="window-close" size={30} onPress={() => {navigation.goBack();}} />
	  
		</View>
		);
	  }
	const InShareButton = (props) => {
		return(
		<TouchableOpacity  onPress={props.onPress}>
			<Image source={props.source} style={props.style}/>	
		</TouchableOpacity>
		)
	}

	return(
	<>
		<View style={{flex:1, backgroundColor:'rgb(155,109,109)'}}>

			<View style={[{flex:1,justifyContent:'center',marginHorizontal:30,marginTop:60,marginBottom:100}]}>
				
				<View style={{alignSelf:'flex-start',marginVertical:20,marginHorizontal:10}}>
					<Text style={ShareStyle.TitleText}>공유하기</Text>
				</View>

				<View style={[DefaultStyle.SimpleBorder,{borderRadius:5,borderWidth:2,flex:0.7,backgroundColor:'rgb(255,234,171)'}]}>
					<View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:20}}>

						<InShareButton source={require('../assets/buttons/share_kakao.png')}  style={{width:70,height:70}} onPress={() => {}}/>
						<InShareButton source={require('../assets/buttons/share_twitter.png')} style={{width:70,height:70}} onPress={() => {}}/>
						<InShareButton source={require('../assets/buttons/share_facebook.png')} style={{width:70,height:70}} onPress={() => {}}/>
						<InShareButton source={require('../assets/buttons/share_inst.png')} onPress={() => {}} style={{width:70,height:70}}onPress={() => {}} />
						
					</View>

					<View style={[{borderRadius:5,flexDirection:'row',justifyContent:'center',
					marginHorizontal:20,marginVertical:15,padding:5,backgroundColor:'rgb(183,183,183)'}]}>
						<Text style={{flex:0.9,alignSelf:'center',paddingLeft:5,fontFamily:'Nolja'}}>Link</Text>
						<TouchableOpacity style={{flex:0.2,alignSelf:'flex-end'}}>
							<Text style={{color:'#53699A',fontFamily: 'Nolja',fontSize:19}}>링크복사</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
		<CloseButton {...navigation} />
	</>
	);

}

export function ShareButton(navigation) {
	return (
	<View style={{position: 'absolute', flex : 1,zIndex: 1,right: 0, top: 0,
	}} 
	pointerEvents='box-none'
	>
  
	  <IconButton style={{zIndex: 1}} 
	  	icon="share-variant" size={30} onPress={() => {navigation.jumpTo("ShareDialog",{navigation});}} >
  
	  </IconButton>
  
	</View>
	);
  }

//export default ShareDialog;
