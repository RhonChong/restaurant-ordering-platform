// src/App.tsx
import React, { useState } from 'react';
import { ConfigProvider, Card, Button, Typography, Space, Modal } from 'antd';
import { CoffeeOutlined, FileTextOutlined, QrcodeOutlined, TeamOutlined } from '@ant-design/icons';
import Restaurant from './pages/Restaurant';
import Ticketing from './pages/Ticketing';
import Validation from './pages/Validation';
import GroupBooking from './pages/GroupBooking';

const { Title, Text, Paragraph } = Typography;

type AppMode = 'select' | 'restaurant' | 'ticketing' | 'validation' | 'group';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('select');

  const handleSelectRestaurant = () => setMode('restaurant');
  const handleSelectTicketing = () => setMode('ticketing');
  const handleSelectValidation = () => setMode('validation');
  const handleSelectGroup = () => setMode('group');
  const handleBackToSelect = () => setMode('select');

  if (mode === 'restaurant') {
    return <Restaurant onBack={handleBackToSelect} />;
  }

  if (mode === 'ticketing') {
    return <Ticketing onBack={handleBackToSelect} />;
  }

  if (mode === 'validation') {
    return <Validation onBack={handleBackToSelect} />;
  }

  if (mode === 'group') {
    return <GroupBooking onBack={handleBackToSelect} />;
  }

  // 入口选择页面 - 4列布局
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#c90062',
          borderRadius: 16,
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }}
    >
      <div 
        className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100"
        style={{
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(201,0,98,0.05) 0%, rgba(0,0,0,0) 50%)',
        }}
      >
        <div className="container mx-auto px-4 py-12 md:py-24">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                <img src="asset/image/cec-logo-colour-155x70px.png" alt="" />
              {/* <span className="text-5xl">🏞️</span> */}
            </div>
            <Title level={1} className="!mb-2" style={{ color: '#1a5f3a' }}>
              City Park Service Hub
            </Title>
            <Text type="secondary" className="text-lg">
              Choose your experience below
            </Text>
          </div>

          {/* Selection Cards - 4列布局 */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Restaurant Card */}
              <Card
                hoverable
                className="text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full"
                styles={{ body: { padding: '24px 20px' } }}
              >
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-50 rounded-full">
                    <CoffeeOutlined style={{ fontSize: 40, color: '#c90062' }} />
                  </div>
                </div>
                <Title level={4} style={{ color: '#c90062' }} className="!mb-2">
                  FlavorHub Restaurant
                </Title>
                <Paragraph type="secondary" className="mb-4 text-sm">
                  Dine in with delicious meals, choose your table, and enjoy a seamless ordering experience.
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSelectRestaurant}
                  style={{ backgroundColor: '#c90062' }}
                  className="w-full"
                >
                  Dine In Now
                </Button>
              </Card>

              {/* Ticketing Card */}
              <Card
                hoverable
                className="text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full"
                styles={{ body: { padding: '24px 20px' } }}
              >
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full">
                    <FileTextOutlined style={{ fontSize: 40, color: '#10b981' }} />
                  </div>
                </div>
                <Title level={4} style={{ color: '#10b981' }} className="!mb-2">
                  Park Attractions
                </Title>
                <Paragraph type="secondary" className="mb-4 text-sm">
                  Book tickets for scenic spots, gardens, and exciting attractions in the city park.
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSelectTicketing}
                  style={{ backgroundColor: '#10b981' }}
                  className="w-full"
                >
                  Buy Tickets
                </Button>
              </Card>

              {/* Validation Card */}
              <Card
                hoverable
                className="text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full"
                styles={{ body: { padding: '24px 20px' } }}
              >
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full">
                    <QrcodeOutlined style={{ fontSize: 40, color: '#6366f1' }} />
                  </div>
                </div>
                <Title level={4} style={{ color: '#6366f1' }} className="!mb-2">
                  Ticket Validation
                </Title>
                <Paragraph type="secondary" className="mb-4 text-sm">
                  Scan and verify tickets, check validity, time slots, benefits, and remaining uses.
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSelectValidation}
                  style={{ backgroundColor: '#6366f1' }}
                  className="w-full"
                >
                  Validate Ticket
                </Button>
              </Card>

              {/* Group Booking Card - 新增 */}
              <Card
                hoverable
                className="text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full"
                styles={{ body: { padding: '24px 20px' } }}
              >
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-full">
                    <TeamOutlined style={{ fontSize: 40, color: '#f97316' }} />
                  </div>
                </div>
                <Title level={4} style={{ color: '#f97316' }} className="!mb-2">
                  Group Booking
                </Title>
                <Paragraph type="secondary" className="mb-4 text-sm">
                  Reserve resources, rooms, equipment, staff allocation with EPOS/onsite payment.
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSelectGroup}
                  style={{ backgroundColor: '#f97316' }}
                  className="w-full"
                >
                  Book Group Event
                </Button>
              </Card>
            </div>

            {/* Info Banner */}
            <div className="mt-12 p-4 bg-white/60 backdrop-blur-sm rounded-xl text-center">
              <Text type="secondary">
                🌟 Complete park management system — Ticket booking + On-site validation + Restaurant ordering + Group Event Booking
              </Text>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;