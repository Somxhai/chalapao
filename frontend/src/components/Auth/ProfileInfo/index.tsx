"use client";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";

const ProfileInfo = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [idCard, setIdCard] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phone", phone);
    formData.append("idCard", idCard);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("address", address);
    formData.append("subdistrict", subdistrict);
    formData.append("district", district);
    formData.append("province", province);
    formData.append("postalCode", postalCode);
    if (file) {
      formData.append("file", file);
    }
    console.log("Form submitted:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
  };

  return (
    <main className="container mx-auto px-16 py-8">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="relative w-full max-w-2xl bg-white p-10 rounded-2xl shadow-md">
          <div className="mb-8 text-center">
            <div className="mb-2 block">
              <img
                src="/icons/logo_black.svg"
                alt="Logo"
                className="mx-auto w-20 h-20"
              />
            </div>
            <h1 className="text-3xl font-bold">Confirm</h1>
            <p className="text-sm text-gray-600">your personal information</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-start w-full">
              {/* --------------ด้านซ้าย----------------- */}
              <div className="flex flex-col flex-1 min-w-0 gap-4 pr-6">
                {/* --------------Firstname----------------- */}
                <Label htmlFor="first-name">First Name</Label>
                <TextInput
                  id="first-name"
                  type="text"
                  required
                  shadow
                  className=""
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {/* --------------เกี่ยวกับ Lastname ทั้งหมด----------------- */}
                <Label htmlFor="last-name">Last Name</Label>
                <TextInput
                  id="last-name"
                  type="text"
                  required
                  shadow
                  className=""
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {/* --------------เกี่ยวกับ Phonenumber ทั้งหมด----------------- */}
                <Label htmlFor="phone">Phone Number</Label>
                <TextInput
                  id="phone"
                  type="tel"
                  required
                  shadow
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {/* --------------เกี่ยวกับ National ID Card  ทั้งหมด----------------- */}
                <Label htmlFor="id-card">National ID Card</Label>
                <TextInput
                  id="id-card"
                  type="text"
                  required
                  shadow
                  value={idCard}
                  onChange={(e) => setIdCard(e.target.value)}
                />
                {/* --------------เกี่ยวกับ preview รูปภาพเวลาเลือก----------------- */}
                {previewUrl && (
                  <div className="flex justify-center mt-4 mb-4 mx-auto w-1/2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-xs max-h-40 object-cover rounded-md"
                    />
                  </div>
                )}
                {/* --------------เกี่ยวกับ ปุ่ม อัพโหลดรูปภาพ----------------- */}
                <div className="flex justify-center mt-4 mb-4 mx-auto w-1/2 max-w-[200px]">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white text-center text-sm py-2 px-4 rounded-md w-full block"
                  >
                    Choose Image
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* เส้นแบ่งกลาง */}
              <div className="w-px bg-gray-300 self-stretch shrink-0"></div>

              {/* --------------ด้านขวา----------------- */}
              <div className="flex flex-col flex-1 min-w-0 gap-4 pl-6">
                {/* --------------เกี่ยวกับ วันเกิด----------------- */}
                <Label htmlFor="dob">Date of Birth</Label>
                <TextInput
                  id="dob"
                  type="text"
                  required
                  shadow
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="dd/mm/yy"
                />
                {/* --------------เกี่ยวกับ gender ทั้งหมด----------------- */}
                <Label>Gender</Label>
                <div className="flex flex-wrap">
                  {["Male", "Female", "Non-binary", "Not Say"].map((g) => (
                    <div key={g} className="w-1/2 mb-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          onChange={(e) => setGender(e.target.value)}
                          checked={gender === g}
                        />
                        {g}
                      </label>
                    </div>
                  ))}
                </div>
                {/* --------------เกี่ยวกับ Primary address ทั้งหมด----------------- */}
                <div className="flex flex-col gap-1">
                  <Label>Primary Address</Label>
                  <p className="text-sm ">residence info</p>
                  <TextInput
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="residence info"
                    shadow
                  />
                </div>
                {/* --------------เกี่ยวกับ Subdistrict ทั้งหมด----------------- */}

                <div className="flex gap-2">
                  <div className="flex flex-col flex-1">
                    <Label htmlFor="subdistrict">Subdistrict</Label>
                    <TextInput
                      id="subdistrict"
                      value={subdistrict}
                      onChange={(e) => setSubdistrict(e.target.value)}
                      placeholder="subdistrict"
                      shadow
                    />
                  </div>
                  {/* --------------เกี่ยวกับ District ทั้งหมด----------------- */}

                  <div className="flex flex-col flex-1">
                    <Label htmlFor="district">District</Label>
                    <TextInput
                      id="district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="district"
                      shadow
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-col flex-1">
                    {/* --------------เกี่ยวกับ Province ทั้งหมด----------------- */}

                    <Label htmlFor="province">Province</Label>
                    <TextInput
                      id="province"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="province"
                      shadow
                    />
                  </div>
                  {/* --------------เกี่ยวกับ Postal Code ทั้งหมด----------------- */}

                  <div className="flex flex-col flex-1">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <TextInput
                      id="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="postal_code"
                      shadow
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* --------------เกี่ยวกับ ปุ่มConfirm ทั้งหมด----------------- */}

            <div className="flex justify-center mt-8 w-full">
              <Button
                type="submit"
                className="w-1/3 border bg-gray-500 text-lg py-4"
              >
                Confirm
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ProfileInfo;
