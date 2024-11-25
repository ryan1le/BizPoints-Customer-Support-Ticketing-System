import { ActiveTickets, InactiveTickets } from "@/components/HomePage";
import LiveChat from "@/components/LiveChat";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

export type fakedata = {
  id: number;
  type: string;
  name: string;
  details: string;
  date: string;
  status: string;
}

export type Ticket = {
  ticketID: string;
  clientID: string;
  clientFullName: string;
  clientEmail: string;
  ticketDate: string; 
  ticketSubject: string;
  ticketDescription: string;
  ticketStatus: "Open" | "Closed" | "In Progress";
  assignedAdmin: string;
  adminResponse: string;
  actions: string;
  ticketType: "Reward" | "Technical";
};

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
  const [active, setActive] = useState<Ticket[] >([])
  const [inactive, setInactive] = useState<Ticket[] >([])
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchData = async () => { 
      try {
        setLoading(true);
        const response = await axios.get(`https://localhost:8080/tickets/${"ryan.le@yorku.com"}`); //Fetch all tickets relating to useremail since that is the id key for the User Profile team
        const data: Ticket[] = response.data

        const activeTicket: Ticket[] = []
        const inactiveTicket: Ticket[] = []

        data.map((item) => {
          if (item.ticketStatus === "Closed") {
            inactiveTicket.push(item)
          }
          else {
            activeTicket.push(item)
          }
        })
        setActive([...activeTicket])
        setInactive([...inactiveTicket])
        
      } catch (err) {
        setError(err); // Update state with error message if any
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the function
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
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