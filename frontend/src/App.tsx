import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@/components/ui/button'
import { TrainCard } from './pages/Results/TrainCard'
import { ResultPage } from './pages/Results/ResultPage'

function App() {
  return (
    <>
      <ResultPage />
    </>
  )
}

export default App
