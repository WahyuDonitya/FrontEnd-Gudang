import React from "react";
import PropTypes from "prop-types";

const PrintableFormSJTrans = ({ detailSuratJalan, headerSuratJalan }) => {
  return (
    <div>
      {/* Your printable content goes here */}
      <h1>Printable Content</h1>
      <p>Surat Jalan Nota: {headerSuratJalan?.suratjalantransfer_nota}</p>
      <p>Tanggal: {headerSuratJalan?.suratjalantransfer_tanggalkirim}</p>
      <p>Gudang Tujuan: {headerSuratJalan.htransfer?.gudang_tujuan?.gudang_nama}</p>
      <p>Gudang Asal: {headerSuratJalan.htransfer?.gudang_asal?.gudang_nama}</p>

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
            <tr key={item.dtransfer_barang_id}>
              <td>{item.detail_barang_transfer.barang.barang_nama}</td>
              <td>{item.detail_barang_transfer.barang_detail.detailbarang_batch}</td>
              <td>{item.dsuratjalantransfer_jumlah}</td>
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

PrintableFormSJTrans.propTypes = {
  detailSuratJalan: PropTypes.array.isRequired,
  headerSuratJalan: PropTypes.object.isRequired,
};

export default PrintableFormSJTrans;
