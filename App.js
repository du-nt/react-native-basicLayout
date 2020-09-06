import * as React from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity } from "react-native";

import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
  useRoute,
  useNavigation,
} from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  scene: { flex: 1 },
  drawer: { paddingTop: 34 },
  topTab: {
    color: "#aaa",
    margin: 8,
  },
  topTabActive: {
    color: "green",
    margin: 8,
  },
  drawerItem: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
});

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const FirstRoute = () => {
  const navigation = useNavigation();
  return (
    <View style={[styles.scene, styles.container, { backgroundColor: "#fff" }]}>
      <Button
        title="Open Drawer"
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    </View>
  );
};

const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#eee" }]} />
);

const ThirdRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#ddd" }]} />
);

const FourRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#ccc" }]} />
);

const FiveRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#bbb" }]} />
);

function TopTabs() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "First" },
    { key: "second", title: "Second" },
    { key: "third", title: "Third" },
    { key: "four", title: "Four" },
    { key: "five", title: "Five" },
  ]);
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    four: FourRoute,
    five: FiveRoute,
  });

  return (
    <TabView
      renderTabBar={(props) => (
        <TabBar
          {...props}
          tabStyle={{ width: 100 }}
          scrollEnabled
          indicatorStyle={{ backgroundColor: "green" }}
          style={{ backgroundColor: "white" }}
          renderLabel={({ route, focused }) => (
            <Text style={focused ? styles.topTabActive : styles.topTab}>
              {route.title}
            </Text>
          )}
        />
      )}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
    />
  );
}

function User() {
  return (
    <View style={styles.container}>
      <Text>User Screen</Text>
    </View>
  );
}

function Setting() {
  return (
    <View style={styles.container}>
      <Text>Setting Screen</Text>
    </View>
  );
}

function TabNav() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Feed"
        component={TopTabs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={User}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-circle" color={color} size={size} />
          ),
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Setting}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Messages() {
  return (
    <View style={styles.container}>
      <Text>Messages Screen</Text>
    </View>
  );
}

function About({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>About Screen</Text>
      <Button
        title="Go to More"
        onPress={() => {
          navigation.navigate("More");
        }}
      />
    </View>
  );
}

function More() {
  return (
    <View style={styles.container}>
      <Text>More Screen</Text>
    </View>
  );
}

function StackNav({ navigation, route }) {
  const getGestureStatus = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "TabNav";
    switch (routeName) {
      case "More":
        return false;
      default:
        return true;
    }
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({ gestureEnabled: getGestureStatus(route) });
    return () => navigation.setOptions({ gestureEnabled: true });
  }, [navigation, route]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabNav"
        component={TabNav}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Messages" component={Messages} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="More" component={More} />
    </Stack.Navigator>
  );
}

function Home() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="StackNav" component={StackNav} />
    </Drawer.Navigator>
  );
}

function HomePage() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const route = useRoute();
  const routeName = route.state?.routes[0]?.state?.routes?.slice(-1)[0]?.name;
  return (
    <View style={styles.drawer}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          navigation.navigate("TabNav");
        }}
      >
        <Icon name="home" size={24} />
        <Text>Home</Text>
      </TouchableOpacity>
      <Button
        title="Go to About"
        onPress={() => {
          navigation.closeDrawer();
          routeName === "About"
            ? navigation.navigate("About")
            : navigation.push("About");
        }}
      />
      <Button
        title="Go to More"
        onPress={() => {
          navigation.navigate("More");
        }}
      />
      <Button
        title="Go to Messages"
        onPress={() => {
          navigation.navigate("Messages");
        }}
      />
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <HomePage />
    </NavigationContainer>
  );
}
export default App;
