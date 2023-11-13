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

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [approvalList, setApprovalList] = useState([]);

  //    API
  const getApprovalList = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/gudang/get-transaksi/get-header-rejected-mutasi",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setApprovalList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };
  //    End API

  useEffect(() => {
    getApprovalList();
  }, []);

  return {
    columnsreject: [
      { Header: "No. Nota", accessor: "htransfer_barang_nota", width: "12%", align: "left" },
      { Header: "Gudang Asal", accessor: "gudang_asal.gudang_nama", align: "center" },
      { Header: "Gudang Tujuan", accessor: "gudang_tujuan.gudang_nama", align: "center" },
      { Header: "Tanggal Kirim", accessor: "htransfer_barang_tanggal_dikirim", align: "center" },
      { Header: "Catatan Transfer", accessor: "htransfer_barang_catatan", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
      //   { Header: "Print Surat Jalan", accessor: "action_print", align: "center" },
    ],

    rowsreject: approvalList.map((item) => ({
      htransfer_barang_nota: item.htransfer_barang_nota,
      gudang_asal: { gudang_nama: item.gudang_asal.gudang_nama },
      gudang_tujuan: { gudang_nama: item.gudang_tujuan.gudang_nama },
      htransfer_barang_tanggal_dikirim: item.htransfer_barang_tanggal_dikirim,
      htransfer_barang_catatan: item.htransfer_barang_catatan,
      action: (
        <Link to={`/detailmutasi-barang/${item.htransfer_barang_id}`}>
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
