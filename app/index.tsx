import { Text, View, ImageBackground } from "react-native";
import Home from "./Applications/Home";
import { Stack } from "expo-router";
import LinearGradient from "react-native-linear-gradient";

export default function Applications() {
  return (
    <ImageBackground
                source={require('../assets/images/gradient.jpg')}
                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                >
                  <Home/>
                </ImageBackground>
      

    
  )
}
