import React from "react";
import QRCode from "qrcode.react";
import { TheSinhVien as TheSinhVienI } from "@/models/InfoForm";

const TheSinhVien = (props: { data: TheSinhVienI }) => {
  const { data } = props;

  return (
    <>
      {data && (
        <div className="w-[300px] overflow-hidden rounded-xl thesv relative">
          <img
            style={{ transform: "scale(1.02)" }}
            src="/assets/the.svg"
            alt="thesv"
          />
          <p className="absolute top-[70px] left-[130px] text-[10px]">
            <strong>Họ tên:</strong> {data.ho_ten}
          </p>
          <p className="absolute top-[85px] left-[130px] text-[10px]">
            <strong>Chuyên ngành:</strong> {data.nganh} - {data.ma_nganh}
          </p>
          <p className="absolute top-[100px] left-[130px] text-[10px]">
            <strong>Ngày sinh:</strong> {data.ngay_sinh}
          </p>
          <p className="absolute top-[115px] left-[130px] text-[10px]">
            <strong>Mã sinh viên:</strong> {data.msv}
          </p>
          <p className="absolute top-[130px] left-[130px] text-[10px]">
            <strong>Năm học:</strong> {data.nam_hoc}
          </p>
          <div className="absolute w-[40px] top-[127px] right-[20px] text-[10px]">
            <QRCode
              value={`${data.msv}|${data.ho_ten}|${data.nganh} - ${data.ma_nganh}|${data.ngay_sinh}|${data.nam_hoc}`}
              size={50}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TheSinhVien;
