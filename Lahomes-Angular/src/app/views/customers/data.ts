import { currency, currentYear } from '@common/constants';

export type CustomerStatType = {
  title: string;
  amount: string;
  icon: string;
  change: number;
  variant: string;
};

export const customerStatData: CustomerStatType[] = [
  {
    title: 'Total Customers',
    amount: '501',
    icon: 'solar:users-group-rounded-broken',
    change: 8.5,
    variant: 'success',
  },
  {
    title: 'Active Customers',
    amount: '450',
    icon: 'solar:user-check-broken',
    change: 12,
    variant: 'success',
  },
  {
    title: 'New Customers',
    amount: '50',
    icon: 'solar:user-plus-broken',
    change: 17,
    variant: 'danger',
  },
  {
    title: 'Invested Amount',
    amount: currency + '928,128',
    icon: 'solar:money-bag-bold',
    change: 5,
    variant: 'primary',
  },
];

export type CustomerType = {
  id: string;
  name: string;
  image: string;
  email: string;
  phone: string;
  type: string;
  address: string;
  customerStatus: string;
  date: string;
  status: string;
  propertyView: number;
  propertyOwn: number;
  invest: string;
};

export const customerData: CustomerType[] = [
  {
    id: '201',
    name: 'Daavid Nummi',
    image: 'assets/images/users/avatar-2.jpg',
    email: 'daavidnumminen@teleworm.us',
    phone: '+231 06-75820711',
    type: 'Residential',
    address: '123 Maple St, 456 Oak Ave',
    customerStatus: 'Interested',
    date: '15/03/' + currentYear,
    status: 'Available',
    propertyView: 231,
    propertyOwn: 27,
    invest: '928,128',
  },
  {
    id: '202',
    name: 'Sinikka Penttinen',
    image: 'assets/images/users/avatar-3.jpg',
    email: 'sinikkapenttinen@dayrep.com',
    phone: '+231 47-23456789',
    type: 'Commercial',
    address: '789 Pine Blvd',
    customerStatus: 'Under Review',
    date: '20/03/' + currentYear,
    status: 'Available',
    propertyView: 134,
    propertyOwn: 13,
    invest: '435,892',
  },
  {
    id: '203',
    name: 'Jere Palmu',
    image: 'assets/images/users/avatar-4.jpg',
    email: 'jerepalmu@rhyta.com',
    phone: '+231 73-34567890',
    type: 'Residential',
    address: '101 Birch Ct, 202 Cedar Ln',
    customerStatus: 'Follow-up',
    date: '25/03/' + currentYear,
    status: 'Available',
    propertyView: 301,
    propertyOwn: 15,
    invest: '743,120',
  },
  {
    id: '204',
    name: 'Ulla Nuorela',
    image: 'assets/images/users/avatar-5.jpg',
    email: 'ullanuorela@rhyta.com',
    phone: '+231 45-45678901',
    type: 'Residential',
    address: '303 Elm St',
    customerStatus: 'Interested',
    date: '05/04/' + currentYear,
    status: 'Unavailable',
    propertyView: 109,
    propertyOwn: 7,
    invest: '635,812',
  },
  {
    id: '205',
    name: 'Tiia Karppinen',
    image: 'assets/images/users/avatar-6.jpg',
    email: 'tiiakarppinen@teleworm.us',
    phone: '+231 16-56789012',
    type: 'Industrial',
    address: '404 Walnut Rd',
    customerStatus: 'Follow-up',
    date: '12/04/' + currentYear,
    status: 'Available',
    propertyView: 142,
    propertyOwn: 18,
    invest: '733,291',
  },
  {
    id: '206',
    name: 'Harland R. Orsini',
    image: 'assets/images/users/avatar-7.jpg',
    email: 'harlandrorsini@dayrep.com',
    phone: '+231 82-67890123',
    type: 'Residential',
    address: '505 Spruce St',
    customerStatus: 'Interested',
    date: '15/04/' + currentYear,
    status: 'Unavailable',
    propertyView: 109,
    propertyOwn: 10,
    invest: '831,760',
  },
  {
    id: '207',
    name: 'David Padgett',
    image: 'assets/images/users/avatar-8.jpg',
    email: 'davidpadgett@armyspy.com',
    phone: '+231 92-78901234',
    type: 'Commercial',
    address: '606 Fir Ave',
    customerStatus: 'Under Review',
    date: '18/04/' + currentYear,
    status: 'Available',
    propertyView: 231,
    propertyOwn: 27,
    invest: '928,128',
  },
  {
    id: '208',
    name: 'Valerie Obrien',
    image: 'assets/images/users/avatar-9.jpg',
    email: 'valerieobrien@dayrep.com',
    phone: '+231 82-89012345',
    type: 'Residential',
    address: '808 Willow Dr, 909 Aspen Ln',
    customerStatus: 'Interested',
    date: '20/04/' + currentYear,
    status: 'Available',
    propertyView: 231,
    propertyOwn: 27,
    invest: '928,128',
  },
];

export type PropertyCardType = {
  title: string;
  Property: number;
  icon: string;
  count: string;
  progress: number;
  variant: string;
};

export const propertyCards: PropertyCardType[] = [
  {
    title: 'Active Property',
    Property: 350,
    icon: 'solar:home-2-bold',
    count: '231',
    progress: 60,
    variant: 'success',
  },
  {
    title: 'View Property',
    Property: 231,
    icon: 'solar:home-bold',
    count: '27',
    progress: 20,
    variant: 'warning',
  },
  {
    title: 'Own Property',
    Property: 27,
    icon: 'solar:money-bag-bold',
    count: currency + '928,128',
    progress: 80,
    variant: 'primary',
  },
];

export type TransactionType = {
  order_id: string;
  date: string;
  type: string;
  address: string;
  amount: string;
  status: string;
  customer: string;
};

export const transactionData: TransactionType[] = [
  {
    order_id: 'ORD-75234',
    date: '15/03/' + currentYear,
    type: 'Residential',
    address: '123 Maple St, 456 Oak Ave',
    amount: currency + '928,128',
    status: 'Paid',
    customer: 'Michael A. Miner',
  },
  {
    order_id: 'ORD-54222',
    date: '20/03/' + currentYear,
    type: 'Commercial',
    address: '789 Pine Blvd',
    amount: currency + '84,091',
    status: 'Paid',
    customer: 'Michael A. Miner',
  },
  {
    order_id: 'ORD-63111',
    date: '25/03/' + currentYear,
    type: 'Residential',
    address: '101 Birch Ct, 202 Cedar Ln',
    amount: currency + '83,120',
    status: 'Paid',
    customer: 'Michael A. Miner',
  },
  {
    order_id: 'ORD-84623',
    date: '05/04/' + currentYear,
    type: 'Residential',
    address: '303 Elm St',
    amount: currency + '65,900',
    status: 'Paid',
    customer: 'Theresa T. Brose',
  },
];