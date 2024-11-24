import { ChatButton } from "@/components/ChatButton";
import { ActiveTickets, InactiveTickets } from "@/components/HomePage";
import LiveChat from "@/components/LiveChat";
import { Navbar } from "@/components/Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <ActiveTickets />
      <InactiveTickets />
      <ChatButton />
      <LiveChat/>
    </>
  )
}

export default Home