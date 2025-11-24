import axios from 'axios';
import dayjs from 'dayjs';

export const calculateTimeDifference = (
  durationStart: any,
  durationEnd: any
): string => {
  // Convert time strings to Date objects
  const start = new Date(
    `${dayjs(durationStart.date).format('YYYY-MM-DD')}T${durationStart.time}:00Z`
  ); // Assume both times are on the same day
  const end = new Date(
    `${dayjs(durationEnd.date).format('YYYY-MM-DD')}T${durationEnd.time}:00Z`
  );

  // Get the difference in milliseconds
  let difference = end.getTime() - start.getTime();

  // If the durationEnd time is earlier than the start time, adjust for the next day
  if (difference < 0) {
    difference += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
  }

  // Convert milliseconds to hours and minutes
  const hours = Math.floor(difference / (1000 * 60 * 60)); // Hours
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)); // Minutes

  return `${hours}H ${minutes}M`;
};

export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Creating Workbench
export const createWorkbench = async (body: any) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/travelport/workbench-initial`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    console.log('create workbench Response:', res.data);
    return res.data;
  } catch (error) {
    console.log('create workbench Error:', error);
    return null;
  }
};

// Add Offers To Workbench
export const addOffersToWorkbench = async (body: any) => {
  // body: {workbench_id: "", params: {}}
  console.log(body);
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/travelport/offer-to-workbench`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Add offer to workbech response:', res.data);
    return res.data;
  } catch (error) {
    console.log('Add offer to workbech Error:', error);
    return null;
  }
};

// Add Travelers To Workbench
export const addTravelersToWorkbench = async (body: any) => {
  // body: {workbench_id: "", params: {}}
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/travelport/add-traveler-to-workbench`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Add travelers to workbench Response:', res.data);
    return res.data;
  } catch (error) {
    console.log('Add travelers to workbench Error:', error);
    return null;
  }
};

// Seat Map To Workbench
export const seatMapToWorkbench = async (body: any) => {
  // body: {workbench_id: "", params: {}}

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/travelport/seat-map-to-workbench`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('SeatMap to workbench Response:', res.data);
    return res.data;
  } catch (error) {
    console.log('SeatMap to workbench Error:', error);
    return null;
  }
};

// Form of Payment
export const formOfPayment = async (body: any) => {
  // body: {workbench_id: "", params: {}}
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/travelport/form-of-payment`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('FOP Response:', res.data);
    return res.data;
  } catch (error) {
    console.log('Form of Payment Error:', error);
    return null;
  }
};

// Add Payment to Workbench
export const addPaymentToWorkbench = async (body: any) => {
  // body: {workbench_id: "", params: {}}
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/travelport/payment-to-workbench`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log('Add payment to workbench Error:', error);
    return null;
  }
};

// Commit the workbench
export const commitToWorkbench = async (body: any) => {
  // body: {workbench_id: "", params: {}}
  console.log(body);
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/travelport/commit-to-workbench`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Commit to workbench Response:', res.data);
    return res.data;
  } catch (error) {
    console.log('Commit to workbench Error:', error);
    return null;
  }
};

// post Commit the workbench
export const postCommitToWorkbench = async (body: any) => {
  // body: {locator: "", params: {}}
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/travelport/post-commit-to-workbench`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Post Commit to workbench Response:', res.data);
    return res.data;
  } catch (error) {
    console.log('Post Commit to workbench Error:', error);
    return null;
  }
};

// Fare Rules and Exchanges
export const fareRules = async (body: any) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/travelport/fare-rules`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
