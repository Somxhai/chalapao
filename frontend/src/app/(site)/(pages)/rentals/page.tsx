'use client';
import { useState } from 'react';
import { Tabs, TabItem, Card, Button } from 'flowbite-react';
import { HiOutlineCamera } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export type RentalItem = {
  id: number;
  name: string;
  store: string;
  startDate: string;
  endDate: string;
  duration: string;
  price: number;
  status: string;
  image: string;
  cancellable?: boolean;
  actions?: {
	label: string;
	href?: string;
	onClick?: () => void;
  }[]; // เช่น ['ยกเลิก', 'ชำระเงิน', 'ยืนยันการส่งคืน', 'ให้คะแนน']
  rating?: number; // กรณีเช่าสำเร็จแล้ว
};

export const mockRentals: RentalItem[] = [
	{
	  id: 1,
	  name: 'กล้อง Canon EOS 90D',
	  store: 'ชื่อร้าน',
	  startDate: '-',
	  endDate: '-',
	  duration: '-',
	  price: 1920,
	  status: 'รอผู้ปล่อยเช่ายืนยัน',
	  image: 'https://i5.walmartimages.com/seo/Canon-EOS-90D-DSLR-Camera-with-18-135mm-Lens-3616C016_d5438c50-f566-42e6-968b-ea49b53e1b1f_1.d37dc514f4f3f657db267af16621a2ae.jpeg',
	  actions: [
		{ label: 'ยกเลิก', href: '/cancel/1' },
	  ],
	},
	{
	  id: 2,
	  name: 'ชื่อสินค้า',
	  store: 'ชื่อร้าน',
	  startDate: '-',
	  endDate: '-',
	  duration: '-',
	  price: 1920,
	  status: 'ผู้ปล่อยเช่ายืนยันแล้ว',
	  image: '',
	  actions: [
		{ label: 'ชำระเงิน', href: '/payment/2' },
		{ label: 'ยกเลิก', href: '/cancel/2' },
	  ],
	},
	{
	  id: 3,
	  name: 'ชื่อสินค้า',
	  store: 'ชื่อร้าน',
	  startDate: '-',
	  endDate: '-',
	  duration: '-',
	  price: 1920,
	  status: 'เช่าอยู่',
	  image: '',
	  actions: [
		{ label: 'ยืนยันการส่งคืน', href: '/return/3' },
		{ label: 'ยกเลิก', href: '/cancel/3' },
	  ],
	},
	{
	  id: 4,
	  name: 'ชื่อสินค้า',
	  store: 'ชื่อร้าน',
	  startDate: '-',
	  endDate: '-',
	  duration: '-',
	  price: 1920,
	  status: 'จัดส่งคืนแล้ว',
	  image: '',
	  actions: [
		{ label: 'รอผู้ให้เช่ายืนยัน' },
	  ],
	},
	{
	  id: 5,
	  name: 'ชื่อสินค้า',
	  store: 'ชื่อร้าน',
	  startDate: '-',
	  endDate: '-',
	  duration: '-',
	  price: 1920,
	  status: 'เช่าสำเร็จแล้ว',
	  image: '',
	  rating: 0,
	  actions: [
		{ label: 'ให้คะแนน', href: '/rate/5' },
	  ],
	},
	{
	  id: 6,
	  name: 'ชื่อสินค้า',
	  store: 'ชื่อร้าน',
	  startDate: '-',
	  endDate: '-',
	  duration: '-',
	  price: 1920,
	  status: 'เช่าสำเร็จแล้ว',
	  image: '',
	  rating: 3,
	  actions: [
		{ label: 'เช่าซ้ำ', href: '/rental/6' },
	  ],
	},
	{
	  id: 7,
	  name: 'ชื่อสินค้า',
	  store: 'ชื่อร้าน',
	  startDate: '-',
	  endDate: '-',
	  duration: '-',
	  price: 1920,
	  status: 'มีค่าปรับที่ต้องชำระ',
	  image: '',
	  actions: [
		{ label: 'ชำระค่าปรับ', href: '/penalty/7' },
	  ],
	},
	{
	  id: 8,
	  name: 'ชื่อสินค้า',
	  store: 'ชื่อร้าน',
	  startDate: '-',
	  endDate: '-',
	  duration: '-',
	  price: 1920,
	  status: 'ยกเลิกแล้ว',
	  image: '',
	},
  ];
  

