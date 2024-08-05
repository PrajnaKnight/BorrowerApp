import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { styles } from '../../assets/style/globalStyle';

const { width } = Dimensions.get('window');

const FirstRoute = () => <View style={{ flex: 1 }} />;
const SecondRoute = () => <View style={{ flex: 1 }} />;
const ThirdRoute = () => <View style={{ flex: 1 }} />;

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
});

const NoLoans = ({ navigation }) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'In Progress' },
    { key: 'second', title: 'Active' },
    { key: 'third', title: 'Closed' },
  ]);

  return (
    <View style={{ flex: 1, backgroundColor:'#ffffff' }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
            activeColor="#fff"
            inactiveColor="#BDBDBD"
            renderLabel={({ route, focused }) => (
              <Text
                style={[
                  styles.tabLabel,
                  { color: focused ? '#fff' : '#BDBDBD', opacity: 0.5 },
                ]}
              >
                {route.title}
              </Text>
            )}
            renderTab={({ route }) => (
              <TouchableOpacity style={styles.tabItem} activeOpacity={1}>
                <Text style={[styles.tabLabel, { opacity: 0.5 }]}>
                  {route.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      />
      <View style={styles.noLoansContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../../assets/images/noloan-banner.png')}
            style={styles.noLoansImage}
          />
          <Text style={styles.noLoansTitle}>No Loan Taken</Text>
          <Text style={styles.noLoansSubtitle}>
            You currently do not have any loans. Take your time to explore our loan
            options and start a new financial journey with us today.
          </Text>
        </View>
        
      </View>
      <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.noLoanapplyNowButton}
            onPress={() => navigation.navigate('ApplyLoan')}
          >
            <Text style={styles.noLoanapplyNowButtonText}>APPLY NOW</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

export default NoLoans;
