'use client';
import { useState } from 'react';
import { Tabs, TabItem, Card, Button } from 'flowbite-react';
import { HiOutlineCamera } from 'react-icons/hi';
import Link from 'next/link';

export type RentalItem = {
  id: number;
  name: string;
  store: string;
  price: number;
  status: string;
  image: string;
  actions?: {
    label: string;
    href?: string;
    onClick?: () => void;
  }[];
};

export const mockRentals: RentalItem[] = [
  {
    id: 1,
    name: 'ชื่อสินค้า',
    store: 'ชื่อร้าน',
    price: 1800,
    status: 'ขอเช่า',
    image: '',
    actions: [
      { label: 'ยืนยันคำขอ', href: '/approve/1' },
      { label: 'ปฏิเสธคำขอ', href: '/reject/1' },
    ],
  },
  {
    id: 2,
    name: 'ชื่อสินค้า',
    store: 'ชื่อร้าน',
    price: 1800,
    status: 'ยืนยันคำขอแล้ว',
    image: '',
    actions: [{ label: 'รอผู้เช่าชำระเงิน' }],
  },
  {
    id: 3,
    name: 'ชื่อสินค้า',
    store: 'ชื่อร้าน',
    price: 1800,
    status: 'ชำระเงินแล้ว',
    image: '',
    actions: [{ label: 'ยืนยันการส่ง', href: '/confirm-shipping/3' }],
  },
  {
    id: 4,
    name: 'ชื่อสินค้า',
    store: 'ชื่อร้าน',
    price: 1800,
    status: 'ถูกเช่าอยู่',
    image: '',
  },
  {
    id: 5,
    name: 'ชื่อสินค้า',
    store: 'ชื่อร้าน',
    price: 1800,
    status: 'กำลังส่งคืน',
    image: '',
    actions: [
      { label: 'ยืนยันการส่งคืน', href: '/confirm-return/5' },
      { label: 'ระบุค่าปรับ', href: '/penalty/5' },
    ],
  },
  {
    id: 6,
    name: 'ชื่อสินค้า',
    store: 'ชื่อร้าน',
    price: 1800,
    status: 'ผู้เช่าชำระค่าปรับแล้ว',
    image: '',
    actions: [{ label: 'ให้คะแนนผู้เช่า', href: '/rate-renter/6' }],
  },
  {
    id: 7,
    name: 'ชื่อสินค้า',
    store: 'ชื่อร้าน',
    price: 1800,
    status: 'สำเร็จแล้ว',
    image: '',
    actions: [{ label: 'ให้คะแนนผู้เช่า', href: '/rate-renter/7' }],
  },
  {
    id: 8,
    name: 'ชื่อสินค้า',
    store: 'ชื่อร้าน',
    price: 1800,
    status: 'ยกเลิก',
    image: '',
  },
];

const statusGroups = {
  all: () => true,
  request: (s: string) => s === 'ขอเช่า',
  current: (s: string) => ['ยืนยันคำขอแล้ว', 'ชำระเงินแล้ว', 'ถูกเช่าอยู่'].includes(s),
  returning: (s: string) => s === 'กำลังส่งคืน',
  completed: (s: string) => ['ผู้เช่าชำระค่าปรับแล้ว', 'สำเร็จแล้ว'].includes(s),
  cancelled: (s: string) => s === 'ยกเลิก',
};

const RentalCard = ({ rental }: { rental: RentalItem }) => (
  <Card className="mb-4">
    <div className="flex gap-4">
      <div className="w-24 h-24 bg-gray-100 flex items-center justify-center">
        {rental.image ? (
          <img src={rental.image} alt={rental.name} className="w-full h-full object-cover" />
        ) : (
          <HiOutlineCamera className="text-gray-400 text-3xl" />
        )}
      </div>

      <div className="flex-1">
        <h5 className="text-lg font-semibold">{rental.name}</h5>
        <p className="text-sm">ระยะเวลาการเช่า</p>
        <p className="text-sm">ที่อยู่จัดส่ง</p>
        <p className="text-sm text-gray-500">รายละเอียด ..</p>

        <Link href={`/lender/rental/${rental.id}`} className="text-sm underline text-gray-500 hover:text-black">
          ดูรายละเอียด
        </Link>
      </div>

      <div className="flex flex-col justify-between text-right items-end gap-1">
        <span className="text-sm text-gray-600">{rental.status}</span>
        <span className="text-lg font-bold">{rental.price.toLocaleString()} บาท</span>
        <div className="flex flex-wrap gap-1 justify-end">
          {rental.actions?.map((action, i) =>
            action.href ? (
              <Link key={i} href={action.href}>
                <Button size="xs" color="gray">
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button key={i} size="xs" color="gray" onClick={action.onClick}>
                {action.label}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  </Card>
);

const ScrollableRentalList = ({
  rentals,
  search,
  setSearch,
}: {
  rentals: RentalItem[];
  search: string;
  setSearch: (v: string) => void;
}) => (
	<div className="max-w-5xl mx-auto p-4 bg-white rounded-lg shadow"> 
    <div className="mb-4">
      <input
        type="text"
        placeholder="ค้นหา..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-[30%]"
      />
    </div>
  <div className="bg-white rounded-lg p-4 max-h-[600px] overflow-y-auto space-y-4 h-[600px]">
    {/* Search Box */}
	


    {/* Rental List */}
    {rentals.length > 0 ? (
      rentals.map((r) => <RentalCard key={r.id} rental={r} />)
    ) : (
	<div className="flex items-center justify-center h-full">
	  <p className="text-gray-500 text-lg">ไม่มีรายการ</p>
	</div>
    )}
  </div>


  </div>
);

const RentalManagement = () => {
  const [search, setSearch] = useState('');

  const filteredByTab = (predicate: (s: string) => boolean) =>
    mockRentals
      .filter((r) => predicate(r.status))
      .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Rental Management</h1>
      <Tabs aria-label="Rental Management Tabs">
        <TabItem title="All">
          <ScrollableRentalList rentals={filteredByTab(statusGroups.all)} search={search} setSearch={setSearch} />
        </TabItem>
        <TabItem title="Rental Requests">
          <ScrollableRentalList rentals={filteredByTab(statusGroups.request)} search={search} setSearch={setSearch} />
        </TabItem>
        <TabItem title="Currently Rented">
          <ScrollableRentalList rentals={filteredByTab(statusGroups.current)} search={search} setSearch={setSearch} />
        </TabItem>
        <TabItem title="Being Returned">
          <ScrollableRentalList rentals={filteredByTab(statusGroups.returning)} search={search} setSearch={setSearch} />
        </TabItem>
        <TabItem title="Rental Completed">
          <ScrollableRentalList rentals={filteredByTab(statusGroups.completed)} search={search} setSearch={setSearch} />
        </TabItem>
        <TabItem title="Cancelled">
          <ScrollableRentalList rentals={filteredByTab(statusGroups.cancelled)} search={search} setSearch={setSearch} />
        </TabItem>
      </Tabs>
    </div>
  );
};

export default RentalManagement;
