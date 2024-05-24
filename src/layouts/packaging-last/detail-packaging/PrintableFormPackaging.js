import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";

const PrintableFormPackaging = ({ detailKeluar, headerKeluar }) => {
  const createdAtDate = headerKeluar?.created_at ? new Date(headerKeluar.created_at) : null;
  const formattedDate = createdAtDate ? format(createdAtDate, "dd-MM-yyyy") : "";
  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <img
          src={require("../../../assets/images/logos/nyonya-poo.png")}
          style={{ width: "150px", height: "auto" }}
          alt="Logo"
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
            <strong>Nota:</strong> {headerKeluar?.hpackaging_nota}
          </p>
          <p>
            <strong>Tanggal Dibuat:</strong> {formattedDate}
          </p>
        </div>
        <div style={{ textAlign: "left", width: "50%" }}>
          <p>
            <strong>Pembuat:</strong> {headerKeluar?.pengguna_generate?.pengguna_nama}
          </p>
          <p>
            <strong>Penanggung Jawab:</strong> {headerKeluar?.hpackaging_penanggungjawab}
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
              Exp Barang
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Batch Barang
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah Packaging
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah Rusak
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Jumlah Berhasil
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
              Penempatan Barang
            </th>
          </tr>
        </thead>
        <tbody>
          {detailKeluar.map((item, index) => (
            <tr key={item.dpackaging_id}>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {index + 1}.
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                Tahu POO Polos
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detail_barang.detailbarang_expdate}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.detail_barang.detailbarang_batch}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.dpackaging_jumlah}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.dpackaging_jumlahrusak}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                {item.dpackaging_jumlahberhasil}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
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

                  return "Ambil Dari `Bulk`";
                })}
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

PrintableFormPackaging.propTypes = {
  detailKeluar: PropTypes.arrayOf(
    PropTypes.shape({
      dpackaging_id: PropTypes.number.isRequired,
      dpackaging_jumlah: PropTypes.number.isRequired,
      dpackaging_jumlahrusak: PropTypes.number.isRequired,
      dpackaging_jumlahberhasil: PropTypes.number.isRequired,
      detail_barang: PropTypes.shape({
        detailbarang_expdate: PropTypes.string.isRequired,
        detailbarang_batch: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  headerKeluar: PropTypes.shape({
    created_at: PropTypes.string,
    hpackaging_nota: PropTypes.string,
    pengguna_generate: PropTypes.shape({
      pengguna_nama: PropTypes.string,
    }),
    hpackaging_penanggungjawab: PropTypes.string,
  }).isRequired,
};

export default PrintableFormPackaging;

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
