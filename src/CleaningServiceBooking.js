import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';

// 서비스 데이터
const SERVICES = {
  aircon: [
    { name: '4way', price: 130000, duration: 90 },
    { name: '1way', price: 100000, duration: 60 },
    { name: '벽걸이', price: 90000, duration: 60 },
    { name: '스탠드', price: 120000, duration: 90 }
  ],
  washer: [
    { name: '드럼', price: 150000, duration: 180 },
    { name: '통돌이', price: 90000, duration: 90 },
    { name: '트윈워시', price: 250000, duration: 240 },
    { name: '플렉스워시', price: 350000, duration: 300 },
    { name: '건조기', price: 150000, duration: 180 }
  ]
};

// 지역 및 담당 팀장 매핑
const AREA_MANAGERS = {
  '강남': ['이용재'],
  '송파': ['이용재', '최영훈', '박성욱'],
  '하남': ['안지훈', '박성욱', '최영훈'],
  '성남': ['안지훈', '박진영', '유일'],
  '용인': ['진용호', '박진영', '유일'],
  '수원': ['김재원', '박성진'],
  '동탄': ['박성진'],
  '평택': ['김재원']
};

const CleaningServiceBooking = () => {
  const [step, setStep] = useState(1);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [availableManagers, setAvailableManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    additionalRequests: ''
  });

  // 가격 계산 함수
  const calculatePrice = () => {
    if (!selectedService) return 0;
    
    let finalPrice = selectedService.price * quantity;

    // 수량 할인 로직
    if (quantity >= 2 && quantity <= 9) {
      finalPrice -= (quantity - 1) * 10000;
    }

    return finalPrice;
  };

  // 예약 확정 핸들러
  const handleBookingConfirm = async () => {
    const bookingDetails = {
      area: selectedArea,
      serviceType: selectedServiceType,
      serviceName: selectedService.name,
      quantity,
      manager: selectedManager,
      date: selectedDate,
      customerInfo
    };

    try {
      // Google Apps Script 웹앱 URL (실제 URL로 대체 필요)
      const response = await fetch('https://script.google.com/macros/s/AKfycbz0TpCD3SEjWM5U1mIzCiPg1OkOT-wvhkzwCpHG_Ok7ODWlaqiBwOtaLDWZnSaxN5C2jw/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails)
      });

      alert('예약이 접수되었습니다. 담당 매니저가 확인 후 연락드리겠습니다.');
    } catch (error) {
      console.error('예약 전송 중 오류:', error);
      alert('예약 접수 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 지역 선택 핸들러
  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setAvailableManagers(AREA_MANAGERS[area]);
    setStep(2);
  };

  // 서비스 유형 선택 핸들러
  const handleServiceTypeSelect = (type) => {
    setSelectedServiceType(type);
    setSelectedService(null);
    setStep(3);
  };

  // 서비스 선택 핸들러
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(4);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>청소 서비스 예약</CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">지역을 선택해주세요</h2>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(AREA_MANAGERS).map((area) => (
                <Button 
                  key={area} 
                  variant="outline"
                  onClick={() => handleAreaSelect(area)}
                >
                  {area}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">서비스 유형을 선택해주세요</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                onClick={() => handleServiceTypeSelect('aircon')}
              >
                에어컨 분해청소
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleServiceTypeSelect('washer')}
              >
                세탁기 분해청소
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">
              {selectedServiceType === 'aircon' ? '에어컨' : '세탁기'} 유형을 선택해주세요
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {SERVICES[selectedServiceType].map((service) => (
                <Button 
                  key={service.name} 
                  variant="outline"
                  onClick={() => handleServiceSelect(service)}
                >
                  {service.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">수량을 선택해주세요</h2>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span>{quantity}</span>
              <Button 
                variant="outline" 
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
            <div>
              <p>예상 가격: {calculatePrice().toLocaleString()}원</p>
              <p>예상 소요 시간: {(selectedService.duration * quantity / 60).toFixed(1)}시간</p>
            </div>
            <Button onClick={() => setStep(5)}>다음</Button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">담당 매니저를 선택해주세요</h2>
            <Select onValueChange={setSelectedManager}>
              <SelectTrigger>
                <SelectValue placeholder="매니저 선택" />
              </SelectTrigger>
              <SelectContent>
                {availableManagers.map((manager) => (
                  <SelectItem key={manager} value={manager}>
                    {manager}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <Button 
              onClick={() => setStep(6)} 
              disabled={!selectedManager || !selectedDate}
            >
              다음
            </Button>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">고객 정보를 입력해주세요</h2>
            <Input 
              placeholder="이름" 
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
            />
            <Input 
              placeholder="연락처 (-없이 입력)" 
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
            />
            <Input 
              placeholder="주소" 
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
            />
            <Input 
              placeholder="기타 요청사항 (선택)"
              value={customerInfo.additionalRequests || ''}
              onChange={(e) => setCustomerInfo({...customerInfo, additionalRequests: e.target.value})}
              className="mt-2"
            />
            <Button 
              onClick={handleBookingConfirm}
              disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
            >
              예약 확정
            </Button>
            <div className="text-sm text-gray-600 mt-2">
              <p>* 예약 확인 후 담당자가 곧 연락드릴 예정입니다.</p>
              <p>* 정확한 상담을 위해 연락처를 꼭 확인해주세요.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CleaningServiceBooking;