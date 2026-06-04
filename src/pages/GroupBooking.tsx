// src/pages/GroupBooking.tsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  ConfigProvider,
  Card,
  Button,
  Typography,
  Tag,
  Divider,
  Space,
  Alert,
  Result,
  Descriptions,
  Modal,
  message,
  Input,
  InputNumber,
  Select,
  DatePicker,
  TimePicker,
  Badge,
  Steps,
  Form,
  Row,
  Col,
  List,
  Radio,
  QRCode,
  Empty,
  Tooltip,
  Spin
} from 'antd';
import {
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  QrcodeOutlined,
  DownloadOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  WalletOutlined,
  GiftOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { Step } = Steps;

// ===================== TYPES =====================
interface Resource {
  id: number;
  name: string;
  category: 'room' | 'equipment' | 'staff';
  totalStock: number;
  availableStock: number;
  pricePerUnit: number;
  priceUnit: string;
  description: string;
}

interface BookingItem {
  resourceId: number;
  resourceName: string;
  category: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

interface BookingInfo {
  bookingId: string;
  groupName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  eventDate: string;
  eventTime: string;
  duration: number;
  items: BookingItem[];
  subtotal: number;
  deposit: number;
  depositPaid: number;
  remainingAmount: number;
  paymentMethod: 'epos' | 'onsite';
  paymentStatus: 'deposit_paid' | 'fully_paid' | 'pending';
  qrCode: string;
  createdAt: string;
}

interface BookingFormValues {
  groupName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  eventDate: Dayjs;
  eventTime: Dayjs;
  duration: number;
}

// ===================== MOCK RESOURCES DATA =====================
const RESOURCES: Resource[] = [
  { id: 1, name: 'Conference Hall A', category: 'room', totalStock: 1, availableStock: 1, pricePerUnit: 500, priceUnit: 'hour', description: 'Capacity: 100 people, projector, sound system' },
  { id: 2, name: 'Meeting Room B', category: 'room', totalStock: 2, availableStock: 2, pricePerUnit: 200, priceUnit: 'hour', description: 'Capacity: 30 people, whiteboard, TV' },
  { id: 3, name: 'Outdoor Pavilion', category: 'room', totalStock: 1, availableStock: 1, pricePerUnit: 300, priceUnit: 'hour', description: 'Capacity: 50 people, BBQ area, garden view' },
  { id: 4, name: 'VIP Lounge', category: 'room', totalStock: 1, availableStock: 1, pricePerUnit: 800, priceUnit: 'hour', description: 'Capacity: 20 people, premium service' },
  { id: 5, name: 'Projector + Screen', category: 'equipment', totalStock: 5, availableStock: 4, pricePerUnit: 50, priceUnit: 'day', description: 'HD projector, 100" screen' },
  { id: 6, name: 'Portable Speaker', category: 'equipment', totalStock: 8, availableStock: 6, pricePerUnit: 30, priceUnit: 'day', description: 'Bluetooth, 50W output' },
  { id: 7, name: 'Wireless Microphone', category: 'equipment', totalStock: 10, availableStock: 8, pricePerUnit: 20, priceUnit: 'day', description: '2 microphones + receiver' },
  { id: 8, name: 'Whiteboard Set', category: 'equipment', totalStock: 6, availableStock: 5, pricePerUnit: 15, priceUnit: 'day', description: 'Magnetic whiteboard + markers' },
  { id: 9, name: 'Catering Set (50 pax)', category: 'equipment', totalStock: 3, availableStock: 2, pricePerUnit: 100, priceUnit: 'event', description: 'Plates, cups, cutlery for 50' },
  { id: 10, name: 'Event Coordinator', category: 'staff', totalStock: 4, availableStock: 3, pricePerUnit: 150, priceUnit: 'hour', description: 'Professional event coordination' },
  { id: 11, name: 'Security Guard', category: 'staff', totalStock: 6, availableStock: 5, pricePerUnit: 80, priceUnit: 'hour', description: 'Licensed security personnel' },
  { id: 12, name: 'Clean-up Crew', category: 'staff', totalStock: 5, availableStock: 4, pricePerUnit: 60, priceUnit: 'hour', description: 'Post-event cleaning service' },
  { id: 13, name: 'Tech Support', category: 'staff', totalStock: 3, availableStock: 2, pricePerUnit: 100, priceUnit: 'hour', description: 'AV equipment setup & support' },
  { id: 14, name: 'Photographer', category: 'staff', totalStock: 2, availableStock: 2, pricePerUnit: 200, priceUnit: 'hour', description: 'Professional event photography' },
];

const groupByCategory = (items: Resource[]) => {
  const grouped: Record<string, Resource[]> = {};
  items.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });
  return grouped;
};

const categoryLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  room: { label: 'Rooms & Venues', color: '#f97316', icon: <EnvironmentOutlined /> },
  equipment: { label: 'Equipment & Supplies', color: '#10b981', icon: <GiftOutlined /> },
  staff: { label: 'Staff Allocation', color: '#6366f1', icon: <TeamOutlined /> },
};

const escapeHtml = (text: string) => {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
};

// ===================== GROUP BOOKING COMPONENT =====================
interface GroupBookingProps {
  onBack: () => void;
}

const GroupBooking: React.FC<GroupBookingProps> = ({ onBack }) => {
  const [form] = Form.useForm<BookingFormValues>();
  const [cart, setCart] = useState<BookingItem[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'epos' | 'onsite'>('epos');
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const groupedResources = useMemo(() => groupByCategory(RESOURCES), []);
  const categories = Object.keys(groupedResources);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.totalPrice, 0), [cart]);
  const defaultDeposit = useMemo(() => Math.round(subtotal * 0.3 * 100) / 100, [subtotal]);
  const remainingAmount = useMemo(() => subtotal - depositAmount, [subtotal, depositAmount]);

  const generateQRContent = (booking: BookingInfo) => {
    return JSON.stringify({
      bookingId: booking.bookingId,
      groupName: booking.groupName,
      eventDate: booking.eventDate,
      eventTime: booking.eventTime,
    });
  };

  // 从 QRCode 组件获取 canvas 图片的 DataURL
  const getQRCodeFromCanvas = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      // 多次尝试获取 canvas，因为 QRCode 组件渲染需要时间
      let attempts = 0;
      const maxAttempts = 20; // 最多尝试 2 秒

      const tryGetCanvas = () => {
        attempts++;
        // 尝试从多种可能的 canvas 选择器中获取
        const canvas = document.querySelector('#qr-code-canvas canvas') as HTMLCanvasElement;

        if (canvas && canvas.width > 0 && canvas.height > 0) {
          try {
            const dataUrl = canvas.toDataURL('image/png');
            resolve(dataUrl);
            return;
          } catch (e) {
            console.error('Canvas toDataURL error:', e);
          }
        }

        if (attempts < maxAttempts) {
          setTimeout(tryGetCanvas, 100);
        } else {
          // 如果获取失败，生成一个备用的二维码图片
          console.warn('Could not get QR code from canvas, using fallback');
          resolve('');
        }
      };

      tryGetCanvas();
    });
  }, []);

  // 打开二维码 Modal 并保存图片
  const handleShowQRCode = useCallback(async () => {
    setShowQRModal(true);
    // 等待 QRCode 组件渲染完成
    setTimeout(async () => {
      const dataUrl = await getQRCodeFromCanvas();
      if (dataUrl) {
        setQrCodeDataUrl(dataUrl);
        message.success('QR Code generated');
      }
    }, 500);
  }, [getQRCodeFromCanvas]);

  // 打印订单票
  const handlePrintTicket = useCallback(async () => {
    if (!bookingInfo) return;

    setIsPrinting(true);
    message.loading('Generating QR code...', 0);

    try {
      let qrImageSrc = qrCodeDataUrl;

      // 如果还没有二维码图片，先打开 Modal 让二维码渲染
      if (!qrImageSrc) {
        // 打开 Modal（如果还没打开）
        if (!showQRModal) {
          setShowQRModal(true);
          // 等待 QRCode 组件渲染
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        // 从 canvas 获取图片
        qrImageSrc = await getQRCodeFromCanvas();

        if (qrImageSrc) {
          setQrCodeDataUrl(qrImageSrc);
        }

        // 关闭 Modal（可选，保持打开让用户看到也可以）
        // setShowQRModal(false);
      }

      // 生成打印内容
      const ticketHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Event Ticket - ${bookingInfo.bookingId}</title>
          <meta charset="utf-8" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
              background: #f0f0f0;
              padding: 40px 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .ticket {
              max-width: 500px;
              width: 100%;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.15);
              overflow: hidden;
              border: 1px solid #e5e7eb;
            }
            .ticket-header {
              background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
              color: white;
              padding: 24px;
              text-align: center;
            }
            .ticket-header h1 { font-size: 28px; margin-bottom: 8px; font-weight: 700; }
            .ticket-header p { font-size: 12px; opacity: 0.9; }
            .ticket-body { padding: 24px; }
            .qr-section {
              text-align: center;
              padding: 20px;
              background: #f9fafb;
              border-radius: 12px;
              margin-bottom: 24px;
            }
            .qr-section img {
              margin: 0 auto;
              border-radius: 12px;
              display: block;
              max-width: 100%;
              height: auto;
            }
            .qr-section p { margin-top: 12px; font-size: 12px; color: #6b7280; }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #f0f0f0;
            }
            .info-label { font-weight: 600; color: #6b7280; font-size: 13px; }
            .info-value { font-weight: 500; color: #1f2937; font-size: 13px; text-align: right; }
            .items-table {
              width: 100%;
              margin: 16px 0;
              border-collapse: collapse;
            }
            .items-table th {
              text-align: left;
              padding: 8px 0;
              font-size: 12px;
              color: #6b7280;
              font-weight: 600;
              border-bottom: 1px solid #e5e7eb;
            }
            .items-table td {
              padding: 8px 0;
              font-size: 13px;
              border-bottom: 1px solid #f0f0f0;
            }
            .items-table td:last-child { text-align: right; }
            .total-section {
              margin-top: 16px;
              padding-top: 16px;
              border-top: 2px solid #f97316;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
            }
            .total-row span:first-child { color: #6b7280; }
            .total-amount {
              font-size: 18px;
              font-weight: 700;
              color: #f97316;
            }
            .footer {
              background: #f9fafb;
              padding: 16px 24px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer p { font-size: 10px; color: #9ca3af; margin: 4px 0; }
            @media print {
              body { padding: 0; background: white; }
              .ticket { box-shadow: none; border: 1px solid #e5e7eb; margin: 0; max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="ticket-header">
              <h1>🎫 City Park</h1>
              <p>Group Event Ticket</p>
            </div>
            <div class="ticket-body">
              <div class="qr-section">
                ${qrImageSrc ? `<img src="${qrImageSrc}" alt="QR Code" width="160" height="160" />` : '<div style="width:160px;height:160px;background:#f97316;margin:0 auto;display:flex;align-items:center;justify-content:center;border-radius:12px;color:white;font-size:14px;">City Park</div>'}
                <p>Scan to verify ticket</p>
              </div>
              <div class="info-row">
                <span class="info-label">Booking ID</span>
                <span class="info-value">${escapeHtml(bookingInfo.bookingId)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Group Name</span>
                <span class="info-value">${escapeHtml(bookingInfo.groupName)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Contact Person</span>
                <span class="info-value">${escapeHtml(bookingInfo.contactPerson)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Contact Phone</span>
                <span class="info-value">${escapeHtml(bookingInfo.contactPhone)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Event Date & Time</span>
                <span class="info-value">${bookingInfo.eventDate} ${bookingInfo.eventTime}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Duration</span>
                <span class="info-value">${bookingInfo.duration} hours</span>
              </div>
              <table class="items-table">
                <thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th></tr></thead>
                <tbody>
                  ${bookingInfo.items.map(item => `
                    <tr>
                      <td>${escapeHtml(item.resourceName)}</td>
                      <td style="text-align:center">${item.quantity}</td>
                      <td style="text-align:right">$${item.totalPrice.toFixed(2)}</td>
                    </table>
                  `).join('')}
                </tbody>
              </table>
              <div class="total-section">
                <div class="total-row"><span>Subtotal</span><span>$${bookingInfo.subtotal.toFixed(2)}</span></div>
                <div class="total-row"><span>Deposit Paid</span><span style="color:#f97316;font-weight:600;">$${bookingInfo.depositPaid.toFixed(2)}</span></div>
                ${bookingInfo.remainingAmount > 0 ? `<div class="total-row"><span>Remaining Balance</span><span style="color:#dc2626;font-weight:600;">$${bookingInfo.remainingAmount.toFixed(2)}</span></div>` : ''}
                <div class="total-row" style="margin-top:12px;padding-top:12px;border-top:2px solid #f97316;">
                  <span style="font-size:16px;font-weight:700;">Total</span>
                  <span class="total-amount">$${bookingInfo.subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>This ticket is valid for the event date and time shown above.</p>
              <p>Please present this ticket (printed or digital) at the entrance.</p>
              <p style="margin-top:8px;">© City Park | Customer Support: +1 234 567 8900</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }, 300);
            };
          <\/script>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(ticketHtml);
        printWindow.document.close();
      }

      message.destroy();
      message.success('Print ticket ready');
    } catch (error) {
      console.error('Print error:', error);
      message.destroy();
      message.error('Failed to generate QR code');
    } finally {
      setIsPrinting(false);
    }
  }, [bookingInfo, qrCodeDataUrl, showQRModal, getQRCodeFromCanvas]);

  // 确认预订后自动打开 Modal 生成二维码（但保持隐藏或让用户看到）
  useEffect(() => {
    if (bookingConfirmed && bookingInfo && !qrCodeDataUrl) {
      // 自动打开 Modal 让二维码生成
      setShowQRModal(true);

      // 延迟获取二维码图片
      const timer = setTimeout(async () => {
        const dataUrl = await getQRCodeFromCanvas();
        if (dataUrl) {
          setQrCodeDataUrl(dataUrl);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [bookingConfirmed, bookingInfo, qrCodeDataUrl, getQRCodeFromCanvas]);

  const addToCart = useCallback((resource: Resource) => {
    setCart(prev => {
      const existing = prev.find(item => item.resourceId === resource.id);
      if (existing) {
        return prev.map(item =>
          item.resourceId === resource.id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.pricePerUnit }
            : item
        );
      }
      return [...prev, {
        resourceId: resource.id,
        resourceName: resource.name,
        category: resource.category,
        quantity: 1,
        pricePerUnit: resource.pricePerUnit,
        totalPrice: resource.pricePerUnit,
      }];
    });
    message.success(`${resource.name} added to booking`);
  }, []);

  const updateQuantity = useCallback((resourceId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.resourceId !== resourceId));
      return;
    }
    setCart(prev => prev.map(item =>
      item.resourceId === resourceId ? { ...item, quantity, totalPrice: quantity * item.pricePerUnit } : item
    ));
  }, []);

  const removeFromCart = useCallback((resourceId: number) => {
    setCart(prev => prev.filter(item => item.resourceId !== resourceId));
    message.info('Item removed from booking');
  }, []);

  const clearCart = useCallback(() => {
    Modal.confirm({
      title: 'Clear Booking',
      content: 'Are you sure you want to clear all items?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => { setCart([]); message.info('Booking cleared'); }
    });
  }, []);

  const nextStep = () => {
    if (currentStep === 0 && cart.length === 0) {
      message.error('Please add at least one resource to continue');
      return;
    }
    if (currentStep === 0) setDepositAmount(defaultDeposit);
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmitBooking = useCallback(async () => {
    try {
      const groupName = form.getFieldValue('groupName');
      const contactPerson = form.getFieldValue('contactPerson');
      const contactPhone = form.getFieldValue('contactPhone');
      const contactEmail = form.getFieldValue('contactEmail');
      const eventDate = form.getFieldValue('eventDate');
      const eventTime = form.getFieldValue('eventTime');
      const duration = form.getFieldValue('duration');

      if (!groupName || !contactPerson || !contactPhone || !contactEmail || !eventDate || !eventTime || !duration) {
        message.error('Please fill in all required fields');
        return;
      }
      if (cart.length === 0) {
        message.error('Please add resources to your booking');
        return;
      }

      setPaymentLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const bookingId = `GRP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const eventDateStr = dayjs.isDayjs(eventDate) ? eventDate.format('YYYY-MM-DD') : String(eventDate);
      const eventTimeStr = dayjs.isDayjs(eventTime) ? eventTime.format('HH:mm') : String(eventTime);

      const newBooking: BookingInfo = {
        bookingId,
        groupName,
        contactPerson,
        contactPhone,
        contactEmail,
        eventDate: eventDateStr,
        eventTime: eventTimeStr,
        duration: duration || 2,
        items: [...cart],
        subtotal,
        deposit: depositAmount,
        depositPaid: depositAmount,
        remainingAmount,
        paymentMethod,
        paymentStatus: remainingAmount === 0 ? 'fully_paid' : 'deposit_paid',
        qrCode: `${bookingId}|${groupName}|${eventDateStr}`,
        createdAt: new Date().toLocaleString()
      };

      setBookingInfo(newBooking);
      setBookingConfirmed(true);
      setPaymentLoading(false);
      message.success('Booking confirmed! A deposit has been collected.');
    } catch (error) {
      message.error('Please fill in all required fields correctly');
      setPaymentLoading(false);
    }
  }, [form, cart, subtotal, depositAmount, remainingAmount, paymentMethod]);

  const startNewBooking = () => {
    setBookingConfirmed(false);
    setBookingInfo(null);
    setCart([]);
    setCurrentStep(0);
    setDepositAmount(0);
    setPaymentMethod('epos');
    setQrCodeDataUrl('');
    setShowQRModal(false);
    form.resetFields();
  };

  const getStockStatus = (resource: Resource) => {
    if (resource.availableStock === 0) return <Tag color="red">Out of Stock</Tag>;
    if (resource.availableStock <= resource.totalStock * 0.2) return <Tag color="orange">Low Stock ({resource.availableStock} left)</Tag>;
    return <Tag color="green">In Stock ({resource.availableStock})</Tag>;
  };

  const renderResourceCard = (resource: Resource) => (
    <Card key={resource.id} hoverable size="small" className="h-full" styles={{ body: { padding: '16px' } }}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <Text strong className="text-base">{resource.name}</Text>
          <div className="mt-1">{getStockStatus(resource)}</div>
        </div>
        <Text strong style={{ color: '#f97316' }}>${resource.pricePerUnit}/{resource.priceUnit}</Text>
      </div>
      <Text type="secondary" className="text-xs block mb-3">{resource.description}</Text>
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-gray-400" />
          <Text type="secondary" className="text-sm">${resource.pricePerUnit} / {resource.priceUnit}</Text>
        </div>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => addToCart(resource)} disabled={resource.availableStock === 0} style={{ backgroundColor: resource.availableStock === 0 ? '#ccc' : '#f97316' }}>
          Add
        </Button>
      </div>
    </Card>
  );

  const renderCartItem = (item: BookingItem) => (
    <List.Item key={item.resourceId} className="!px-0" actions={[
      <Space size="small" key="actions">
        <InputNumber min={1} max={99} size="small" value={item.quantity} onChange={(val) => updateQuantity(item.resourceId, val || 1)} className="w-16" />
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeFromCart(item.resourceId)} size="small" />
      </Space>
    ]}>
      <List.Item.Meta title={<Text strong>{item.resourceName}</Text>} description={`$${item.pricePerUnit} per unit`} />
      <div style={{ color: '#f97316' }}>${item.totalPrice.toFixed(2)}</div>
    </List.Item>
  );

  // 确认页面
  if (bookingConfirmed && bookingInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-5xl mx-auto">
          <Button size='large' icon={<ArrowLeftOutlined />} onClick={onBack} className="mb-4">Back to Services</Button>

          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#f97316' }} />}
            title="Group Booking Confirmed!"
            subTitle={`Booking ID: ${bookingInfo.bookingId}`}
            extra={[
              <Button
                key="print"
                icon={<PrinterOutlined />}
                onClick={handlePrintTicket}
                loading={isPrinting}
              >
                Print Ticket
              </Button>,
              <Button key="qr" type="primary" icon={<QrcodeOutlined />} onClick={handleShowQRCode} style={{ backgroundColor: '#f97316' }}>Show QR Code</Button>,
              <Button key="new" onClick={startNewBooking} icon={<ReloadOutlined />}>New Booking</Button>,
            ]}
          />

          <Modal
            title="Event QR Code"
            open={showQRModal}
            onCancel={() => setShowQRModal(false)}
            footer={[<Button key="close" type="primary" onClick={() => setShowQRModal(false)}>Close</Button>]}
            width={400}
            className="text-center"
          >
            <div className="flex flex-col items-center py-4" id="qr-code-canvas">
              <QRCode value={generateQRContent(bookingInfo)} size={200} />
              <Text strong className="mt-4">{bookingInfo.bookingId}</Text>
              <Text type="secondary" className="text-sm">{bookingInfo.groupName}</Text>
              <Text type="secondary" className="text-xs mt-2">{bookingInfo.eventDate} {bookingInfo.eventTime}</Text>
            </div>
          </Modal>

          <div className="mt-6 space-y-6">
            <Card title="Booking Details" className="shadow-md">
              <Descriptions column={{ xs: 1, sm: 2, md: 2 }} bordered size="middle" labelStyle={{ fontWeight: 600, backgroundColor: '#fafafa', width: '140px' }} contentStyle={{ backgroundColor: '#ffffff' }}>
                <Descriptions.Item label="Booking ID"><Tag color="orange">{bookingInfo.bookingId}</Tag></Descriptions.Item>
                <Descriptions.Item label="Created At">{bookingInfo.createdAt}</Descriptions.Item>
                <Descriptions.Item label="Group Name" span={2}><TeamOutlined className="text-orange-500 mr-1" />{bookingInfo.groupName}</Descriptions.Item>
                <Descriptions.Item label="Contact Person"><UserOutlined className="text-gray-400 mr-1" />{bookingInfo.contactPerson}</Descriptions.Item>
                <Descriptions.Item label="Contact Phone"><PhoneOutlined className="text-gray-400 mr-1" />{bookingInfo.contactPhone}</Descriptions.Item>
                <Descriptions.Item label="Contact Email" span={2}><MailOutlined className="text-gray-400 mr-1" />{bookingInfo.contactEmail}</Descriptions.Item>
                <Descriptions.Item label="Event Date"><CalendarOutlined className="text-orange-500 mr-1" />{bookingInfo.eventDate}</Descriptions.Item>
                <Descriptions.Item label="Event Time"><ClockCircleOutlined className="text-orange-500 mr-1" />{bookingInfo.eventTime}</Descriptions.Item>
                <Descriptions.Item label="Duration"><ClockCircleOutlined className="text-gray-400 mr-1" />{bookingInfo.duration} hours</Descriptions.Item>
                <Descriptions.Item label="Payment Method">{bookingInfo.paymentMethod === 'epos' ? <Tag color="blue" icon={<CreditCardOutlined />}>EPOS Terminal</Tag> : <Tag color="green" icon={<WalletOutlined />}>Onsite Ticket Office</Tag>}</Descriptions.Item>
                <Descriptions.Item label="Payment Status" span={2}>
                  {bookingInfo.paymentStatus === 'fully_paid' ? <Tag color="green" icon={<CheckCircleOutlined />}>Fully Paid</Tag> : <Tag color="orange" icon={<DollarOutlined />}>Deposit Paid (Balance: ${bookingInfo.remainingAmount})</Tag>}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Order Summary" className="shadow-md">
              {bookingInfo.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {item.category === 'room' && <EnvironmentOutlined className="text-orange-500" />}
                    {item.category === 'equipment' && <GiftOutlined className="text-emerald-500" />}
                    {item.category === 'staff' && <TeamOutlined className="text-indigo-500" />}
                    <div><Text strong>{item.resourceName}</Text><div className="text-xs text-gray-500">Quantity: {item.quantity}</div></div>
                  </div>
                  <Text strong className="text-orange-600">${item.totalPrice.toFixed(2)}</Text>
                </div>
              ))}
              <Divider className="my-4" />
              <div className="space-y-3">
                <div className="flex justify-between"><Text className="text-gray-500">Subtotal</Text><Text strong>${bookingInfo.subtotal.toFixed(2)}</Text></div>
                <div className="flex justify-between"><Text className="text-gray-500">Deposit Paid</Text><Text strong className="text-orange-600">${bookingInfo.depositPaid.toFixed(2)}</Text></div>
                {bookingInfo.remainingAmount > 0 && <div className="flex justify-between"><Text className="text-gray-500">Remaining Balance</Text><Text strong className="text-red-500">${bookingInfo.remainingAmount.toFixed(2)}</Text></div>}
                <Divider className="my-2" />
                <div className="flex justify-between"><Text strong className="text-lg">Total</Text><Text strong className="text-lg text-orange-600">${bookingInfo.subtotal.toFixed(2)}</Text></div>
              </div>
            </Card>

            <Card title="Included Resources" className="shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bookingInfo.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {item.category === 'room' && <EnvironmentOutlined className="text-orange-500" />}
                    {item.category === 'equipment' && <GiftOutlined className="text-emerald-500" />}
                    {item.category === 'staff' && <TeamOutlined className="text-indigo-500" />}
                    <div className="flex-1"><Text strong>{item.resourceName}</Text><div className="flex gap-2 mt-1"><Tag className="text-xs">Quantity: {item.quantity}</Tag><Text type="secondary" className="text-xs">${item.pricePerUnit} each</Text></div></div>
                    <Text strong className="text-orange-600">${item.totalPrice.toFixed(2)}</Text>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // 主预定流程
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#f97316', borderRadius: 12 } }}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <header className="bg-white shadow-sm sticky top-0 z-20 p-4 border-b">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button size='large' icon={<ArrowLeftOutlined />} onClick={onBack}>Back</Button>
              <TeamOutlined className="text-2xl" style={{ color: "#f97316" }} />
              <Title level={4} className="!mb-0" style={{ color: "#f97316" }}>Group Event Booking</Title>
              <Tag color="#f97316">Corporate & Group Events</Tag>
            </div>
            <Badge count={cart.length} style={{ backgroundColor: "#f97316" }}><ShoppingCartOutlined className="text-2xl" style={{ color: "#f97316" }} /></Badge>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Steps current={currentStep} className="mb-8 max-w-2xl mx-auto">
            <Step title="Select Resources" icon={<GiftOutlined />} />
            <Step title="Booking Details" icon={<FileTextOutlined />} />
            <Step title="Payment" icon={<CreditCardOutlined />} />
          </Steps>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {currentStep === 0 && (
                <Card title="Available Resources & Inventory" className="shadow-md">
                  {categories.map(category => (
                    <div key={category} className="mb-6">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                        {categoryLabels[category]?.icon}
                        <Title level={5} className="!mb-0" style={{ color: categoryLabels[category]?.color }}>{categoryLabels[category]?.label}</Title>
                        <Badge count={groupedResources[category].length} style={{ backgroundColor: categoryLabels[category]?.color }} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupedResources[category].map(resource => renderResourceCard(resource))}
                      </div>
                    </div>
                  ))}
                  <Divider />
                  <div className="flex justify-end">
                    <Button type="primary" size="large" onClick={nextStep} disabled={cart.length === 0} style={{ backgroundColor: "#f97316" }}>Continue to Details</Button>
                  </div>
                </Card>
              )}

              {currentStep === 1 && (
                <Card title="Booking Information" className="shadow-md">
                  <Form form={form} layout="vertical" initialValues={{
                    groupName: 'My Corporate Group',
                    contactPerson: 'John Doe',
                    contactPhone: '123-456-7890',
                    contactEmail: 'john.doe@example.com',
                    duration: 2,
                    eventDate: dayjs().add(7, 'day'),
                    eventTime: dayjs().hour(10).minute(0)
                  }}>
                    <Row gutter={16}>
                      <Col xs={24} md={12}><Form.Item name="groupName" label="Group Name" rules={[{ required: true }]}><Input prefix={<TeamOutlined />} size="large" placeholder="Group name" /></Form.Item></Col>
                      <Col xs={24} md={12}><Form.Item name="contactPerson" label="Contact Person" rules={[{ required: true }]}><Input prefix={<UserOutlined />} size="large" placeholder="Full name" /></Form.Item></Col>
                      <Col xs={24} md={12}><Form.Item name="contactPhone" label="Phone" rules={[{ required: true }]}><Input prefix={<PhoneOutlined />} size="large" placeholder="Phone number" /></Form.Item></Col>
                      <Col xs={24} md={12}><Form.Item name="contactEmail" label="Email" rules={[{ required: true, type: 'email' }]}><Input prefix={<MailOutlined />} size="large" placeholder="Email" /></Form.Item></Col>
                      <Col xs={24} md={8}><Form.Item name="eventDate" label="Event Date" rules={[{ required: true }]}><DatePicker className="w-full" size="large" disabledDate={(current) => current && current < dayjs().startOf('day')} /></Form.Item></Col>
                      <Col xs={24} md={8}><Form.Item name="eventTime" label="Event Time" rules={[{ required: true }]}><TimePicker className="w-full" size="large" format="HH:mm" /></Form.Item></Col>
                      <Col xs={24} md={8}><Form.Item name="duration" label="Duration (hours)" rules={[{ required: true }]}><InputNumber className="w-full" size="large" min={1} max={12} /></Form.Item></Col>
                    </Row>
                  </Form>
                  <Divider />
                  <div className="flex justify-between"><Button onClick={prevStep}>Back</Button><Button type="primary" size="large" onClick={nextStep} style={{ backgroundColor: "#f97316" }}>Continue to Payment</Button></div>
                </Card>
              )}

              {currentStep === 2 && (
                <Card title="Payment & Deposit" className="shadow-md">
                  <Alert message="Deposit Required" description="30% deposit required to secure booking. Balance due on event day." type="info" showIcon className="mb-4" />
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-2"><Text>Subtotal</Text><Text strong>${subtotal.toFixed(2)}</Text></div>
                    <div className="flex justify-between items-center"><Text>Deposit (30%)</Text><InputNumber value={depositAmount} onChange={(val) => setDepositAmount(val || 0)} min={0} max={subtotal} step={10} precision={2} className="w-32" /></div>
                    <div className="flex justify-between mt-2 pt-2 border-t"><Text type="secondary">Remaining Balance</Text><Text type="danger" strong>${remainingAmount.toFixed(2)}</Text></div>
                  </div>
                  <div className="mb-4"><Text strong className="block mb-2">Payment Method</Text><Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}><Space direction="vertical"><Radio value="epos"><CreditCardOutlined /> EPOS Terminal</Radio><Radio value="onsite"><WalletOutlined /> Onsite Ticket Office</Radio></Space></Radio.Group></div>
                  {paymentMethod === 'epos' && <div className="bg-blue-50 p-3 rounded-lg mb-4"><Text className="text-sm text-blue-700">Secure EPOS payment processing.</Text></div>}
                  {paymentMethod === 'onsite' && <div className="bg-green-50 p-3 rounded-lg mb-4"><Text className="text-sm text-green-700">Pay at venue. Booking held for 48 hours.</Text></div>}
                  <Divider />
                  <div className="flex justify-between"><Button onClick={prevStep}>Back</Button><Button type="primary" size="large" onClick={handleSubmitBooking} loading={paymentLoading} style={{ backgroundColor: "#f97316" }}>{paymentMethod === 'epos' ? `Pay Deposit $${depositAmount.toFixed(2)}` : 'Confirm Booking'}</Button></div>
                </Card>
              )}
            </div>

            <div className="lg:w-96 w-full">
              <Card title={<div className="flex justify-between"><span><ShoppingCartOutlined className="mr-2" /> Booking Cart</span>{cart.length > 0 && <Button type="link" danger onClick={clearCart} size="small">Clear All</Button>}</div>} className="shadow-md sticky top-24">
                {cart.length === 0 ? <Empty description="No resources selected" /> : <><List dataSource={cart} renderItem={renderCartItem} className="max-h-96 overflow-auto" /><Divider /><div className="flex justify-between mb-2"><Text>Subtotal</Text><Text strong>${subtotal.toFixed(2)}</Text></div><div className="flex justify-between"><Text type="secondary">Deposit (30%)</Text><Text style={{ color: '#f97316' }}>${defaultDeposit.toFixed(2)}</Text></div></>}
              </Card>
              <Card title="Booking Guide" className="mt-4" size="small">
                <div className="space-y-1 text-sm"><div><CheckCircleOutlined className="text-green-500 mr-2" />Deposit required</div><div><CheckCircleOutlined className="text-green-500 mr-2" />Subject to availability</div><div><CheckCircleOutlined className="text-green-500 mr-2" />Free cancellation 7 days prior</div><div><CheckCircleOutlined className="text-green-500 mr-2" />QR code generated on confirmation</div></div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default GroupBooking;