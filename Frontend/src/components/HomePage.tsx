import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


export const ActiveTickets = () => {
  return (
    <div className="bg-[#B7D5D4] p-4">
      <div className="max-w-screen-lg mx-auto">
        {/* Wrapper for the custom background color */}
        <div className="bg-[#B7D5D4] p-4">
          {/* Large title */}
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Ticketing Management System</h1>
        </div>

        {/* Table section (excluded from the custom background color) */}
        <div className="bg-white">
          {/* Wrap the caption in a div to apply the background color */}
          <div className="bg-[#B7D5D4] p-2">
            <TableCaption className="text-left mb-2 font-bold text-black">Active Tickets</TableCaption>
          </div>
          <Table className="border border-black divide-y divide-gray-200 text-sm">
            <TableHeader>
              <TableRow className="bg-[#D3D3D3] text-black">
                <TableHead className="w-[100px] border-r border-black text-black">Ticket ID</TableHead>
                <TableHead className="border-r border-black text-black">Type</TableHead>
                <TableHead className="border-r border-black text-black">Date</TableHead>
                <TableHead className="border-r border-black text-black">Details</TableHead>
                <TableHead className="text-right text-black">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium border-r border-black">ID#1</TableCell> 
                <TableCell className="border-r border-black">Example</TableCell> 
                <TableCell className="border-r border-black">2024-11-22</TableCell> 
                <TableCell className="border-r border-black">Online</TableCell>
                <TableCell className="text-right">Open</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium border-r border-black">ID#2</TableCell> 
                <TableCell className="border-r border-black">Sample</TableCell>
                <TableCell className="border-r border-black">2024-11-21</TableCell>
                <TableCell className="border-r border-black">Offline</TableCell>
                <TableCell className="text-right">Closed</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
  
};

export const InactiveTickets = () => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <TableCaption className="text-left mb-2 font-bold text-black">Inactive Tickets</TableCaption>
      <Table className="border border-black divide-y divide-gray-200 text-sm">
        <TableHeader>
          <TableRow className="bg-[#D3D3D3] text-white">
            <TableHead className="w-[100px] border-r border-black text-black">Ticket ID</TableHead>
            <TableHead className="border-r border-black text-black">Type</TableHead> 
            <TableHead className="border-r border-black text-black">Date</TableHead> 
            <TableHead className="border-r border-black text-black">Method</TableHead>
            <TableHead className="text-right text-black">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium border-r border-black">ID#1</TableCell>
            <TableCell className="border-r border-black">Example</TableCell>
            <TableCell className="border-r border-black">2024-11-22</TableCell> 
            <TableCell className="border-r border-black">Online</TableCell>
            <TableCell className="text-right">Open</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium border-r border-black">ID#2</TableCell>
            <TableCell className="border-r border-black">Sample</TableCell> 
            <TableCell className="border-r border-black">2024-11-21</TableCell> 
            <TableCell className="border-r border-black">Offline</TableCell> 
            <TableCell className="text-right">Closed</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};



