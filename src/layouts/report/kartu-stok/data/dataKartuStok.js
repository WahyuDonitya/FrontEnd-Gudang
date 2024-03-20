import MDTypography from "components/MDTypography";

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [kartuStok, setKartuStok] = useState([]);

  //    API
  const getKartuStok = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/log-barang/get-kartu-stok/1/2023-12-27/2023-12-28",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setKartuStok(response.data);
      //   console.log(kartuStok);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data kartu Stok:", error);
    }
  };
  //    End API

  useEffect(() => {
    getKartuStok();
  }, []);

  return {
    columns: [
      { Header: "Tanggal Transaksi", accessor: "created_at", align: "center" },
      { Header: "Barang Masuk", accessor: "logbarang_masuk", align: "center" },
      { Header: "Barang Keluar", accessor: "logbarang_keluar", align: "center" },
      { Header: "Stok Tersedia", accessor: "logbarang_stoksekarang", align: "center" },
      { Header: "Jenis Transaksi", accessor: "jenistransaksi", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
      //   { Header: "Print Surat Jalan", accessor: "action_print", align: "center" },
    ],

    rows: kartuStok.map((item) => ({
      created_at: item.created_at ? format(new Date(item.created_at), "dd-MM-yyyy") : "-",
      logbarang_masuk: item.logbarang_masuk ? item.logbarang_masuk : "-",
      logbarang_keluar: item.logbarang_keluar ? item.logbarang_keluar : "-",
      logbarang_stoksekarang: item.logbarang_stoksekarang,
      jenistransaksi:
        item.hkeluar_id !== null
          ? "Barang Keluar"
          : item.hmasuk_id !== null
          ? "Barang Masuk"
          : item.htransfer_barang_id !== null
          ? "Transfer internal"
          : "Belum ada",
      action: (
        <Link to={`/detailbarang-masuk/${item.hmasuk_nota}`}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Detail
          </MDTypography>
        </Link>
      ),
      //   action_print:
      //     item.suratjalan_status === 3 ? (
      //       <Link to={`/detailsurat-jalan/${item.suratjalan_nota}`}>
      //         <MDTypography variant="caption" color="text" fontWeight="medium">
      //           Print
      //         </MDTypography>
      //       </Link>
      //     ) : null,
    })),
  };
}
