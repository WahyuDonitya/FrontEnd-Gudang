import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import dayjs from "dayjs";
import MDTypography from "components/MDTypography";

const PrintAbleKartuStok = ({ kartuStok, stokAwal, datePickerAwal, datePickerAkhir }) => {
  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <img
          src={require("../../../assets/images/logos/nyonya-poo.png")}
          style={{ width: "150px", height: "auto" }}
        />
        <div style={{ marginLeft: "20px" }}>
          <p style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "2px" }}>
            Tahu POO Kediri
          </p>
          <p style={{ fontSize: "14px", color: "#555" }}>
            Alamat: Jl. Raya Ampeldento No.17, Pakis, Malang, Jawa Timur 65154, Indonesia
          </p>
        </div>
      </div>
      <hr></hr>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ textAlign: "left", width: "50%" }}>
          <p>
            <strong>Periode Awal :</strong> {datePickerAwal}
          </p>
          <p>
            <strong>Periode Akhir :</strong> {datePickerAkhir}
          </p>
        </div>
      </div>
      {/* Your printable content goes here */}
      <h1>Printable Content</h1>
      {/* <p>Nota : {headerKeluar?.hkeluar_nota}</p>
      <p>Customer : {headerKeluar?.customer?.customer_nama}</p>
      <p>Customer Alamat : {headerKeluar?.customer?.customer_alamat}</p>
      <p>Rencana Kirim Tanggal : {headerKeluar?.hkeluar_tanggal}</p>
      <p>Gudang Asal: {headerKeluar?.gudang?.gudang_nama}</p> */}

      <MDTypography>Stok awal : {stokAwal}</MDTypography>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>No.</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Tanggal Transaksi
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Batch Barang
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah Barang Masuk
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah Barang Keluar
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Stok Tersedia
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Keterangan Transaksi
            </th>
          </tr>
        </thead>
        <tbody>
          {kartuStok.map((item, index) => (
            <tr key={item.logbarang_id}>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {index + 1}.
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.created_at ? format(new Date(item.created_at), "dd-MM-yyyy") : "-"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detail_barang?.detailbarang_batch}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.logbarang_masuk ? item.logbarang_masuk : "-"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.logbarang_keluar ? item.logbarang_keluar : "-"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.logbarang_stoksekarang}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>
                {item.logbarang_keterangan}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Styling for printing, you may include media queries in your CSS */}
      <style>
        {`
        @media print {
          /* Your print styles go here */
        }
      `}
      </style>
    </div>
  );
};

PrintAbleKartuStok.propTypes = {
  kartuStok: PropTypes.array.isRequired,
  stokAwal: PropTypes.string.isRequired,
  datePickerAwal: PropTypes.instanceOf(dayjs).isRequired,
  datePickerAkhir: PropTypes.instanceOf(dayjs).isRequired,
};

export default PrintAbleKartuStok;
