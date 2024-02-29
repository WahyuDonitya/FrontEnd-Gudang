/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [approvalList, setApprovalList] = useState([]);
  const [pemusnahanlist, setPemusnahanList] = useState([]);

  //    API
  const getApprovalList = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/pemusnahan-barang/get-all-pemusnahan-barang",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setPemusnahanList(response.data);
      //   console.log(approvalList);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };
  //    End API

  useEffect(() => {
    getApprovalList();
  }, []);

  return {
    columns: [
      { Header: "No. Nota", accessor: "hpemusnahan_nota", width: "12%", align: "left" },
      { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
      { Header: "Pemberi Keputusan", accessor: "pengguna_action.pengguna_nama", align: "center" },
      { Header: "Catatan", accessor: "hpemusnahan_catatan", align: "center" },
      { Header: "Tanggal Pemusnahan", accessor: "hpemusnahan_tanggal", align: "center" },
      { Header: "Status", accessor: "hpemusnahan_status", align: "center" },
      { Header: "Comment", accessor: "hpemusnahan_rejectreason", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
      //   { Header: "Print Surat Jalan", accessor: "action_print", align: "center" },
    ],

    rows: pemusnahanlist.map((item) => ({
      hpemusnahan_nota: item.hpemusnahan_nota,
      pengguna_generate: { pengguna_nama: item.pengguna_generate.pengguna_nama },
      pengguna_action: { pengguna_nama: item.pengguna_generate.pengguna_nama },
      hpemusnahan_catatan: item.hpemusnahan_catatan || "-",
      hpemusnahan_tanggal: dayjs(item.hpemusnahan_tanggal).format("DD-MM-YYYY"),
      hpemusnahan_status:
        item.hpemusnahan_status === 0
          ? "Menunggu Approval"
          : item.hpemusnahan_status === 1
          ? "Sudah Disetujui"
          : item.hpemusnahan_status === 2
          ? "Ditolak"
          : "Selesai",
      hpemusnahan_rejectreason: item.hpemusnahan_rejectreason || "-",
      // gudang: {
      //   gudang_nama: item.h_keluar.gudang.gudang_nama,
      // },
      //   suratjalan_tanggalkirim: item.suratjalan_tanggalkirim,
      action: (
        <Link to={`/detail-pemusnahan-barang/${item.hpemusnahan_nota}`}>
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
