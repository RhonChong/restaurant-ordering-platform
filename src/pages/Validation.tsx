// src/pages/Validation.tsx
import React, { useState, useCallback } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Tag, 
  Divider, 
  Space, 
  Alert, 
  Result, 
  Descriptions, 
  Progress,
  message,
  Spin,
  Input
} from 'antd';
import { 
  ScanOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined, 
  ReloadOutlined,
  ArrowLeftOutlined,
  QrcodeOutlined,
  ThunderboltOutlined,
  UserOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  WarningOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// ===================== TYPES =====================
interface TicketInfo {
  ticketId: string;
  ticketName: string;
  visitorName: string;
  purchaseDate: string;
  validFrom: string;
  validTo: string;
  validTimeSlots: string[];
  benefits: string[];
  remainingUses: number;
  maxUses: number;
  status: 'valid' | 'expired' | 'used_up' | 'invalid_time' | 'cancelled';
  qrCode: string;
}

interface ValidationResult {
  allowed: boolean;
  reason?: string;
  ticketInfo?: TicketInfo;
  validatedAt: string;
}

// ===================== MOCK TICKET DATA (模拟数据库中的门票) =====================
const MOCK_TICKETS: Record<string, TicketInfo> = {
  // 有效门票 - 普通单次票
  'TKT-001-ABCD': {
    ticketId: 'TKT-001-ABCD',
    ticketName: 'City Park Day Pass',
    visitorName: 'John Smith',
    purchaseDate: '2026-05-15',
    validFrom: '2026-06-01',
    validTo: '2026-12-31',
    validTimeSlots: ['09:00-18:00'],
    benefits: ['Access to all gardens', 'Free shuttle bus', '10% off at cafe'],
    remainingUses: 1,
    maxUses: 1,
    status: 'valid',
    qrCode: 'TKT-001-ABCD'
  },
  // 多次票 - 还有2次
  'TKT-002-EFGH': {
    ticketId: 'TKT-002-EFGH',
    ticketName: 'Season Pass - Premium',
    visitorName: 'Emma Watson',
    purchaseDate: '2026-01-10',
    validFrom: '2026-01-10',
    validTo: '2026-12-31',
    validTimeSlots: ['09:00-20:00'],
    benefits: ['Unlimited access', 'Priority queue', 'Free parking', 'Member events'],
    remainingUses: 2,
    maxUses: 999,
    status: 'valid',
    qrCode: 'TKT-002-EFGH'
  },
  // 夜场票 - 特定时段
  'TKT-003-IJKL': {
    ticketId: 'TKT-003-IJKL',
    ticketName: 'Night Light Show Ticket',
    visitorName: 'Michael Chen',
    purchaseDate: '2026-05-20',
    validFrom: '2026-06-10',
    validTo: '2026-06-10',
    validTimeSlots: ['18:00-21:00'],
    benefits: ['Night show access', 'Welcome drink'],
    remainingUses: 1,
    maxUses: 1,
    status: 'valid',
    qrCode: 'TKT-003-IJKL'
  },
  // 过期门票
  'TKT-004-MNOP': {
    ticketId: 'TKT-004-MNOP',
    ticketName: 'Spring Festival Ticket',
    visitorName: 'Lisa Wang',
    purchaseDate: '2026-03-01',
    validFrom: '2026-03-10',
    validTo: '2026-04-15',
    validTimeSlots: ['09:00-17:00'],
    benefits: ['Spring garden access', 'Photo opportunity'],
    remainingUses: 1,
    maxUses: 1,
    status: 'expired',
    qrCode: 'TKT-004-MNOP'
  },
  // 次数用尽
  'TKT-005-QRST': {
    ticketId: 'TKT-005-QRST',
    ticketName: '3-Day Pass',
    visitorName: 'David Lee',
    purchaseDate: '2026-05-01',
    validFrom: '2026-05-01',
    validTo: '2026-05-30',
    validTimeSlots: ['09:00-18:00'],
    benefits: ['3-day park access', 'Free map'],
    remainingUses: 0,
    maxUses: 3,
    status: 'used_up',
    qrCode: 'TKT-005-QRST'
  },
  // 时段无效 - 夜间票白天使用
  'TKT-006-UVWX': {
    ticketId: 'TKT-006-UVWX',
    ticketName: 'Twilight Special',
    visitorName: 'Sarah Johnson',
    purchaseDate: '2026-05-25',
    validFrom: '2026-06-01',
    validTo: '2026-06-30',
    validTimeSlots: ['16:00-19:00'],
    benefits: ['Twilight access', 'Sunset view point'],
    remainingUses: 1,
    maxUses: 1,
    status: 'invalid_time',
    qrCode: 'TKT-006-UVWX'
  },
};

// 验证门票
const validateTicket = (ticket: TicketInfo, currentTime: Date): ValidationResult => {
  const now = currentTime;
  const currentDate = now.toISOString().split('T')[0];
  const currentHour = now.getHours();
  const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  // 1. 检查门票状态
  if (ticket.status === 'expired') {
    return {
      allowed: false,
      reason: `Ticket expired on ${ticket.validTo}. Please purchase a new ticket.`,
      validatedAt: now.toLocaleString()
    };
  }
  
  if (ticket.status === 'used_up') {
    return {
      allowed: false,
      reason: `Ticket usage exhausted (${ticket.maxUses}/${ticket.maxUses} uses used). No remaining entries.`,
      validatedAt: now.toLocaleString()
    };
  }
  
  if (ticket.status === 'cancelled') {
    return {
      allowed: false,
      reason: 'This ticket has been cancelled or refunded.',
      validatedAt: now.toLocaleString()
    };
  }
  
  // 2. 检查有效期
  if (currentDate < ticket.validFrom) {
    return {
      allowed: false,
      reason: `Ticket not yet valid. Valid from ${ticket.validFrom}.`,
      validatedAt: now.toLocaleString()
    };
  }
  
  if (currentDate > ticket.validTo) {
    return {
      allowed: false,
      reason: `Ticket expired on ${ticket.validTo}.`,
      validatedAt: now.toLocaleString()
    };
  }
  
  // 3. 检查时段有效性
  const isValidTimeSlot = ticket.validTimeSlots.some(slot => {
    const [start, end] = slot.split('-');
    return currentTimeStr >= start && currentTimeStr <= end;
  });
  
  if (!isValidTimeSlot) {
    const slotStr = ticket.validTimeSlots.join(' or ');
    return {
      allowed: false,
      reason: `Invalid time slot. This ticket is only valid during: ${slotStr}. Current time: ${currentTimeStr}.`,
      validatedAt: now.toLocaleString()
    };
  }
  
  // 4. 检查剩余次数
  if (ticket.remainingUses <= 0) {
    return {
      allowed: false,
      reason: `No remaining uses left (${ticket.maxUses}/${ticket.maxUses} uses used).`,
      validatedAt: now.toLocaleString()
    };
  }
  
  // 所有验证通过
  return {
    allowed: true,
    ticketInfo: {
      ...ticket,
      remainingUses: ticket.remainingUses - 1
    },
    validatedAt: now.toLocaleString()
  };
};

// ===================== VALIDATION COMPONENT =====================
interface ValidationProps {
  onBack: () => void;
}

const Validation: React.FC<ValidationProps> = ({ onBack }) => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showScanner, setShowScanner] = useState<boolean>(true);
  const [manualCode, setManualCode] = useState<string>('');

  // 模拟扫码验证
  const simulateScan = useCallback((ticketCode: string) => {
    setScanning(true);
    
    // 模拟扫码延迟
    setTimeout(() => {
      const ticket = MOCK_TICKETS[ticketCode];
      const currentTime = new Date();
      
      if (!ticket) {
        setValidationResult({
          allowed: false,
          reason: 'Invalid QR code. Ticket not found in system.',
          validatedAt: currentTime.toLocaleString()
        });
        setShowScanner(false);
        setScanning(false);
        return;
      }
      
      const result = validateTicket(ticket, currentTime);
      setValidationResult(result);
      setShowScanner(false);
      setScanning(false);
      
      // 播放提示音效感（模拟）
      if (result.allowed) {
        message.success('Access Granted! Welcome to the park.');
      } else {
        message.error('Access Denied. Please check the reason.');
      }
    }, 800);
  }, []);
  
  // 预设快速测试按钮
  const testScenarios = [
    { code: 'TKT-001-ABCD', name: 'Valid Day Pass', description: 'Valid ticket - should allow entry' },
    { code: 'TKT-002-EFGH', name: 'Season Pass (2 uses left)', description: 'Valid multi-use ticket' },
    { code: 'TKT-003-IJKL', name: 'Night Show Ticket', description: 'Valid but check time slot' },
    { code: 'TKT-004-MNOP', name: 'Expired Ticket', description: 'Should reject - expired' },
    { code: 'TKT-005-QRST', name: 'Used Up Ticket', description: 'Should reject - no uses left' },
    { code: 'TKT-006-UVWX', name: 'Twilight Ticket', description: 'May reject if outside 16:00-19:00' },
    { code: 'INVALID-CODE', name: 'Invalid QR Code', description: 'Should reject - not found' },
  ];
  
  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      simulateScan(manualCode.trim());
    } else {
      message.warning('Please enter a ticket code');
    }
  };
  
  const resetValidation = () => {
    setValidationResult(null);
    setShowScanner(true);
    setManualCode('');
  };
  
  const getBenefitIcon = (benefit: string) => {
    if (benefit.includes('parking')) return <EnvironmentOutlined />;
    if (benefit.includes('queue')) return <ThunderboltOutlined />;
    if (benefit.includes('drink') || benefit.includes('cafe')) return <GiftOutlined />;
    return <CheckCircleOutlined />;
  };
  
  // 扫描页面
  if (showScanner && !validationResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button size='large' icon={<ArrowLeftOutlined />} onClick={onBack}>
              Back
            </Button>
            <Title level={3} className="!mb-0">
              <FileTextOutlined className="mr-2 text-indigo-500" />
              Ticket Validation
            </Title>
            <div style={{ width: 80 }} />
          </div>
          
          <Card className="shadow-xl rounded-2xl overflow-hidden">
            {/* Scanner Simulation */}
            <div className="text-center py-8">
              <div className="relative inline-block">
                <div className="w-64 h-64 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
                  <div className="text-center z-10">
                    <QrcodeOutlined className="text-6xl text-white mb-3" />
                    <Text className="text-white block text-sm">Scanner Ready</Text>
                  </div>
                  {/* Scanning line animation */}
                  {scanning && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-green-400 animate-scan"></div>
                  )}
                </div>
              </div>
              
              <Title level={4}>Scan QR Code</Title>
              <Text type="secondary" className="block mb-6">
                Position the QR code in front of the scanner
              </Text>
              
              {scanning ? (
                <Spin size="large" tip="Verifying ticket..." />
              ) : (
                <Space direction="vertical" size="middle" className="w-full max-w-md">
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<ScanOutlined />}
                    onClick={() => simulateScan('TKT-001-ABCD')}
                    className="w-full h-12 text-base"
                    style={{ backgroundColor: "#10b981" }}
                  >
                    Simulate Scan (Demo)
                  </Button>
                  
                  <Divider plain>Or Enter Code Manually</Divider>
                  
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter ticket code (e.g., TKT-001-ABCD)"
                      size="large"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      onPressEnter={handleManualSubmit}
                      className="flex-1"
                      prefix={<FileTextOutlined className="text-gray-400" />}
                      allowClear
                    />
                    <Button type="primary" onClick={handleManualSubmit} size="large" style={{ backgroundColor: "#6366f1" }}>
                      Verify
                    </Button>
                  </div>
                </Space>
              )}
            </div>
            
            <Divider>Test Scenarios</Divider>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {testScenarios.map((scenario, idx) => (
                <Button
                  key={idx}
                  onClick={() => {
                    setManualCode(scenario.code);
                    simulateScan(scenario.code);
                  }}
                  className="text-left h-auto py-3 px-4"
                  disabled={scanning}
                >
                  <div className="font-medium text-sm">{scenario.name}</div>
                  <Text type="secondary" className="text-xs">{scenario.description}</Text>
                </Button>
              ))}
            </div>
          </Card>
          
          <style>{`
            @keyframes scan {
              0% { top: 0%; }
              50% { top: 95%; }
              100% { top: 0%; }
            }
            .animate-scan {
              animation: scan 1.5s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>
    );
  }
  
  // 验证结果页面
  if (validationResult) {
    const { allowed, reason, ticketInfo, validatedAt } = validationResult;
    
    if (!allowed) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-6">
          <div className="max-w-2xl mx-auto">
            <Button size='large' icon={<ArrowLeftOutlined />} onClick={onBack} className="mb-4">
              Back
            </Button>
            
            <Result
              status="error"
              icon={<CloseCircleOutlined style={{ color: '#dc2626' }} />}
              title="Access Denied"
              subTitle="The ticket could not be validated for entry."
              extra={[
                <Button key="retry" type="primary" onClick={resetValidation} icon={<ReloadOutlined />}>
                  Scan Another Ticket
                </Button>
              ]}
            />
            
            <Card className="mt-4 shadow-lg border-red-200">
              <div className="flex items-start gap-3">
                <WarningOutlined className="text-red-500 text-xl mt-1" />
                <div>
                  <Text strong className="text-red-700 block mb-2">Rejection Reason:</Text>
                  <Text className="text-red-600">{reason}</Text>
                </div>
              </div>
              <Divider />
              <div className="text-gray-500 text-sm">
                <Text type="secondary">Validation Time: {validatedAt}</Text>
              </div>
            </Card>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Button size='large' icon={<ArrowLeftOutlined />} onClick={onBack} className="mb-4">
            Back
          </Button>
          
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#10b981' }} />}
            title="Access Granted"
            subTitle={`Welcome, ${ticketInfo?.visitorName}! Enjoy your visit to City Park.`}
            extra={[
              <Button key="scan" type="primary" onClick={resetValidation} icon={<ScanOutlined />}>
                Scan Another Ticket
              </Button>
            ]}
          />
          
          <Card className="mt-4 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-emerald-500 -mx-6 -mt-6 px-6 py-4 mb-6">
              <div className="flex items-center gap-2">
                <FileTextOutlined className="text-white text-xl" />
                <Text strong className="text-white text-lg">Ticket Details</Text>
              </div>
            </div>
            
            <Descriptions bordered column={{ xs: 1, sm: 2 }} className="mb-6">
              <Descriptions.Item label="Ticket ID">
                <Tag color="green">{ticketInfo?.ticketId}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ticket Name">
                <Text strong>{ticketInfo?.ticketName}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Visitor Name">
                <UserOutlined className="mr-1 text-emerald-500" />
                {ticketInfo?.visitorName}
              </Descriptions.Item>
              <Descriptions.Item label="Purchase Date">
                <CalendarOutlined className="mr-1" />
                {ticketInfo?.purchaseDate}
              </Descriptions.Item>
              <Descriptions.Item label="Valid Period" span={2}>
                <Space>
                  <CalendarOutlined className="text-emerald-500" />
                  <Text>{ticketInfo?.validFrom} → {ticketInfo?.validTo}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Valid Time Slots" span={2}>
                <Space wrap>
                  {ticketInfo?.validTimeSlots.map(slot => (
                    <Tag key={slot} color="blue" icon={<ClockCircleOutlined />}>
                      {slot}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Remaining Uses">
                <Space>
                  <Progress 
                    type="circle" 
                    percent={((ticketInfo!.remainingUses) / ticketInfo!.maxUses) * 100} 
                    width={50}
                    format={() => `${ticketInfo?.remainingUses}/${ticketInfo?.maxUses}`}
                    strokeColor="#10b981"
                  />
                </Space>
              </Descriptions.Item>
            </Descriptions>
            
            <Divider orientation="left">
              <Space>
                <GiftOutlined className="text-emerald-500" />
                <Text strong>Ticket Benefits & Inclusions</Text>
              </Space>
            </Divider>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {ticketInfo?.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg">
                  {getBenefitIcon(benefit)}
                  <Text>{benefit}</Text>
                </div>
              ))}
            </div>
            
            <Alert
              message="Entry Confirmed"
              description={`This ticket has been validated and used. Remaining entries: ${ticketInfo!.remainingUses}/${ticketInfo!.maxUses}`}
              type="success"
              showIcon
              className="mt-4"
            />
            
            <div className="mt-4 text-right text-gray-400 text-xs">
              Validated at: {validatedAt}
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  return null;
};

export default Validation;