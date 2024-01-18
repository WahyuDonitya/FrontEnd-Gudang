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
      const response = await axios.get("http://127.0.0.1:8000/api/detailbarang/get-approval-list", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setApprovalList(response.data);
      console.log(approvalList);
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
      { Header: "No. Nota", accessor: "hmasuk_nota", width: "12%", align: "left" },
      { Header: "No. Nota Supplier", accessor: "hmasuk_notasupplier", align: "center" },
      { Header: "Nama Supplier", accessor: "supplier.supplier_name", align: "center" },
      { Header: "Supplier PIC", accessor: "supplier.supplier_pic", align: "center" },
      { Header: "Supplier PIC Number", accessor: "supplier.supplier_pic_number", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
      //   { Header: "Print Surat Jalan", accessor: "action_print", align: "center" },
    ],

    rows: approvalList.map((item) => ({
      hmasuk_nota: item.hmasuk_nota,
      hmasuk_notasupplier: item.hmasuk_notasupplier,
      supplier: {
        supplier_name: item.supplier?.supplier_name,
        supplier_pic: item.supplier?.supplier_pic,
        supplier_pic_number: item.supplier?.supplier_pic_number,
      },
      pengguna_generate: { pengguna_nama: item.pengguna_generate.pengguna_nama },
      status:
        item.hmasuk_status === 2
          ? "Menunggu Approval"
          : item.hmasuk_status === 1
          ? "Sudah Disetujui"
          : "Ditolak",
      //   gudang: {
      //     gudang_nama: item.h_keluar.gudang.gudang_nama,
      //   },
      //   suratjalan_tanggalkirim: item.suratjalan_tanggalkirim,
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
