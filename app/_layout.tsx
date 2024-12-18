import { Stack } from "expo-router";
import Home from "./Applications/Home";

export default function RootLayout() {
  return (
  
 
    <Stack>
    <Stack.Screen
      name="index"
      options={{
        title: 'Guru',
        headerStyle: { backgroundColor: '#1f1c1c',  }, // Set header background color
        headerTintColor: '#d68b09', // Set header text color
      }}
    />
    <Stack.Screen
      name="Resume"
      options={{
        title: 'Resumes',
        headerStyle: { backgroundColor: '#1f1c1c' }, // Set header background color
        headerTintColor: '#d68b09', // Set header text color
      }}
    />
  </Stack>
)
}
