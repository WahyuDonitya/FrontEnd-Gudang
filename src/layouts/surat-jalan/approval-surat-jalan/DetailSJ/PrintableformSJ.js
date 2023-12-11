import React from "react";
import PropTypes from "prop-types";

const PrintableformSJ = ({ detailSuratJalan, headerSuratJalan }) => {
  return (
    <div>
      {/* Your printable content goes here */}
      <h1>Printable Content</h1>
      <p>Surat Jalan Nota: {headerSuratJalan?.suratjalan_nota}</p>
      <p>Tanggal: {headerSuratJalan?.suratjalan_tanggalkirim}</p>
      <p>Gudang Asal: {headerSuratJalan.h_keluar?.gudang?.gudang_nama}</p>
      <p>Customer: {headerSuratJalan.h_keluar?.customer?.customer_nama}</p>
      <p>Customer Alamat : {headerSuratJalan.h_keluar?.customer?.customer_alamat}</p>
      <p>Customer Telepon : {headerSuratJalan.h_keluar?.customer?.customer_telepon}</p>

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
          {detailSuratJalan.map((item) => (
            <tr key={item.dsuratjalan_id}>
              <td>{item.d_keluar.barang.barang_nama}</td>
              <td>{item.d_keluar.d_barang.detailbarang_batch}</td>
              <td>{item.dsuratjalan_jumlah}</td>
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
