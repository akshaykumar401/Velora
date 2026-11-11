import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from './components'

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F2] text-[#1A1816]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
