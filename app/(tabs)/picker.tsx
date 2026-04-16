import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PickerView from '@/src/components/picker/PickerView'

const Picker = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <PickerView />
    </SafeAreaView>
  )
}

export default Picker