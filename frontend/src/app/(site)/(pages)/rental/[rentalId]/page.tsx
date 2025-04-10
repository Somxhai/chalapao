'use client';
import Link from 'next/link';
import { Button, Card } from 'flowbite-react';

const rentalDetail = {
  id: '1',
  name: 'Canon EOS R8',
  shopName: 'GearGo Rental',
  owner: 'Gphat',
  ownerFullname: 'ชื่อ นามสกุล',
  renter: 'Gphat',
  renterFullname: 'ชื่อ นามสกุล',
  address: 'ที่อยู่',
  image: 'https://i5.walmartimages.com/seo/Canon-EOS-90D-DSLR-Camera-with-18-135mm-Lens-3616C016_d5438c50-f566-42e6-968b-ea49b53e1b1f_1.d37dc514f4f3f657db267af16621a2ae.jpeg',
  status: 'รอผู้ปล่อยเช่ายืนยัน',
  startDate: '22 มีนาคม 2568',
  endDate: '12 เมษายน 2568',
  duration: '1 เดือน',
  rentPrice: 1800,
  shipping: 120,
};

const Page = () => {
  return (
    <div className="bg-gray-100 min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl p-6 shadow">
        {/* Title + Back link */}
        <h1 className="text-2xl font-bold mb-4">
          <Link href="/rentals" className="hover:underline text-blue-600">
            My Rental List
          </Link>{' '}
          &gt;&gt; {rentalDetail.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold mb-1">{rentalDetail.name}</h2>
            <p className="text-gray-600 mb-6">
              {rentalDetail.shopName}{' '}
              <Link href={`/shop/${rentalDetail.shopName}`}>
                <span className="text-blue-600 text-sm underline ml-1 hover:text-blue-800">
                  ดูร้านค้า
                </span>
              </Link>
            </p>

            {/* Lender & Renter */}
            <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
              <div>
                <h3 className="font-bold mb-2">Lender</h3>
                <p>ผู้ให้เช่า : {rentalDetail.owner}</p>
                <p>ชื่อ-สกุล : {rentalDetail.ownerFullname}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Renter</h3>
                <p>ผู้เช่า : {rentalDetail.renter}</p>
                <p>ชื่อ-สกุล : {rentalDetail.renterFullname}</p>
                <p>ที่อยู่จัดส่ง : {rentalDetail.address}</p>
              </div>
            </div>

            {/* Renting Info */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Renting</h3>
              <p>ระยะเวลาการเช่า : {rentalDetail.duration}</p>
              <p>ตั้งแต่วันที่ : {rentalDetail.startDate}</p>
              <p>ถึงวันที่ : {rentalDetail.endDate}</p>
              <Link href="/rental-terms">
                <span className="text-blue-600 underline text-sm mt-2 inline-block hover:text-blue-800">
                  อ่านเงื่อนไขการเช่า และการปรับ
                </span>
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-right">
              {rentalDetail.status}
            </p>

            <div className="w-full flex justify-center">
              <img
                src={rentalDetail.image}
                alt="Product"
                className="rounded-md object-contain w-[200px] h-[200px]"
              />
            </div>

            {/* Summary Card */}
            <Card>
              <div className="flex gap-4 mb-2">
                <img
                  src={rentalDetail.image}
                  alt="Camera"
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 text-sm">
                  <p className="font-semibold">{rentalDetail.name}</p>
                  <p>เช่าจาก : ชื่อ สกุล</p>
                  <p>ผู้เช่า : ชื่อ สกุล</p>
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
                  <span className="text-lg font-bold">
                    {rentalDetail.rentPrice + rentalDetail.shipping} บาท
                  </span>
                </div>
              </div>
            </Card>

            <Link href={`/cancel/${rentalDetail.id}`}>
              <Button color="gray" className="w-full">
                ยกเลิก
              </Button>
            </Link>
          </div>
        </div>

        {/* ปุ่มย้อนกลับแยกด้านล่าง (optional) */}
        <div className="mt-6 text-center">
          <Link href="/rentals">
            <Button color="light">ย้อนกลับไปหน้ารายการเช่า</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
