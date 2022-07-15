import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { useFeatureFlags, usePostHog } from 'posthog-react-native'
import React from 'react'
import { Button, Platform, StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'

export default function PosthogDemoScreen(props: any) {
  const navigation = useNavigation()
  const posthog = usePostHog()

  const title = props.route.name

  const trackRandomEvent = () => {
    posthog?.capture('random event', {
      random: Math.random(),
    })
  }

  const identifyUser = () => {
    const id = Math.round(Math.random() * 1000)
    posthog?.identify(`user-${id}`, {
      email: `user-${id}@posthog.com`,
    })
  }

  const flags = useFeatureFlags()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
      <Text testID={`title-${title}`} style={styles.heading}>
        {title}
      </Text>

      <View style={styles.separator} />

      <View>
        <View style={styles.section} ph-no-capture>
          <Text testID="example-ph-no-capture">
            I have the property "ph-no-capture" which means touching me will not be picked up by autocapture
          </Text>
        </View>

        <View style={styles.section}>
          <Text testID="example-ph-label" ph-label="special-text">
            I have the property "ph-label" which means touching me will be autocaptured with a specific label
          </Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity onPress={() => trackRandomEvent()} style={styles.button}>
            <Text style={styles.buttonText}>Tap here to track a random event!</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity onPress={() => identifyUser()} style={styles.button}>
            <Text style={styles.buttonText}>Simulate login and identify!</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            ph-label="next-page-button"
            style={styles.button}
            onPress={() =>
              (navigation as any).push('ModalNextPage', {
                id: Math.random(),
              })
            }
          >
            <Text style={styles.buttonText}>Open Modal</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>Feature Flags:</Text>

        {flags ? (
          <View>
            {Object.keys(flags).map((key) => (
              <Text key={key}>
                {key}: {JSON.stringify(flags[key])}
              </Text>
            ))}
          </View>
        ) : (
          <Text>Loading feature flags...</Text>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 10,
  },

  section: {
    backgroundColor: 'rgba(0,0,0,.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#1d4aff',
    borderRadius: 10,
    padding: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
})