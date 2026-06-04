// src/pages/Ticketing.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { ConfigProvider, message, Modal, Button, Card, Badge, Empty, Typography, Divider, List, Space, Tag, Form, Input, DatePicker, Radio } from 'antd';
import { 
  FileTextOutlined, 
  ShoppingCartOutlined, 
  DeleteOutlined, 
  CreditCardOutlined, 
  CheckCircleOutlined, 
  ReloadOutlined, 
  ArrowLeftOutlined, 
  EnvironmentOutlined, 
  StarOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  PlusOutlined, 
  MinusOutlined,
  DollarOutlined,
  BankOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text } = Typography;

// ===================== TYPES =====================
interface Attraction {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  duration: string;
}

interface TicketItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  date?: string;
}

type PaymentMethod = 'cash' | 'credit_card' | null;
type BankType = 'visa' | 'mastercard' | 'amex' | null;

interface BookingConfirmation {
  items: TicketItem[];
  totalPrice: number;
  bookingTime: string;
  visitorName: string;
  visitDate: string;
  paymentMethod: PaymentMethod;
  selectedBank: BankType;
}

// ===================== MOCK ATTRACTIONS DATA =====================
const ATTRACTIONS: Attraction[] = [
  { id: 1, name: "Sunset Garden", category: "Gardens", price: 15.99, image: "/asset/image/Ticketing/Sunset Garden.png", description: "Beautiful botanical garden with exotic flowers", rating: 4.8, duration: "~2 hours" },
  { id: 2, name: "Sky Wheel", category: "Rides", price: 12.99, image: "/asset/image/Ticketing/Sky Wheel.png", description: "Panoramic view of the entire city park", rating: 4.9, duration: "~30 mins" },
  { id: 3, name: "Butterfly House", category: "Wildlife", price: 9.99, image: "./asset/image/Ticketing/Butterfly House.png", description: "Walk among hundreds of butterflies", rating: 4.7, duration: "~1 hour" },
  { id: 4, name: "Adventure Lake", category: "Water", price: 19.99, image: "/asset/image/Ticketing/Adventure Lake.png", description: "Boat rides and water activities", rating: 4.6, duration: "~2 hours" },
  { id: 5, name: "Children's Playland", category: "Family", price: 8.99, image: "/asset/image/Ticketing/Children's Playland.png", description: "Fun rides and games for kids", rating: 4.5, duration: "~3 hours" },
  { id: 6, name: "Bamboo Forest Walk", category: "Nature", price: 6.99, image: "/asset/image/Ticketing/Bamboo Forest Walk.png", description: "Peaceful trail through bamboo groves", rating: 4.8, duration: "~1.5 hours" },
  { id: 7, name: "Bird Aviary", category: "Wildlife", price: 7.99, image: "/asset/image/Ticketing/Bird Aviary.png", description: "Exotic birds from around the world", rating: 4.4, duration: "~1 hour" },
  { id: 8, name: "Night Light Show", category: "Shows", price: 14.99, image: "/asset/image/Ticketing/Night Light Show.png", description: "Spectacular light and music performance", rating: 4.9, duration: "~45 mins" },
];

const groupByCategory = (items: Attraction[]) => {
  const grouped: Record<string, Attraction[]> = {};
  items.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });
  return grouped;
};

// 禁用过去的日期
const disabledDate = (current: Dayjs) => {
  return current && current < dayjs().startOf('day');
};

// ===================== TICKETING COMPONENT =====================
interface TicketingProps {
  onBack: () => void;
}

