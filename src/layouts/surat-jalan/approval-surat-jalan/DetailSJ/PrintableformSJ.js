import React from "react";
import PropTypes from "prop-types";

const PrintableformSJ = ({ detailSuratJalan, headerSuratJalan }) => {
  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <img
          src={require("../../../../assets/images/logos/nyonya-poo.png")}
          style={{ width: "150px", height: "auto" }}
        />
        <div style={{ marginLeft: "20px" }}>
          <p style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "2px" }}>
            PT. Eka Artha Buana
          </p>
          <p style={{ fontSize: "14px", color: "#555" }}>
            Alamat: Perumahan Nginden Intan Barat Blok C1-24
          </p>
        </div>
      </div>
      <hr></hr>
      {/* Your printable content goes here */}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ textAlign: "left", width: "50%" }}>
          <p>
            <strong>Surat Jalan Nota : </strong> {headerSuratJalan?.suratjalan_nota}
          </p>
          <p>
            <strong>Tanggal Kirim : </strong> {headerSuratJalan?.suratjalan_tanggalkirim}
          </p>
          <p>
            <strong>Gudang Asal : </strong> {headerSuratJalan.h_keluar?.gudang?.gudang_nama}
          </p>
        </div>
        <div style={{ textAlign: "left", width: "50%" }}>
          <p>
            <strong>Customer : </strong> {headerSuratJalan.h_keluar?.customer?.customer_nama}
          </p>
          <p>
            <strong>Customer Alamat : </strong>{" "}
            {headerSuratJalan.h_keluar?.customer?.customer_alamat}
          </p>
          <p>
            <strong>Customer Telepon : </strong>{" "}
            {headerSuratJalan.h_keluar?.customer?.customer_telepon}
          </p>
        </div>
      </div>

      <h2>Detail Surat Jalan</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>No.</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Nama Barang
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Batch Barang
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah Barang
            </th>
          </tr>
        </thead>
        <tbody>
          {detailSuratJalan.map((item, index) => (
            <tr key={item.dtransfer_barang_id}>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {index + 1}.
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.d_keluar.barang.barang_nama}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.d_keluar.d_barang.detailbarang_batch}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.dsuratjalan_jumlah}
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

PrintableformSJ.propTypes = {
  detailSuratJalan: PropTypes.array.isRequired,
  headerSuratJalan: PropTypes.object.isRequired,
};
export default PrintableformSJ;
