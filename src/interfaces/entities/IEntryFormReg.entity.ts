export default interface IEntryRegFormData {
  name: string;
  email: string;
  phone: number;
  eventName: string;
  startDate: string;
  endDate: string;
  district: string;
  state: string;
  pincode: string;
  guestCount: number;
  venue: string;
  decoration: boolean;
  sound: boolean;
  seating: boolean;
  photography: boolean;
  foodOptions: {
    welcomeDrink: boolean;
    starters: boolean;
    mainCourse: boolean;
    dessert: boolean;
  };
  entryPayment: {
    status: "pending" | "completed" | "failed";
    transactionId: string;
  };
}
