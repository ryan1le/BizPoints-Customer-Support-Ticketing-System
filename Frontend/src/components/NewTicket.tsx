import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fakedata, Ticket } from "@/pages/Home";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";

interface FormData {
  ticketName: string;
  description: string;
  ticketType: string;
}

interface NewTicketProps {
  resetForm: () => void;
  isModal?: boolean; // Add new prop to check if it's being rendered in a modal
  setTicket: (fakedata: fakedata[]) => void;
  fakedata: fakedata[]
}

const NewTicket = ({ resetForm, isModal = false, setTicket, fakedata }: NewTicketProps) => {
  // If not in modal, don't render anything
  if (!isModal) return null;

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log('Form Submitted:', data);
    const newdata = {clientID: "3123", clientFullName: "Ryan Le", clientEmail: "ryan.le@yorku.com", ticketDate: new Date().toISOString(), ticketSubject: data.ticketName, type: data.ticketType, ticketDescription: data.description, ticketType: data.ticketType}
    try {
      const response = await axios.post("https://localhost:8080/tickets/", newdata)
      
      if (response.status === 200) {
        window.location.reload();
      }
    } catch(err) {
      console.log(err)
    }
    // setTicket([newdata, ...fakedata])
    handleClose();
  };

  const handleClose = () => {
    reset();
    resetForm();
  };

  return (
    <div className="p-4">
      <h2 className="mb-5 text-lg font-semibold text-gray-700">Submit a Ticket</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Ticket Name</label>
          <Controller
            name="ticketName"
            control={control}
            rules={{ required: "Ticket name is required" }}
            render={({ field }) => (
              <Input {...field} className="w-full" placeholder="Enter ticket name" />
            )}
          />
          {errors.ticketName && (
            <span className="text-sm text-red-500">{errors.ticketName.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <Textarea 
                {...field} 
                className="w-full min-h-[100px]" 
                placeholder="Enter ticket description"
              />
            )}
          />
          {errors.description && (
            <span className="text-sm text-red-500">{errors.description.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Ticket Type</label>
          <Controller
            name="ticketType"
            control={control}
            rules={{ required: "Ticket type is required" }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="">Select ticket type</option>
                <option value="Reward">Reward</option>
                <option value="Technical">Technical</option>
              </select>
            )}
          />
          {errors.ticketType && (
            <span className="text-sm text-red-500">{errors.ticketType.message}</span>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            onClick={handleClose}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="text-white"
            style={{ backgroundColor: "#488286" }}
          >
            Submit Ticket
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTicket;