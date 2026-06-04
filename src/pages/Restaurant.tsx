import React, { useState, useMemo, useCallback } from 'react';
import { ConfigProvider, message, Modal, Button as AntButton, Tabs, Card, List, Badge, Empty, Typography, Divider, Space, Radio } from 'antd';
import {
  ShoppingCartOutlined,
  PlusOutlined,
  DeleteOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  CoffeeOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined,
  MinusOutlined,
  BankOutlined,
  DollarOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import imgMargherita from '/asset/image/Restaurant/Margherita Pizza.png';
import imgCaesar from '/asset/image/Restaurant/Caesar Salad.png';
import imgSpaghetti from '/asset/image/Restaurant/Spaghetti Carbonara.png';
import imgTiramisu from '/asset/image/Restaurant/Tiramisu.png';
import imgCola from '/asset/image/Restaurant/Coca Cola.png';
import imgGarlic from '/asset/image/Restaurant/Garlic Bread.png';
import imgSalmon from '/asset/image/Restaurant/Grilled Salmon.png';
import imgChocolate from '/asset/image/Restaurant/Chocolate Lava Cake.png';
import imgMojito from '/asset/image/Restaurant/Mojito Mocktail.png';

const { Title, Text } = Typography;

interface TableOutlinedProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string; // 新增 color 属性
}
const TableOutlined: React.FC<TableOutlinedProps> = ({ className, style, color = "currentColor" }) => (
  <svg
    t="1780562913066"
    className={className}
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="7270"
    width="32"
    height="32"
    style={{ ...style, fill: color }} // 将颜色应用到 fill 上
  >
    <path
      d="M318.72 496.64h-116.48c-16.64 0-29.44-11.52-30.72-28.16l-14.08-153.6c-2.56-29.44-26.88-52.48-57.6-52.48h-12.8c-10.24 0-20.48 3.84-26.88 11.52-6.4 7.68-10.24 17.92-8.96 29.44l19.2 212.48c2.56 24.32 12.8 46.08 30.72 62.72 11.52 10.24 24.32 17.92 38.4 21.76l5.12 1.28-47.36 148.48c-1.28 5.12 1.28 10.24 6.4 11.52 5.12 1.28 10.24-1.28 11.52-6.4l16.64-55.04h194.56l16.64 55.04c1.28 3.84 5.12 6.4 8.96 6.4h2.56c5.12-1.28 7.68-6.4 6.4-11.52L314.88 601.6H345.6c20.48 0 35.84-16.64 35.84-35.84v-6.4c0-34.56-28.16-62.72-62.72-62.72z m1.28 185.6H136.96l24.32-80.64h134.4l24.32 80.64z m43.52-116.48c0 10.24-7.68 17.92-17.92 17.92H156.16c-37.12-3.84-65.28-33.28-67.84-70.4L69.12 300.8c0-5.12 1.28-10.24 5.12-15.36 3.84-3.84 8.96-6.4 14.08-6.4h12.8c20.48 0 38.4 15.36 39.68 35.84l14.08 153.6c2.56 25.6 23.04 44.8 48.64 44.8H320c24.32 0 44.8 20.48 44.8 44.8v7.68zM922.88 577.28c17.92-16.64 28.16-38.4 30.72-62.72L972.8 303.36c1.28-10.24-2.56-20.48-10.24-28.16-6.4-7.68-16.64-11.52-26.88-11.52h-12.8c-30.72 0-55.04 23.04-57.6 52.48l-14.08 153.6c-1.28 16.64-14.08 28.16-30.72 28.16H704c-34.56 0-62.72 28.16-62.72 62.72v6.4c0 20.48 16.64 35.84 35.84 35.84h32l-44.8 148.48c-1.28 5.12 1.28 10.24 6.4 11.52h2.56c3.84 0 7.68-2.56 8.96-6.4l16.64-55.04h194.56L908.8 755.2c1.28 5.12 6.4 7.68 11.52 6.4 5.12-1.28 7.68-6.4 6.4-11.52l-46.08-149.76 5.12-1.28c12.8-5.12 26.88-11.52 37.12-21.76z m-35.84 104.96H704l24.32-80.64h134.4l24.32 80.64z m-19.2-98.56H678.4c-10.24 0-17.92-7.68-17.92-17.92v-6.4c0-24.32 20.48-44.8 44.8-44.8h116.48c25.6 0 46.08-19.2 48.64-44.8l14.08-153.6c1.28-20.48 19.2-35.84 39.68-35.84h12.8c5.12 0 10.24 2.56 14.08 6.4 3.84 3.84 5.12 8.96 5.12 15.36l-19.2 212.48c-3.84 35.84-32 65.28-69.12 69.12z"
      p-id="7271"
    // 移除这里的 fill="#c90062"，由父级 svg 样式控制
    ></path>
    <path
      d="M610.56 723.2c-5.12-19.2-23.04-33.28-43.52-33.28h-12.8V431.36h176.64c12.8 0 23.04-10.24 23.04-23.04v-15.36c0-21.76-16.64-38.4-38.4-38.4H307.2c-21.76 0-38.4 16.64-38.4 38.4v15.36c0 12.8 10.24 23.04 23.04 23.04h176.64v244.48l-12.8 12.8c-20.48 0-38.4 14.08-43.52 33.28l-3.84 12.8c-1.28 6.4 0 12.8 3.84 17.92 3.84 5.12 10.24 7.68 16.64 7.68h162.56c6.4 0 12.8-2.56 16.64-7.68 3.84-5.12 5.12-11.52 3.84-17.92l-1.28-11.52zM286.72 408.32v-15.36c0-11.52 8.96-21.76 21.76-21.76H716.8c11.52 0 21.76 8.96 21.76 21.76v15.36c0 2.56-2.56 5.12-5.12 5.12H291.84c-2.56 1.28-5.12-1.28-5.12-5.12zM537.6 431.36v257.28h-51.2V431.36h51.2z m-111.36 312.32l3.84-16.64c2.56-11.52 14.08-20.48 25.6-20.48h112.64c11.52 0 23.04 7.68 25.6 20.48l3.84 16.64H426.24z"
      p-id="7272"
    // 移除这里的 fill="#c90062"
    ></path>
  </svg>
);

// ===================== TYPES =====================
interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

type PaymentMethod = 'cash' | 'credit_card' | null;
type BankType = 'visa' | 'mastercard' | 'amex' | null;

interface CompletedOrder {
  tableNumber: number;
  items: CartItem[];
  totalPrice: number;
  orderTime: string;
  paymentMethod: PaymentMethod;
  selectedBank: BankType;
}

// ===================== MOCK MENU DATA =====================
const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Margherita Pizza", category: "Mains", price: 12.99, image: imgMargherita, description: "Classic tomato, mozzarella & basil" },
  { id: 2, name: "Caesar Salad", category: "Starters", price: 8.99, image: imgCaesar, description: "Crispy romaine, parmesan, croutons" },
  { id: 3, name: "Spaghetti Carbonara", category: "Mains", price: 14.99, image: imgSpaghetti, description: "Eggs, pecorino, guanciale" },
  { id: 4, name: "Tiramisu", category: "Desserts", price: 6.99, image: imgTiramisu, description: "Classic Italian coffee dessert" },
  { id: 5, name: "Coca Cola", category: "Beverages", price: 2.99, image: imgCola, description: "Ice cold soda" },
  { id: 6, name: "Garlic Bread", category: "Starters", price: 4.99, image: imgGarlic, description: "Toasted bread with garlic butter" },
  { id: 7, name: "Grilled Salmon", category: "Mains", price: 18.99, image: imgSalmon, description: "Lemon butter sauce, vegetables" },
  { id: 8, name: "Chocolate Lava Cake", category: "Desserts", price: 7.99, image: imgChocolate, description: "Warm chocolate with melting center" },
  { id: 9, name: "Mojito Mocktail", category: "Beverages", price: 5.99, image: imgMojito, description: "Mint, lime, soda" },
];

const groupByCategory = (items: MenuItem[]) => {
  const grouped: Record<string, MenuItem[]> = {};
  items.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });
  return grouped;
};

// ===================== TABLE SELECTION MODAL =====================
interface TableSelectionModalProps {
  open: boolean;
  onConfirm: (tableNumber: number) => void;
  onCancel: () => void;
}

const TableSelectionModal: React.FC<TableSelectionModalProps> = ({ open, onConfirm, onCancel }) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedTable === null) {
      message.warning("Please select a table first");
      return;
    }
    onConfirm(selectedTable);
    setSelectedTable(null);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-xl">
          <EnvironmentOutlined style={{ color: "#c90062" }} />
          <span>Select Your Table</span>
        </div>
      }
      open={open}
      onOk={handleConfirm}
      onCancel={onCancel}
      okText="Confirm Seating"
      cancelText="Cancel"
      width={600}
      okButtonProps={{ style: { backgroundColor: "#c90062" }, size: "large" }}
    >
      <div className="py-4">
        <Text className="block mb-4 text-gray-600">Please choose an available table to start your dining experience.</Text>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {Array.from({ length: 20 }, (_, i) => i + 1).map(num => {
            const isSelected = selectedTable === num;
            return (
              <AntButton
                key={num}
                type={isSelected ? "primary" : "default"}
                onClick={() => setSelectedTable(num)}
                className={`h-16 text-lg font-semibold transition-all ${isSelected ? "shadow-lg scale-105" : "hover:shadow-md"}`}
                style={isSelected ? { backgroundColor: "#c90062", borderColor: "#c90062" } : {}}
              >
                <TableOutlined
                  className="mr-1"
                  color={isSelected ? "#ffffff" : "#c90062"}
                />
                {num}
              </AntButton>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

// ===================== RESTAURANT COMPONENT =====================
interface RestaurantProps {
  onBack: () => void;
}

const Restaurant: React.FC<RestaurantProps> = ({ onBack }) => {
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [showTableModal, setShowTableModal] = useState<boolean>(true);
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [selectedBank, setSelectedBank] = useState<BankType>(null);

  const totalCartPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const cartItemCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);
  const groupedMenu = useMemo(() => groupByCategory(MENU_ITEMS), []);
  const categories = Object.keys(groupedMenu);

  const handleTableConfirm = useCallback((selectedTable: number) => {
    setTableNumber(selectedTable);
    setSessionStarted(true);
    setShowTableModal(false);
    message.success(`Welcome! Seated at Table ${selectedTable}. Enjoy your meal! 🍽️`);
  }, []);

  const addToCart = useCallback((menuItem: MenuItem) => {
    if (!sessionStarted || !tableNumber) {
      message.warning("Please select a table first to start ordering");
      setShowTableModal(true);
      return;
    }
    if (orderPlaced) {
      message.info("Order completed. Please start a new order.");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === menuItem.id);
      if (existing) {
        return prev.map(item => item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...menuItem, quantity: 1 }];
    });
    message.success(`${menuItem.name} added to cart`);
  }, [sessionStarted, tableNumber, orderPlaced]);

  // Updated to handle increment/decrement
  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return null; // Mark for removal
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  }, []);

  const clearCart = useCallback(() => {
    Modal.confirm({
      title: "Clear Cart",
      content: "Remove all items?",
      okText: "Yes",
      onOk: () => {
        setCart([]);
        setPaymentMethod(null);
        setSelectedBank(null);
        message.info("Cart cleared");
      }
    });
  }, []);

  const handlePayment = useCallback(async () => {
    if (!sessionStarted || !tableNumber) {
      message.error("Please select a table first");
      setShowTableModal(true);
      return;
    }
    if (cart.length === 0) {
      message.error("Your cart is empty");
      return;
    }

    // Validation Logic
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

    // Save payment details to completed order
    setCompletedOrder({
      tableNumber,
      items: [...cart],
      totalPrice: totalCartPrice,
      orderTime: new Date().toLocaleTimeString(),
      paymentMethod,
      selectedBank
    });

    setOrderPlaced(true);
    setCart([]);
    setPaymentMethod(null);
    setSelectedBank(null);
    setPaymentLoading(false);
    message.success("Payment successful! 🎉");
  }, [sessionStarted, tableNumber, cart, totalCartPrice, paymentMethod, selectedBank]);

  const startNewOrder = useCallback(() => {
    setOrderPlaced(false);
    setCompletedOrder(null);
    setCart([]);
    setTableNumber(null);
    setSessionStarted(false);
    setShowTableModal(true);
    setPaymentMethod(null);
    setSelectedBank(null);
    message.info("Please select a table to start a new order.");
  }, []);

  const tabItems: TabsProps['items'] = categories.map(category => ({
    key: category,
    label: <span className="text-base font-medium">{category}</span>,
    children: (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {groupedMenu[category].map(item => (
          <Card key={item.id} hoverable className="h-full" cover={<div className="h-32 bg-gray-100"><img src={item.image} className="object-cover w-full h-full" alt={item.name} /></div>}
            actions={[<AntButton type="primary" icon={<PlusOutlined />} onClick={() => addToCart(item)} disabled={!sessionStarted || orderPlaced} style={{ backgroundColor: (!sessionStarted || orderPlaced) ? "#ccc" : "#c90062" }}>Add to Cart</AntButton>]}>
            <Card.Meta title={item.name} description={<><Text type="secondary" className="text-xs">{item.description}</Text><div className="mt-2"><Text strong style={{ color: "#c90062" }}>${item.price.toFixed(2)}</Text></div></>} />
          </Card>
        ))}
      </div>
    ),
  }));

  if (orderPlaced && completedOrder) {
    // Helper to get payment display info
    const getPaymentDisplay = () => {
      if (completedOrder.paymentMethod === 'cash') {
        return {
          icon: <DollarOutlined className="text-green-600 text-xl" />,
          text: "Cash Payment",
          subText: "Please pay at the counter or to your server."
        };
      } else {
        const bankNames: Record<string, string> = { visa: 'Visa', mastercard: 'Mastercard', amex: 'Amex' };
        const bankName = completedOrder.selectedBank ? bankNames[completedOrder.selectedBank] : 'Credit Card';
        return {
          icon: <CreditCardOutlined className="text-blue-600 text-xl" />,
          text: `Credit Card (${bankName})`,
          subText: "Payment processed successfully."
        };
      }
    };

    const paymentInfo = getPaymentDisplay();

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-primary p-6 text-white text-center" style={{ backgroundColor: "#c90062" }}>
            <CheckCircleOutlined className="text-5xl mb-2" />
            <Title level={2} className="!text-white !mb-0">Order Completed!</Title>
            <Text className="text-white/90">Thank you for dining with FlavorHub</Text>
          </div>
          <div className="p-8">
            <div className="flex justify-between border-b pb-4 mb-4">
              <Text strong className='text-[20px]'>#{completedOrder.tableNumber}</Text>
              <Text type="secondary">{completedOrder.orderTime}</Text>
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

            <div className="space-y-2 mb-6">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-dashed last:border-0">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Divider />

            <div className="flex justify-between mb-8">
              <Title level={4}>Total Paid</Title>
              <Title level={3} style={{ color: "#c90062" }}>${completedOrder.totalPrice.toFixed(2)}</Title>
            </div>

            <AntButton type="primary" size="large" icon={<ReloadOutlined />} onClick={startNewOrder} className="w-full" style={{ backgroundColor: "#c90062" }}>
              Start New Order
            </AntButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#c90062' } }}>
      <TableSelectionModal open={showTableModal} onConfirm={handleTableConfirm} onCancel={() => { if (!sessionStarted) message.warning("Please select a table"); else setShowTableModal(false); }} />
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-[2000] p-4 border-b">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4"><AntButton size='large' icon={<ArrowLeftOutlined />} onClick={onBack}>Back</AntButton><CoffeeOutlined className="text-2xl" style={{ color: "#c90062" }} /><Title level={4} className="!mb-0" style={{ color: "#c90062" }}>FlavorHub</Title></div>
            <div className="flex items-center gap-4">{sessionStarted && <div className='text-[#c90062] text-[30px] mr-6'># {tableNumber}</div>}<Badge count={cartItemCount} style={{ backgroundColor: "#c90062" }}><ShoppingCartOutlined className="text-2xl" style={{ color: "#c90062" }} /></Badge></div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          {!sessionStarted && (<div className="mb-6 p-4 bg-orange-50 rounded-xl text-center"><EnvironmentOutlined className="text-orange-500 mr-2" />Please select a table to start ordering<AntButton size="small" onClick={() => setShowTableModal(true)} className="ml-3" style={{ backgroundColor: "#c90062" }}>Select Table</AntButton></div>)}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white rounded-xl p-4"><Tabs defaultActiveKey={categories[0]} items={tabItems} /></div>
            <div className="lg:w-96 w-full">
              <div className="bg-white rounded-xl shadow-lg sticky top-24">
                <div className="bg-primary p-4 text-white rounded-tl-xl rounded-tr-xl" style={{ backgroundColor: "#c90062" }}><ShoppingCartOutlined className="mr-2" />Your Cart{cart.length > 0 && !orderPlaced && <AntButton type="text" danger onClick={clearCart} className="float-right text-white">Clear</AntButton>}</div>
                <div className="p-4">
                  {cart.length === 0 ? <Empty description={!sessionStarted ? "Select a table first" : "Cart empty"} /> : (
                    <>
                      <List
                        dataSource={cart}
                        renderItem={(item) => (
                          <List.Item
                            className="py-3"
                            actions={[
                              <div key="actions-group" className="flex items-center gap-3">
                                {/* Total Price for Item - Positioned before controls */}
                                <div className="text-right min-w-[60px]">
                                  <Text strong style={{ color: "#c90062" }} className="block">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </Text>
                                </div>

                                {/* Quantity Control */}
                                <div className="flex items-center border rounded-md overflow-hidden bg-gray-50">
                                  <AntButton
                                    type="text"
                                    icon={<MinusOutlined />}
                                    onClick={() => updateQuantity(item.id, -1)}
                                    style={{ color: "#c90062", padding: '0 8px' }}
                                  />
                                  <span className="px-1 text-sm font-medium min-w-[24px] text-center bg-white">
                                    {item.quantity}
                                  </span>
                                  <AntButton
                                    type="text"
                                    icon={<PlusOutlined />}
                                    onClick={() => updateQuantity(item.id, 1)}
                                    style={{ color: "#c90062", padding: '0 8px' }}
                                  />
                                </div>

                                {/* Delete Button */}
                                <AntButton
                                  type="text"
                                  danger
                                  size='large'
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

                      <div className="flex justify-between mb-4 items-end">
                        <Text strong className="text-lg">Total</Text>
                        <Text strong style={{ color: "#c90062" }} className="text-2xl">${totalCartPrice.toFixed(2)}</Text>
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
                                className={`cursor-pointer border-2 rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${selectedBank === bank.id
                                  ? 'border-[#c90062] bg-pink-50'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                                  }`}
                              >
                                <BankOutlined style={{ fontSize: '24px', color: selectedBank === bank.id ? '#c90062' : bank.color }} />
                                <span className={`text-xs font-bold ${selectedBank === bank.id ? 'text-[#c90062]' : 'text-gray-600'}`}>{bank.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <AntButton
                        type="primary"
                        size="large"
                        icon={<CreditCardOutlined />}
                        onClick={handlePayment}
                        loading={paymentLoading}
                        disabled={!sessionStarted || cart.length === 0}
                        className="w-full mt-2"
                        style={{ backgroundColor: "#c90062", height: '48px', fontSize: '16px' }}
                      >
                        Pay Now
                      </AntButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Restaurant;