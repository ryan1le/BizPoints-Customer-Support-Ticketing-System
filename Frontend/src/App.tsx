import { ChatButton } from "./components/ChatButton";
import { ActiveTickets, InactiveTickets } from "./components/HomePage";
import { Navbar } from "./components/Navbar";
import NewTicket from "./components/NewTicket";

function App() {
  return (
    <>
      <Navbar />
      <ActiveTickets />
      <InactiveTickets />
      <ChatButton />
      <NewTicket resetForm={() => { /* implement reset form logic here */ }} />
    </>
  );
}

export default App;