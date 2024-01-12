import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";

const PrintableFormBarangKeluar = ({ detailKeluar, headerKeluar }) => {
  const createdAtDate = headerKeluar?.created_at ? new Date(headerKeluar.created_at) : null;
  const formattedDate = createdAtDate ? format(createdAtDate, "dd-MM-yyyy") : "";
  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <img
          src={require("../../../../../assets/images/logos/LOGO EAB ok 1.png")}
          style={{ width: "150px", height: "auto" }}
        />
        <div style={{ marginLeft: "20px" }}>
          <p style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "2px" }}>
            PT. Eka Artha Buana
          </p>
          <p style={{ fontSize: "14px", color: "#555" }}>
            Alamat: Jl. Raya Ampeldento No.17, Pakis, Malang, Jawa Timur 65154, Indonesia
          </p>
        </div>
      </div>
      <hr></hr>

      {/* Your printable content goes here */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ textAlign: "left", width: "50%" }}>
          <p>
            <strong>Nota:</strong> {headerKeluar?.hkeluar_nota}
          </p>
          <p>
            <strong>Customer:</strong> {headerKeluar?.customer?.customer_nama}
          </p>
          <p>
            <strong>Alamat:</strong> {headerKeluar?.customer?.customer_alamat}
          </p>
        </div>
        <div style={{ textAlign: "left", width: "50%" }}>
          <p>
            <strong>Tanggal Dibuat:</strong> {formattedDate}
          </p>
          <p>
            <strong>Gudang Asal:</strong> {headerKeluar?.gudang?.gudang_nama}
          </p>
        </div>
      </div>

      <h2>List Barang </h2>
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
          {detailKeluar.map((item, index) => (
            <tr key={item.dtransfer_barang_id}>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {index + 1}.
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.barang.barang_nama}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.d_barang.detailbarang_batch}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.dkeluar_jumlah}
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
          body {
            font-size: 12px;
          }
        }
      `}
      </style>
    </div>
  );
};

PrintableFormBarangKeluar.propTypes = {
  detailKeluar: PropTypes.array.isRequired,
  headerKeluar: PropTypes.object.isRequired,
};

export default PrintableFormBarangKeluar;
