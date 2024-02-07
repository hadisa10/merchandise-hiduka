import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export const USER_ROUTE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'cancelled', label: 'Cancelled' },
];

const ITEMS = [...Array(6)].map((_, index) => ({
  id: _mock.id(index),
  sku: `16H9UR${index}`,
  quantity: index + 1,
  name: _mock.productName(index),
  coverUrl: _mock.image.product(index),
  price: _mock.number.price(index),
}));

export const _orders = [...Array(20)].map((_, index) => {
  const shipping = 10;

  const discount = 10;

  const taxes = 10;

  const items = (index % 2 && ITEMS.slice(0, 1)) || (index % 3 && ITEMS.slice(1, 3)) || ITEMS;

  const totalQuantity = items.reduce((accumulator, item) => accumulator + item.quantity, 0);

  const subTotal = items.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);

  const totalAmount = subTotal - shipping - discount + taxes;

  const customer = {
    id: _mock.id(index),
    name: _mock.fullName(index),
    email: _mock.email(index),
    avatarUrl: _mock.image.avatar(index),
    ipAddress: '192.158.1.38',
  };

  const delivery = {
    shipBy: 'DHL',
    speedy: 'Standard',
    trackingNumber: 'SPX037739199373',
  };

  const history = {
    orderTime: _mock.time(1),
    paymentTime: _mock.time(2),
    deliveryTime: _mock.time(3),
    completionTime: _mock.time(4),
    timeline: [
      { title: 'Delivery successful', time: _mock.time(1) },
      { title: 'Transporting to [2]', time: _mock.time(2) },
      { title: 'Transporting to [1]', time: _mock.time(3) },
      {
        title: 'The shipping unit has picked up the goods',
        time: _mock.time(4),
      },
      { title: 'Order has been created', time: _mock.time(5) },
    ],
  };

  return {
    _id: _mock.id(index),
    orderNumber: `#601${index}`,
    createdAt: _mock.time(index),
    taxes,
    items,
    history,
    subTotal,
    shipping,
    discount,
    customer,
    delivery,
    totalAmount,
    totalQuantity,
    shippingAddress: {
      fullAddress: '19034 Verna Unions Apt. 164 - Honolulu, RI / 87535',
      phoneNumber: '365-374-4961',
    },
    payment: {
      cardType: 'mastercard',
      cardNumber: '**** **** **** 5678',
    },
    status:
      (index % 2 && 'completed') ||
      (index % 3 && 'pending') ||
      (index % 4 && 'cancelled') ||
      'refunded',
  };
});


export const _user_routes = [...Array(1)].map((_, index) => {
  const shipping = 10;

  const discount = 10;

  const taxes = 10;

  const items = (index % 2 && ITEMS.slice(0, 1)) || (index % 3 && ITEMS.slice(1, 3)) || ITEMS;

  const totalQuantity = items.reduce((accumulator, item) => accumulator + item.quantity, 0);

  const subTotal = items.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);

  const totalAmount = subTotal - shipping - discount + taxes;

  const customer = {
    id: _mock.id(index),
    name: _mock.fullName(index),
    email: _mock.email(index),
    avatarUrl: _mock.image.avatar(index),
    ipAddress: '192.158.1.38',
  };

  const delivery = {
    shipBy: 'DHL',
    speedy: 'Standard',
    trackingNumber: 'SPX037739199373',
  };

  const history = {
    orderTime: _mock.time(1),
    paymentTime: _mock.time(2),
    deliveryTime: _mock.time(3),
    completionTime: _mock.time(4),
    timeline: [
      { title: 'Delivery successful', time: _mock.time(1) },
      { title: 'Transporting to [2]', time: _mock.time(2) },
      { title: 'Transporting to [1]', time: _mock.time(3) },
      {
        title: 'The shipping unit has picked up the goods',
        time: _mock.time(4),
      },
      { title: 'Order has been created', time: _mock.time(5) },
    ],
  };

  return {
    _id: _mock.id(index),
    orderNumber: `#601${index}`,
    createdAt: _mock.time(index),
    taxes,
    items,
    history,
    subTotal,
    shipping,
    discount,
    customer,
    delivery,
    totalAmount,
    totalQuantity,
    shippingAddress: [
      {
        id: "1",
        fullAddress: 'Naivas, Waiyaki Way, Nairobi',
        phoneNumber: '+254712345678',
        longitude: "-1.264780592401393",
        latitude: "36.80199644276411",
        road: "Wayaki way",
        products: items.filter((_item, i) => i < 3),
      },
      {
        id: "2",
        fullAddress: 'Naivas Supermarket-Mountain View, PPMR+7QF, Mountain View Mall, Off Waiyaki Way, Nairobi',
        phoneNumber: '+254712345679',
        longitude: "-1.2594064822986786",
        latitude: "36.740946588285425",
        road: "Wayaki way",
        products: items.filter((_item, i) => i >= 3),
      }
    ],
    payment: {
      cardType: 'mastercard',
      cardNumber: '**** **** **** 5678',
    },
    status:
      (index === 0 && 'active') ||
      (index % 3 && 'pending') ||
      (index % 4 && 'cancelled') ||
      'refunded',
  };
});