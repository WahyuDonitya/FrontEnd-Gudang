import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";

const PrintAbleKartuStok = ({ kartuStok }) => {
  return (
    <div>
      {/* Your printable content goes here */}
      <h1>Printable Content</h1>
      {/* <p>Nota : {headerKeluar?.hkeluar_nota}</p>
      <p>Customer : {headerKeluar?.customer?.customer_nama}</p>
      <p>Customer Alamat : {headerKeluar?.customer?.customer_alamat}</p>
      <p>Rencana Kirim Tanggal : {headerKeluar?.hkeluar_tanggal}</p>
      <p>Gudang Asal: {headerKeluar?.gudang?.gudang_nama}</p> */}

      <h2>Detail Surat Jalan</h2>
      <table>
        <thead>
          <tr>
            <th>Tanggal Transaksi</th>
            <th>Batch Barang</th>
            <th>Jumlah Barang Masuk</th>
            <th>Jumlah Barang Keluar</th>
            <th>Stok tersedia</th>
            <th>Jenis Transaksi</th>
          </tr>
        </thead>
        <tbody>
          {kartuStok.map((item) => (
            <tr key={item.logbarang_id}>
              <td>{item.created_at ? format(new Date(item.created_at), "dd-MM-yyyy") : "-"}</td>
              <td>{item.detail_barang?.detailbarang_batch}</td>
              <td>{item.logbarang_masuk ? item.logbarang_masuk : "-"}</td>
              <td>{item.logbarang_keluar ? item.logbarang_keluar : "-"}</td>
              <td>{item.logbarang_stoksekarang}</td>
              <td>
                {item.hkeluar_id !== null
                  ? "Barang Keluar"
                  : item.hmasuk_id !== null
                  ? "Barang Masuk"
                  : item.htransfer_barang_id !== null
                  ? "Transfer internal"
                  : "Belum ada"}
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
};

export default PrintAbleKartuStok;
