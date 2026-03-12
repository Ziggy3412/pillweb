import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SideBar from "./SideBar.jsx";
import AddChart from "./AddChart.jsx";
import ChartChart from "./ChartChart.jsx";
import PopupChart from "./PopupChart.jsx";

function App() {
    const[isPopupOpen, setIsPopupOpen] = useState(false);

      return (
        <>
            <div className="h-full flex">
                <SideBar />

                <main className="flex-1 relative">
                    <AddChart changePopupState={setIsPopupOpen} />

                    <ChartChart />
                </main>
            </div>

            {isPopupOpen && <PopupChart changePopupState={setIsPopupOpen} />}

        </>
      )
}

export default App
