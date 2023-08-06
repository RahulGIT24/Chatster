import { Spinner, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  return (
    <Stack>
      <Spinner size={'lg'}/>
    </Stack>
  )
}

export default ChatLoading
