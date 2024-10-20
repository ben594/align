import './index.css'

import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider
      toastOptions={{ defaultOptions: { duration: 3000, isClosable: true } }}
    >
      <App />
    </ChakraProvider>
  </StrictMode>
)
