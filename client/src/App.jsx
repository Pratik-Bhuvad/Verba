import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/appRoutes'
import MainLayout from './components/Layout/MainLayout'
import { ThemeProvider } from './context/ThemeContext'

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </ThemeProvider>
    </Router>
  )
}

export default App
