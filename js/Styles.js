import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

const DefaultStyle = StyleSheet.create({
  NoljaFont: {fontFamily: 'Nolja',color:'rgb(83,51,62)'},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: 'black',
    borderTopWidth: 2,
    backgroundColor: 'transparent',
  },
  setupButton: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'flex-end',
    marginEnd: 15,
    marginTop: 15,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  inputBox: {
    
    //margin: 12,
    //borderWidth: 1,
    padding: 10,
    width:300,
    height:150,
    zIndex:1,
  },
  DateButton: {
    //borderWidth:1.5,
    borderRadius:0,
    //borderColor:'black',
  },

  EmoteButton:{
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    width: 60, height: 60,
    justifyContent: 'center',
    alignItems:'center',

  },
  SelectedEmoteButton:{
    backgroundColor: 'rgb(254,203,76)',
    borderRadius: 20,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    width: 60, height: 60,
    justifyContent: 'center',
    alignItems:'center',

  },
  SimpleBorder:{
		borderWidth:1,borderRadius:0,borderColor:'black',
	}
});


export default DefaultStyle;