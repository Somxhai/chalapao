'use client';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Checkbox, Textarea, TextInput } from 'flowbite-react';

/** ---------- Type Definitions ---------- */
type Action = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type RentalDetail = {
  id: string;
  name: string;
  shopName: string;
  owner: string;
  ownerFullname: string;
  ownerPhone: string;
  renter: string;
  renterFullname: string;
  renterPhone: string;
  address: string;
  image: string;
  status: string;
  startDate: string;
  endDate: string;
  duration: string;
  rentPrice: number;
  shipping: number;
  actions?: Action[];
};

/** ---------- Mock Rental Array ---------- */
const rentalDetails: RentalDetail[] = [
  {
    id: '1',
    name: 'Canon EOS R8',
    shopName: 'GearGo Rental',
    owner: 'Gphat',
    ownerFullname: 'ณัฐพล องค์สุริยา',
    ownerPhone: '098-855-2150',
    renter: 'thanawat_k',
    renterFullname: 'ธนวัฒน์ รัตนชัย',
    renterPhone: '081-234-5678',
    address: '88/12 หมู่บ้านพฤกษา 3 ถนนรังสิต-นครนายก ตำบลประชาธิปัตย์ อำเภอธัญบุรี ปทุมธานี 12130',
    image: 'https://i5.walmartimages.com/seo/Canon-EOS-90D-DSLR-Camera-with-18-135mm-Lens-3616C016_d5438c50-f566-42e6-968b-ea49b53e1b1f_1.d37dc514f4f3f657db267af16621a2ae.jpeg',
    status: 'กำลังส่งคืน',
    startDate: '22 มีนาคม 2568',
    endDate: '21 เมษายน 2568',
    duration: '1 เดือน',
    rentPrice: 1800,
    shipping: 120,
    actions: [],
  },
  {
    id: '2',
    name: 'Sony Alpha ZV-E10',
    shopName: 'Digital Snap Rental',
    owner: 'snap_admin',
    ownerFullname: 'สุชาติ อรุณแสง',
    ownerPhone: '091-234-5566',
    renter: 'ploy_cam',
    renterFullname: 'พลอยชมพู อินทรักษ์',
    renterPhone: '082-987-6543',
    address: '99/1 ซอยพหลโยธิน 35 แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
    image: 'https://i5.walmartimages.com/seo/Canon-EOS-90D-DSLR-Camera-with-18-135mm-Lens-3616C016_d5438c50-f566-42e6-968b-ea49b53e1b1f_1.d37dc514f4f3f657db267af16621a2ae.jpeg',
    status: 'ขอเช่า',
    startDate: '1 เมษายน 2568',
    endDate: '30 เมษายน 2568',
    duration: '1 เดือน',
    rentPrice: 2400,
    shipping: 150,
    actions: [
      { label: 'ยืนยันคำขอ', href: '/approve/2' },
      { label: 'ปฏิเสธคำขอ', href: '/reject/2' },
    ],
  },
  {
    id: '3',
    name: 'DJI Mini 3 Pro Drone',
    shopName: 'SkyShot Rental',
    owner: 'skyshot_admin',
    ownerFullname: 'ปกรณ์ อังคณา',
    ownerPhone: '085-999-2211',
    renter: 'aof_skycam',
    renterFullname: 'อ๊อฟ พงษ์พันธ์',
    renterPhone: '086-444-8877',
    address: '44/88 ถ.รามคำแหง แขวงหัวหมาก เขตบางกะปิ กทม. 10240',
    image: 'https://i5.walmartimages.com/seo/Canon-EOS-90D-DSLR-Camera-with-18-135mm-Lens-3616C016_d5438c50-f566-42e6-968b-ea49b53e1b1f_1.d37dc514f4f3f657db267af16621a2ae.jpeg',
    status: 'ชำระเงินแล้ว',
    startDate: '5 เมษายน 2568',
    endDate: '12 เมษายน 2568',
    duration: '7 วัน',
    rentPrice: 1200,
    shipping: 100,
    actions: [
      { label: 'ยืนยันการส่ง', href: '/confirm-shipping/3' },
    ],
  },
];