const statusGroups = {
  all: () => true,
  rentRequest: (s: string) =>
    ['รอผู้ปล่อยเช่ายืนยัน', 'ผู้ปล่อยเช่ายืนยันแล้ว'].includes(s),
  renting: (s: string) => s === 'เช่าอยู่',
  returned: (s: string) =>
    ['จัดส่งคืนแล้ว', 'เช่าสำเร็จแล้ว', 'มีค่าปรับที่ต้องชำระ'].includes(s),
  cancelled: (s: string) => s === 'ยกเลิกแล้ว',
};

const RentalCard = ({ rental }: { rental: RentalItem }) => (
  <Card className="mb-4">
    <div className="flex gap-4">
      <div className="w-24 h-24 bg-gray-100 flex items-center justify-center">
        {rental.image ? (
          <img
            src={rental.image}
            alt={rental.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <HiOutlineCamera className="text-gray-400 text-3xl" />
        )}
      </div>
      <div className="flex-1">
        <h5 className="text-lg font-semibold">{rental.name}</h5>
        <p className="text-sm text-gray-500">ชื่อร้าน : {rental.store}</p>
        <p className="text-sm">ระยะเวลาการเช่า: {rental.duration}</p>
        {rental.startDate !== '-' && (
          <div className="text-sm text-gray-500">
            <p>ตั้งแต่วันที่ : {rental.startDate}</p>
            <p>ถึงวันที่ : {rental.endDate}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between text-right items-end gap-1">
        <span className="text-sm text-gray-600">{rental.status}</span>
        <span className="text-lg font-bold">{rental.price.toLocaleString()} บาท</span>
        <div className="flex flex-wrap gap-1 justify-end">
		{rental.actions?.map((action, i) =>
    action.href ? (
      <a key={i} href={action.href}>
        <Button size="xs" color="gray">{action.label}</Button>
      </a>
    ) : (
      <Button key={i} size="xs" color="gray" onClick={action.onClick}>
        {action.label}
      </Button>
    )
  )}
          {rental.rating !== undefined && (
            <div className="text-yellow-500 text-sm">
              {'★'.repeat(rental.rating)}{'☆'.repeat(5 - rental.rating)}
            </div>
          )}
        </div>
      </div>
    </div>



	{/* 👇 ปุ่มดูรายละเอียดซ้ายล่าง */}
    <div className="mt-2">
      <Link href={`/rental/${rental.id}`}>
        <span className="text-sm text-gray-500 underline cursor-pointer hover:text-black">
          ดูรายละเอียด
        </span>
      </Link>
    </div>

  </Card>
);

const Rentals = () => {
  const [search, setSearch] = useState('');

  const filteredByTab = (predicate: (s: string) => boolean) =>
    mockRentals
      .filter((r) => predicate(r.status))
      .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Rental List</h1>

      <Tabs aria-label="Rental Tabs">
        <TabItem title="All">
          <ScrollableRentalList
            rentals={filteredByTab(statusGroups.all)}
            search={search}
            setSearch={setSearch}
          />
        </TabItem>

        <TabItem title="Rent Request">
          <ScrollableRentalList
            rentals={filteredByTab(statusGroups.rentRequest)}
            search={search}
            setSearch={setSearch}
          />
        </TabItem>

        <TabItem title="Renting">
          <ScrollableRentalList
            rentals={filteredByTab(statusGroups.renting)}
            search={search}
            setSearch={setSearch}
          />
        </TabItem>

        <TabItem title="Returned">
          <ScrollableRentalList
            rentals={filteredByTab(statusGroups.returned)}
            search={search}
            setSearch={setSearch}
          />
        </TabItem>

        <TabItem title="Cancelled">
          <ScrollableRentalList
            rentals={filteredByTab(statusGroups.cancelled)}
            search={search}
            setSearch={setSearch}
          />
        </TabItem>
      </Tabs>
    </div>
  );
};

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
	  <p className="text-gray-500 text-lg">ยังไม่มีรายการ</p>
	</div>
    )}
  </div>


  </div>
);

export default Rentals;
