import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fakedata } from "@/pages/Home";

interface ticketprop {
  fakedata: fakedata[]
}

export const ActiveTickets = ({ fakedata }: ticketprop) => {
  return (
    <div className="bg-[#B7D5D4] p-4">
      <div className="max-w-screen-lg mx-auto">
        {/* Wrapper for the custom background color */}
        <div className="bg-[#B7D5D4] h-20">
          {/* Large title */}
          <h1 className="text-2xl font-bold mb-4 mt-10 text-gray-800">Ticketing Management System</h1>
        </div>

        {/* Table section (excluded from the custom background color) */}
        <div className="">
          {/* Wrap the caption in a div to apply the background color */}
          <h2 className="text-left mb-2 font-bold text-black bg-[#B7D5D4]">Active Tickets</h2>
          <Table className="border border-black divide-y divide-gray-200 text-sm">
            <TableHeader>
              <TableRow className="bg-[#D3D3D3] text-black">
                <TableHead className="w-[100px] border-r border-black text-black">Ticket ID</TableHead>
                <TableHead className="border-r border-black text-black">Type</TableHead>
                <TableHead className="border-r border-black text-black">Name</TableHead>
                <TableHead className="border-r border-black text-black">Details</TableHead>
                <TableHead className="border-r border-black text-black">Date</TableHead>
                <TableHead className="text-right text-black">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fakedata.map((item, index) => (
                <TableRow key={index} className="bg-white">
                  <TableCell className="font-medium border-r border-black">{item.id}</TableCell> 
                  <TableCell className="border-r border-black">{item.type}</TableCell> 
                  <TableCell className="border-r border-black">{item.name}</TableCell> 
                  <TableCell className="border-r border-black">{item.details}</TableCell>
                  <TableCell className="border-r border-black">{item.date}</TableCell>
                  <TableCell className="text-right">{item.status}</TableCell>
                </TableRow>  
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
  
};

export const InactiveTickets = ({ fakedata }: ticketprop) => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <h2 className="text-left mb-2 font-bold text-black mt-5">Inactive Tickets</h2>
      <Table className="border border-black divide-y divide-gray-200 text-sm">
            <TableHeader>
              <TableRow className="bg-[#D3D3D3] text-black">
                <TableHead className="w-[100px] border-r border-black text-black">Ticket ID</TableHead>
                <TableHead className="border-r border-black text-black">Type</TableHead>
                <TableHead className="border-r border-black text-black">Name</TableHead>
                <TableHead className="border-r border-black text-black">Details</TableHead>
                <TableHead className="border-r border-black text-black">Date</TableHead>
                <TableHead className="text-right text-black">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fakedata.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium border-r border-black">{item.id}</TableCell> 
                  <TableCell className="border-r border-black">{item.type}</TableCell> 
                  <TableCell className="border-r border-black">{item.name}</TableCell> 
                  <TableCell className="border-r border-black">{item.details}</TableCell>
                  <TableCell className="border-r border-black">{item.date}</TableCell>
                  <TableCell className="text-right">{item.status}</TableCell>
                </TableRow>  
              ))}
            </TableBody>
          </Table>
    </div>
  );
};



