import { ActiveTickets, InactiveTickets } from "@/components/HomePage";
import LiveChat from "@/components/LiveChat";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";

export type fakedata = {
  id: number;
  type: string;
  name: string;
  details: string;
  date: string;
  status: string;
}

const fakedataActive: fakedata[] = [{
  id: 43321,
  type: "Technical",
  name: "Password Reset",
  details: "Getting error when reseting password",
  date: "2024-11-22",
  status: "In progress"
}]

const fakedataInactive: fakedata[] = [
  {
    id: 1243,
    type: "Technical",
    name: "Login Issue",
    details: "Unable to log in with correct credentials",
    date: "2024-11-20",
    status: "Closed"
  },
  {
    id: 34457,
    type: "Reward",
    name: "Invoice Error",
    details: "Incorrect invoice amount displayed",
    date: "2024-11-15",
    status: "Closed"
  },
  {
    id: 86768,
    type: "Reward",
    name: "Product Features",
    details: "Questions about the new reward update",
    date: "2024-11-10",
    status: "Closed"
  },
  {
    id: 3238,
    type: "Technical",
    name: "Server Downtime",
    details: "Website was down for maintenance without notice",
    date: "2024-11-08",
    status: "Closed"
  },
  {
    id: 43227,
    type: "Technical",
    name: "Email Not Received",
    details: "Verification email not arriving in inbox",
    date: "2024-11-05",
    status: "Closed"
  },
  {
    id: 67454,
    type: "Reward",
    name: "Refund Issue",
    details: "Refund not processed after request",
    date: "2024-11-02",
    status: "Closed"
  },
  {
    id: 9821,
    type: "Technical",
    name: "Broken Links",
    details: "Several links on the homepage are broken",
    date: "2024-10-25",
    status: "Closed"
  }
];

function Home() {
  const [active, setActive] = useState<fakedata[]>(fakedataActive)
  const [inactive, setInactive] = useState<fakedata[]>(fakedataInactive)
  return (
    <>
      <Navbar fakedata={active} setTicket={setActive}/>
      <ActiveTickets fakedata={active}/>
      <InactiveTickets fakedata={inactive}/>
      <LiveChat/>
    </>
  )
}

export default Home