const Ticketing: React.FC<TicketingProps> = ({ onBack }) => {
  const [form] = Form.useForm();
  const [cart, setCart] = useState<TicketItem[]>([]);
  const [bookingCompleted, setBookingCompleted] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  
  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [selectedBank, setSelectedBank] = useState<BankType>(null);

  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const cartItemCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);
  const groupedAttractions = useMemo(() => groupByCategory(ATTRACTIONS), []);
  const categories = Object.keys(groupedAttractions);

  const addToCart = useCallback((attraction: Attraction) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === attraction.id);
      if (existing) {
        return prev.map(item => item.id === attraction.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: attraction.id, name: attraction.name, price: attraction.price, quantity: 1, image: attraction.image }];
    });
    message.success(`${attraction.name} added to cart`);
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return null; // Mark for removal
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item): item is TicketItem => item !== null);
    });
  }, []);

  const clearCart = useCallback(() => {
    Modal.confirm({
      title: "Clear Cart",
      content: "Remove all tickets?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => { 
        setCart([]); 
        setPaymentMethod(null);
        setSelectedBank(null);
        message.info("Cart cleared"); 
      }
    });
  }, []);

  const openCheckoutModal = useCallback(() => {
    if (cart.length === 0) {
      message.error("Please select some attractions first");
      return;
    }
    form.resetFields();
    setPaymentMethod(null);
    setSelectedBank(null);
    setCheckoutModalOpen(true);
  }, [cart.length, form]);

  const handleCheckout = useCallback(async () => {
    try {
      const values = await form.validateFields();
      
      // Validation Logic for Payment
      if (!paymentMethod) {
        message.warning("Please select a payment method");
        return;
      }
      
      if (paymentMethod === 'credit_card' && !selectedBank) {
        message.warning("Please select a bank/card type");
        return;
      }

      setPaymentLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));

      setConfirmation({
        items: [...cart],
        totalPrice,
        bookingTime: new Date().toLocaleString(),
        visitorName: values.visitorName,
        visitDate: values.visitDate.format('YYYY-MM-DD'),
        paymentMethod,
        selectedBank
      });
      
      setBookingCompleted(true);
      setCart([]);
      setCheckoutModalOpen(false);
      setPaymentMethod(null);
      setSelectedBank(null);
      setPaymentLoading(false);
      message.success("Booking confirmed! 🎉 Your tickets are ready.");
    } catch (error) {
      console.error('Validation failed:', error);
    }
  }, [cart, totalPrice, form, paymentMethod, selectedBank]);

  const startNewBooking = useCallback(() => {
    setBookingCompleted(false);
    setConfirmation(null);
    setCart([]);
    setPaymentMethod(null);
    setSelectedBank(null);
  }, []);

  // 渲染星级评分
  const renderRating = (rating: number) => (
    <Space size={2}>
      <StarOutlined style={{ color: "#f5b042", fontSize: 12 }} />
      <Text className="text-xs">{rating}</Text>
    </Space>
  );

  if (bookingCompleted && confirmation) {
    // Helper to get payment display info
    const getPaymentDisplay = () => {
      if (confirmation.paymentMethod === 'cash') {
        return {
          icon: <DollarOutlined className="text-green-600 text-xl" />,
          text: "Cash Payment",
          subText: "Please pay at the counter or to your server."
        };
      } else {
        const bankNames: Record<string, string> = { visa: 'Visa', mastercard: 'Mastercard', amex: 'Amex' };
        const bankName = confirmation.selectedBank ? bankNames[confirmation.selectedBank] : 'Credit Card';
        return {
          icon: <CreditCardOutlined className="text-blue-600 text-xl" />,
          text: `Credit Card (${bankName})`,
          subText: "Payment processed successfully."
        };
      }
    };

    const paymentInfo = getPaymentDisplay();

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-emerald-500 p-6 text-white text-center">
            <CheckCircleOutlined className="text-5xl mb-2" />
            <Title level={2} className="!text-white !mb-0">Booking Confirmed!</Title>
            <Text className="text-white/90">Your park tickets are ready</Text>
          </div>
          <div className="p-8">
            <div className="bg-gray-50 rounded-lg p-5 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text type="secondary" className="text-sm">Visitor Name</Text>
                  <div className="mt-1"><Text strong>{confirmation.visitorName}</Text></div>
                </div>
                <div>
                  <Text type="secondary" className="text-sm">Visit Date</Text>
                  <div className="mt-1"><Text strong>{confirmation.visitDate}</Text></div>
                </div>
                <div>
                  <Text type="secondary" className="text-sm">Booking Time</Text>
                  <div className="mt-1"><Text strong>{confirmation.bookingTime}</Text></div>
                </div>
                <div>
                  <Text type="secondary" className="text-sm">Order ID</Text>
                  <div className="mt-1"><Text strong>PK-{Math.floor(Math.random() * 10000)}</Text></div>
                </div>
              </div>
            </div>

            {/* Payment Info Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center gap-4 border border-gray-100">
              <div className="p-3 bg-white rounded-full shadow-sm">
                {paymentInfo.icon}
              </div>
              <div>
                <div className="font-bold text-gray-800">{paymentInfo.text}</div>
                <div className="text-sm text-gray-500">{paymentInfo.subText}</div>
              </div>
            </div>

            <div className="mb-6">
              <Text strong className="block mb-3">Order Summary</Text>
              <div className="space-y-2">
                {confirmation.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                    <span>{item.name} <Text type="secondary" className="text-sm ml-1">x{item.quantity}</Text></span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Divider className="my-4" />
            <div className="flex justify-between items-center mb-8">
              <Title level={4} className="!mb-0">Total Paid</Title>
              <Title level={3} className="!mb-0 text-emerald-500">${confirmation.totalPrice.toFixed(2)}</Title>
            </div>

            <div className="space-y-3">
              <Button type="primary" size="large" icon={<ReloadOutlined />} onClick={startNewBooking} className="w-full h-12" style={{ backgroundColor: "#10b981" }}>Book More Tickets</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#10b981', borderRadius: 12 } }}>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <header className="bg-white shadow-sm sticky top-0 z-20 p-4 border-b">
          <div className="container mx-auto flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button size='large' icon={<ArrowLeftOutlined />} onClick={onBack}>Back</Button>
              <FileTextOutlined className="text-2xl" style={{ color: "#10b981" }} />
              <Title level={4} className="!mb-0" style={{ color: "#10b981" }}>Park Attractions</Title>
              <Tag color="#10b981" className="ml-2">City Park</Tag>
            </div>
            <Badge count={cartItemCount} style={{ backgroundColor: "#10b981" }}>
              <ShoppingCartOutlined className="text-2xl cursor-pointer" style={{ color: "#10b981" }} />
            </Badge>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center gap-3">
              <EnvironmentOutlined className="text-3xl" />
              <div>
                <Title level={3} className="!text-white !mb-0">Welcome to City Park</Title>
                <Text className="text-white/90">Discover amazing attractions and create memories</Text>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Attractions Grid */}
            <div className="flex-1">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <Title level={4} className="!mb-2">Attractions & Tickets</Title>
                <Text type="secondary" className="block mb-5">Explore our amazing park attractions</Text>
                <div className="space-y-8">
                  {categories.map(category => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
                        <Title level={5} className="!mb-0" style={{ color: "#10b981" }}>{category}</Title>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {groupedAttractions[category].map(attraction => (
                          <Card
                            key={attraction.id}
                            hoverable
                            className="h-full transition-all duration-300 hover:shadow-lg"
                            cover={
                              <div className="h-32 overflow-hidden bg-gray-100 rounded-t-xl">
                                <img src={attraction.image} className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" alt={attraction.name} />
                              </div>
                            }
                          >
                            <Card.Meta
                              title={<span className="font-semibold text-base">{attraction.name}</span>}
                              description={
                                <div className="mt-2">
                                  <div className="flex items-center justify-between mb-2">
                                    {renderRating(attraction.rating)}
                                    <Tag color="cyan" className="text-xs rounded-full">{attraction.duration}</Tag>
                                  </div>
                                  <Text type="secondary" className="text-xs block mb-3 line-clamp-2">{attraction.description}</Text>
                                  <div className="flex justify-between items-center mt-2">
                                    <div>
                                      <Text type="secondary" className="text-xs line-through decoration-gray-300">${(attraction.price + 2).toFixed(2)}</Text>
                                      <Text strong className="text-emerald-600 text-lg ml-2">${attraction.price.toFixed(2)}</Text>
                                    </div>
                                    <Button
                                      type="primary"
                                      size="middle"
                                      icon={<FileTextOutlined />}
                                      onClick={() => addToCart(attraction)}
                                      style={{ backgroundColor: "#10b981" }}
                                      className="rounded-full"
                                    >
                                      Buy
                                    </Button>
                                  </div>
                                </div>
                              }
                            />
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Sidebar */}
            <div className="lg:w-96 w-full">
              <div className="bg-white rounded-xl shadow-lg sticky top-24 border border-gray-100 overflow-hidden">
                <div className="bg-emerald-500 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ShoppingCartOutlined className="text-xl" />
                      <div className="!mb-0 !text-white">Your Tickets</div>
                    </div>
                    {cart.length > 0 && (
                      <Button type="text" danger onClick={clearCart} className="text-white hover:!text-red-200">
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  {cart.length === 0 ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No tickets selected"
                      className="py-8"
                    >
                      <Text type="secondary" className="text-sm">Browse attractions and add tickets to your cart</Text>
                    </Empty>
                  ) : (
                    <>
                      <List 
                        dataSource={cart} 
                        className="cart-scroll max-h-96 overflow-y-auto"
                        renderItem={(item) => (
                          <List.Item 
                            className="py-3"
                            actions={[
                              <div key="actions-group" className="flex items-center gap-4">
                                {/* Total Price for Item */}
                                <div className="text-right min-w-[60px]">
                                  <Text strong style={{ color: "#10b981" }} className="block">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </Text>
                                </div>

                                {/* Quantity Control */}
                                <div className="flex items-center border rounded-md overflow-hidden bg-gray-50">
                                  <Button 
                                    type="text" 
                                    size="small" 
                                    icon={<MinusOutlined />} 
                                    onClick={() => updateQuantity(item.id, -1)}
                                    style={{ color: "#10b981", padding: '0 8px' }}
                                  />
                                  <span className="px-2 text-sm font-medium min-w-[24px] text-center bg-white">
                                    {item.quantity}
                                  </span>
                                  <Button 
                                    type="text" 
                                    size="small" 
                                    icon={<PlusOutlined />} 
                                    onClick={() => updateQuantity(item.id, 1)}
                                    style={{ color: "#10b981", padding: '0 8px' }}
                                  />
                                </div>

                                {/* Delete Button */}
                                <Button 
                                  type="text" 
                                  danger 
                                  icon={<DeleteOutlined />} 
                                  onClick={() => updateQuantity(item.id, -100)} 
                                  className="hover:bg-red-50"
                                  title="Remove item"
                                />
                              </div>
                            ]}
                          >
                            <List.Item.Meta 
                              avatar={<img src={item.image} className="w-12 h-12 rounded object-cover border border-gray-100" />} 
                              title={<span className="font-medium text-gray-800">{item.name}</span>}
                              description={<span className="text-gray-500 text-sm">${item.price.toFixed(2)}</span>} 
                            />
                          </List.Item>
                        )} 
                      />
                      <Divider className="my-4" />
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Text className="text-gray-500">Subtotal</Text>
                          <Text strong>${totalPrice.toFixed(2)}</Text>
                        </div>
                        <div className="flex justify-between items-center">
                          <Text className="text-gray-500">Service Fee</Text>
                          <Text className="text-gray-500">$0.00</Text>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <Title level={5} className="!mb-0">Total</Title>
                          <Title level={5} className="!mb-0 text-emerald-600">
                            ${totalPrice.toFixed(2)}
                          </Title>
                        </div>

                        <Button
                          type="primary"
                          size="large"
                          icon={<CreditCardOutlined />}
                          onClick={openCheckoutModal}
                          disabled={cart.length === 0}
                          className="w-full mt-4 h-12 text-base font-semibold rounded-xl"
                          style={{ backgroundColor: "#10b981" }}
                        >
                          Checkout Now
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Info Card */}
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarOutlined className="text-emerald-600" />
                  <Text strong className="text-emerald-800">Park Information</Text>
                </div>
                <div className="space-y-1 text-sm text-emerald-700">
                  <Text className="text-sm">• Open daily: 9:00 AM - 8:00 PM</Text>
                  <Text className="text-sm block">• Tickets valid for selected date only</Text>
                  <Text className="text-sm block">• Free cancellation up to 24 hours before</Text>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Modal with Ant Design Form */}
        <Modal
          title={
            <div className="flex items-center gap-2 text-lg">
              <FileTextOutlined style={{ color: "#10b981" }} />
              <span>Complete Your Booking</span>
            </div>
          }
          open={checkoutModalOpen}
          onCancel={() => setCheckoutModalOpen(false)}
          onOk={handleCheckout}
          okText="Confirm Payment"
          cancelText="Cancel"
          confirmLoading={paymentLoading}
          width={480}
          style={{ top: 30 }}
          okButtonProps={{
            style: { backgroundColor: "#10b981" },
            size: "large",
            className: "w-full mt-2"
          }}
          cancelButtonProps={{ style: { display: 'none' } }}
          className="checkout-modal"
        >
          <div className="py-2">
            {/* Order Summary Section */}
            <div className="bg-emerald-50 rounded-xl p-4 mb-5">
              <div className="flex justify-between items-center mb-2">
                <Text strong className="text-emerald-800">Order Summary</Text>
                <Badge count={cart.length} style={{ backgroundColor: "#10b981" }} />
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {cart.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <Text className="text-emerald-700">{item.name} x{item.quantity}</Text>
                    <Text className="text-emerald-700">${(item.price * item.quantity).toFixed(2)}</Text>
                  </div>
                ))}
                {cart.length > 3 && (
                  <Text type="secondary" className="text-xs">+ {cart.length - 3} more items</Text>
                )}
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between">
                <Text strong>Total Amount</Text>
                <Text strong className="text-emerald-600 text-lg">${totalPrice.toFixed(2)}</Text>
              </div>
            </div>

            {/* Visitor Information Form */}
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              initialValues={{
                visitorName: 'John Doe',
                visitDate: dayjs().add(1, 'day'),
                email: 'john.doe@example.com'
              }}
            >
              <Form.Item
                name="visitorName"
                label={
                  <span className="font-medium">
                    <UserOutlined className="mr-1 text-emerald-500" />
                    Visitor Name
                  </span>
                }
                rules={[
                  { required: true, message: 'Please enter visitor name' },
                  { min: 2, message: 'Name must be at least 2 characters' }
                ]}
              >
                <Input
                  placeholder="Enter your full name"
                  size="large"
                  className="rounded-lg"
                  prefix={<UserOutlined className="text-gray-400" />}
                />
              </Form.Item>

              <Form.Item
                name="visitDate"
                label={
                  <span className="font-medium">
                    <CalendarOutlined className="mr-1 text-emerald-500" />
                    Visit Date
                  </span>
                }
                rules={[{ required: true, message: 'Please select visit date' }]}
                extra={<Text type="secondary" className="text-xs">Select your preferred date to visit the park</Text>}
              >
                <DatePicker
                  size="large"
                  className="w-full rounded-lg"
                  format="YYYY-MM-DD"
                  disabledDate={disabledDate}
                  placeholder="Choose a date"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={
                  <span className="font-medium">
                    Email Address (Optional)
                  </span>
                }
                rules={[{ type: 'email', message: 'Please enter a valid email' }]}
              >
                <Input
                  placeholder="your@email.com"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>
            </Form>

            {/* Payment Notice */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4">
              <div className="flex items-start gap-2">
                <CreditCardOutlined className="text-emerald-500 mt-0.5" />
                <Text type="secondary" className="text-xs">
                  Secure payment processing. Your tickets will be sent to your email after confirmation.
                </Text>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-4">
              <Text strong className="block mb-2">Payment Method</Text>
              <Radio.Group 
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  if (e.target.value !== 'credit_card') setSelectedBank(null);
                }} 
                value={paymentMethod} 
                className="w-full flex flex-col gap-2"
              >
                <Radio value="cash" className="border p-3 rounded-lg hover:bg-gray-50 w-full flex items-center">
                  <Space size="large">
                    <DollarOutlined className="text-green-600" />
                    <span className="font-medium">Cash</span>
                  </Space>
                </Radio>
                <Radio value="credit_card" className="border p-3 rounded-lg hover:bg-gray-50 w-full flex items-center">
                  <Space size="large">
                    <CreditCardOutlined className="text-blue-600" />
                    <span className="font-medium">Credit Card</span>
                  </Space>
                </Radio>
              </Radio.Group>
            </div>

            {/* Bank Selection (Conditional) */}
            {paymentMethod === 'credit_card' && (
              <div className="mb-6 animate-fade-in">
                <Text strong className="block mb-2 text-sm text-gray-600">Select Bank / Card Type</Text>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'visa', name: 'Visa', color: '#1A1F71' },
                    { id: 'mastercard', name: 'Mastercard', color: '#EB001B' },
                    { id: 'amex', name: 'Amex', color: '#006FCF' }
                  ].map((bank) => (
                    <div 
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id as BankType)}
                      className={`cursor-pointer border-2 rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                        selectedBank === bank.id 
                          ? 'border-[#10b981] bg-emerald-50' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <BankOutlined style={{ fontSize: '24px', color: selectedBank === bank.id ? '#10b981' : bank.color }} />
                      <span className={`text-xs font-bold ${selectedBank === bank.id ? 'text-[#10b981]' : 'text-gray-600'}`}>{bank.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </Modal>

        {/* Footer */}
        <footer className="bg-white border-t mt-16 py-6">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© 2025 City Park • Discover nature's wonders</p>
            <p className="mt-1">Book your adventure today!</p>
          </div>
        </footer>
      </div>
    </ConfigProvider>
  );
};

export default Ticketing;