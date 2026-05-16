import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DispatcherView from '@/src/components/dispatcher/DispatcherView'

const Dispatcher = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <DispatcherView />
    </SafeAreaView>
  )
}

export default Dispatcher