/** ---------- Component Page ---------- */
const Page = () => {
  const params = useParams();
  const rentalId = params?.rentalId as string;
  const rentalDetail = rentalDetails.find((r) => r.id === rentalId);

  if (!rentalDetail) return notFound();

  const isReturning = rentalDetail.status === 'กำลังส่งคืน';
  const totalPrice = rentalDetail.rentPrice + rentalDetail.shipping;

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">
          <Link href="/lender/rentals" className="hover:underline text-blue-600">
            Rental Management
          </Link>{' '}
          &gt;&gt; {rentalDetail.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold mb-1">{rentalDetail.name}</h2>
            <p className="text-gray-600 mb-6">{rentalDetail.owner} <span className="underline text-sm cursor-pointer">ดูประวัติผู้เช่า</span></p>

            {/* Renter & Lender */}
            <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
              <div>
                <h3 className="font-bold mb-2">Lender</h3>
                <p>ผู้ให้เช่า : {rentalDetail.shopName}</p>
                <p>ชื่อ-สกุล : {rentalDetail.ownerFullname}</p>
                <p>เบอร์โทร : <b>{rentalDetail.ownerPhone}</b></p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Renter</h3>
                <p>ผู้เช่า : <b>{rentalDetail.renter}</b></p>
                <p>ชื่อ-สกุล : <b>{rentalDetail.renterFullname}</b></p>
                <p>เบอร์โทร : <b>{rentalDetail.renterPhone}</b></p>
                <p>ที่อยู่จัดส่ง :<br />{rentalDetail.address}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Renting</h3>
              <p>ระยะเวลาการเช่า : {rentalDetail.duration}</p>
              <p>ตั้งแต่วันที่ : {rentalDetail.startDate}</p>
              <p>ถึงวันที่ : {rentalDetail.endDate}</p>
              <Link href="/rental-terms" className="text-blue-600 underline text-sm inline-block mt-1">
                อ่านเงื่อนไขการเช่า และการปรับ
              </Link>
            </div>

            {/* กรณี "กำลังส่งคืน" */}
            {isReturning && (
              <div className="mb-6 border-t pt-4">
                <p className="text-red-600 font-semibold mb-2">
                  กรุณาตรวจสอบสินค้าโดยละเอียดก่อนยืนยันการรับคืน
                </p>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox /> สินค้าที่ไม่ส่งมา
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox /> สินค้ามีเสียหาย
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="text-sm">ค่าชดเชยสินค้าเสียหาย</label>
                    <TextInput type="number" className="w-28" />
                    <span>บาท</span>
                  </div>
                  <label className="text-sm block">คำอธิบาย</label>
                  <Textarea rows={3} />
                </div>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-right">{rentalDetail.status}</p>
            <div className="w-full flex justify-center">
              <img
                src={rentalDetail.image}
                alt="Product"
                className="rounded-md object-contain w-[200px] h-[200px]"
              />
            </div>

            <Card>
              <div className="flex gap-4 mb-2">
                <img src={rentalDetail.image} alt="Camera" className="w-16 h-16 object-cover rounded" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold">{rentalDetail.name}</p>
                  <p>เช่าจาก : {rentalDetail.ownerFullname}</p>
                  <p>ผู้เช่า : {rentalDetail.renterFullname}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>ค่าเช่า {rentalDetail.duration}</span>
                  <span>{rentalDetail.rentPrice} บาท</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>{rentalDetail.shipping} บาท</span>
                </div>
                <div className="flex justify-between">
                  <span>รวม</span>
                  <span className="text-lg font-bold">{totalPrice} บาท</span>
                </div>
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              {isReturning ? (
                <Button color="gray" className="w-full">ยืนยันการรับคืน</Button>
              ) : (
                rentalDetail.actions?.map((action, i) =>
                  action.href ? (
                    <Link href={action.href} key={i} className="w-full">
                      <Button color="gray" className="w-full">{action.label}</Button>
                    </Link>
                  ) : (
                    <Button key={i} color="gray" className="w-full" onClick={action.onClick}>
                      {action.label}
                    </Button>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
