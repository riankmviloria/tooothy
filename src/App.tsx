import { MantineProvider } from '@mantine/core'
import AppRouter from './app/AppRouter'
import { theme } from './app/theme'

function App() {
  return (
    <MantineProvider theme={theme}>
      <AppRouter />
    </MantineProvider>
  )
}

export default App