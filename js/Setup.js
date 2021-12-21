import React, { useState, setState } from 'react';
import DefaultStyle from './Styles.js'
import { View,   } from 'react-native';
import { IconButton, } from 'react-native-paper';



// Deprecated

function Setup(navigation) {
  return (
  <View style={{position: 'absolute', flex : 1,zIndex: 1,right: 5, top: 5,
  }} 
  pointerEvents='box-none'
  >

    <IconButton style={{zIndex: 1}} color='rgb(83,51,62)'
	  	icon="cog" size={30} onPress={() => {navigation.toggleDrawer();}} >

    </IconButton>

  </View>
  );
}


export default Setup;
