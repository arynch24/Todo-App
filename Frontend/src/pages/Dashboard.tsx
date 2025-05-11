import { Outlet } from "react-router-dom"
import SideBar from "../components/Dashboard/SideBar"

const Dashboard = () => {
  return (
    <div className="w-full h-[calc(100vh-4rem)] flex">
      <SideBar />
      <div className="flex-1 ">
        <Outlet />
      </div>
    </div>

  )
}

export default Dashboard
