import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { format } from "date-fns";

const PrintableDetailStokOpname = ({ detailKeluar, headerKeluar, detailBarang }) => {
  const createdAtDate = headerKeluar?.created_at ? new Date(headerKeluar.created_at) : null;
  const formattedDate = createdAtDate ? format(createdAtDate, "dd-MM-yyyy") : "";
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
            Alamat: Perumahan Nginden Intan Barat Blok C1-24
          </p>
        </div>
      </div>
      <hr></hr>

      {/* Your printable content goes here */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ textAlign: "left", width: "50%" }}>
          <p>
            <strong>Nota:</strong> {headerKeluar?.opname_nota}
          </p>
          <p>
            <strong>Periode Mulai : </strong>{" "}
            {dayjs(headerKeluar?.opname_date_start).format("DD-MM-YYYY")}
          </p>
          <p>
            <strong>Periode Akhir : </strong>{" "}
            {dayjs(headerKeluar?.opname_date_end).format("DD-MM-YYYY")}
          </p>
        </div>
        <div style={{ textAlign: "left", width: "50%" }}>
          <p>
            <strong>Periode Opname :</strong> {headerKeluar?.opname_periode}
          </p>
          <p>
            <strong>Pembuat :</strong> {headerKeluar?.pengguna_generate?.pengguna_nama}
          </p>
          <p>
            <strong>Opname catatan :</strong> {headerKeluar?.opname_catatan}
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
              Stok Awal
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah Barang Masuk
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah Barang Keluar
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah Barang Tercatat
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah Barang Aktual
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah selisih
            </th>
            {/* <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Proses Approve
            </th> */}
            {/* <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Tempat Barang
            </th> */}
          </tr>
        </thead>
        <tbody>
          {detailKeluar.map((item, index) => (
            <tr key={item.dkeluar_id}>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {index + 1}.
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.barang?.barang_nama || "-"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detailopname_stokawal}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detailopname_stokmasuk}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detailopname_stokkeluar}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detailopname_stoktercatat}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detailopname_stokaktual}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detailopname_difference}
              </td>
              {/* <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.dkeluar_needapprovekirim}
              </td> */}
              {/* <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.get_penempatan_trans.map((penempatanTrans, index) => {
                  console.log("penempatanTrans", penempatanTrans);

                  if (penempatanTrans.get_penempatan) {
                    console.log("get_penempatan", penempatanTrans.get_penempatan);

                    if (penempatanTrans.get_penempatan.get_rack) {
                      console.log("get_rack", penempatanTrans.get_penempatan.get_rack);

                      return (
                        <div key={penempatanTrans.penempatanproduk_trans_id}>
                          Row : {penempatanTrans.get_penempatan.get_rack.get_rows.row_name}, sel :{" "}
                          {penempatanTrans.get_penempatan.get_rack.rack_bay}, Level :{" "}
                          {penempatanTrans.get_penempatan.get_rack.rack_level} .{" "}
                          <strong>Jumlah: {penempatanTrans.penempatanproduk_trans_jumlah}</strong> ,
                        </div>
                      );
                    } else {
                      console.log("get_rack is undefined");
                    }
                  } else {
                    console.log("get_penempatan is undefined");
                  }

                  return "Ambil Dari Bulk";
                })}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>List Barang </h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>No.</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Nama barang
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Batch barang
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah tercatat
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Lokasi barang
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah Aktual
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah Selisih
            </th>
          </tr>
        </thead>
        <tbody>
          {detailBarang.map((item, index) => (
            <tr key={item.detailbarangopname_id}>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {index + 1}.
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detail_barang?.barang?.barang_nama}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detail_barang?.detailbarang_batch}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detailbarangopname_jumlahditempat}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.penempatanproduk_id
                  ? "Rows : " +
                    (item.penempatan_produk
                      ? item.penempatan_produk?.get_rack?.get_rows?.row_name || "ambil dari Bulk"
                      : "ambil dari Bulk") +
                    " Sel: " +
                    (item.penempatan_produk?.get_rack?.rack_bay || "ambil dari Bulk") +
                    " Level: " +
                    (item.penempatan_produk?.get_rack?.rack_level || "ambil dari Bulk")
                  : "ambil dari bulk"}
              </td>

              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detailbarangopname_jumlahaktual || " "}
              </td>

              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detailbarangopname_jumlahdifference || ""}
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

PrintableDetailStokOpname.propTypes = {
  detailBarang: PropTypes.array.isRequired,
  detailKeluar: PropTypes.array.isRequired,
  headerKeluar: PropTypes.object.isRequired,
};

export default PrintableDetailStokOpname;

// {
//   detailKeluar.map((item, index) => (
//     <tr key={item.dtransfer_barang_id}>
//       {/* ... (kode sebelumnya) */}
//       <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
//         {item.dkeluar_needapprovekirim}
//       </td>
//       <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
//         {/* Accessing getPenempatanTrans property */}
//         {item.get_penempatan_trans.map((penempatanTrans) => (
//           <div key={penempatanTrans.penempatanproduk_trans_id}>
//             {/* Displaying relevant data from get_penempatan_trans */}
//             Jumlah Penempatan: {penempatanTrans.penempatanproduk_trans_jumlah}
//             {/* Add more fields as needed */}
//           </div>
//         ))}
//       </td>
//     </tr>
//   ));
// }
