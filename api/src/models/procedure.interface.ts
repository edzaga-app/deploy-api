interface IProcedure {
  id: number;
  consultation: string;
  date: Date;
  next_appointment: Date;
  description: string;
  price: number;
  medical_recordId: number;
  customerId: number;
  quantityOfImages: number;
  idx: number;
}

export default IProcedure;