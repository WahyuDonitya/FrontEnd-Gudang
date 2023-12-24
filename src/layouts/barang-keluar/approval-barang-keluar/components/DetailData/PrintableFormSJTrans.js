import React from "react";
import PropTypes from "prop-types";

const PrintableFormBarangKeluar = ({ detailKeluar, headerKeluar }) => {
  return (
    <div>
      {/* Your printable content goes here */}
      <h1>Printable Content</h1>
      <p>Nota : {headerKeluar?.hkeluar_nota}</p>
      <p>Customer : {headerKeluar?.customer?.customer_nama}</p>
      <p>Customer Alamat : {headerKeluar?.customer?.customer_alamat}</p>
      <p>Rencana Kirim Tanggal : {headerKeluar?.hkeluar_tanggal}</p>
      <p>Gudang Asal: {headerKeluar?.gudang?.gudang_nama}</p>

      <h2>Detail Surat Jalan</h2>
      <table>
        <thead>
          <tr>
            <th>Nama Barang</th>
            <th>Batch Barang</th>
            <th>Jumlah Barang</th>
          </tr>
        </thead>
        <tbody>
          {detailKeluar.map((item) => (
            <tr key={item.dtransfer_barang_id}>
              <td>{item.barang.barang_nama}</td>
              <td>{item.d_barang.detailbarang_batch}</td>
              <td>{item.dkeluar_jumlah}</td>
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

PrintableFormBarangKeluar.propTypes = {
  detailKeluar: PropTypes.array.isRequired,
  headerKeluar: PropTypes.object.isRequired,
};

export default PrintableFormBarangKeluar;
