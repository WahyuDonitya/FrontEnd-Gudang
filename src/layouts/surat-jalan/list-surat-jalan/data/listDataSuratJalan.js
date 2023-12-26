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
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [approvalList, setApprovalList] = useState([]);

  //    API
  const getApprovalList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/suratjalan/get-surat-jalan-all", {
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
      { Header: "No. Surat Jalan", accessor: "suratjalan_nota", width: "12%", align: "left" },
      { Header: "No. Nota", accessor: "h_keluar.hkeluar_nota", align: "center" },
      { Header: "Customer", accessor: "customer.customer_nama", align: "center" },
      { Header: "Customer Alamat", accessor: "customer.customer_alamat", align: "center" },
      { Header: "Dari Gudang", accessor: "gudang.gudang_nama", align: "center" },
      { Header: "Tanggal Kirim", accessor: "suratjalan_tanggalkirim", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: approvalList.map((item) => ({
      suratjalan_nota: item.suratjalan_nota,
      h_keluar: { hkeluar_nota: item.h_keluar?.hkeluar_nota },
      customer: {
        customer_nama: item.h_keluar?.customer?.customer_nama,
        customer_alamat: item.h_keluar?.customer?.customer_alamat,
      },
      gudang: {
        gudang_nama: item.h_keluar?.gudang?.gudang_nama,
      },
      suratjalan_tanggalkirim: item.suratjalan_tanggalkirim,
      status:
        item.suratjalan_status === 1
          ? "Ditolak"
          : item.suratjalan_status === 2
          ? "Menunggu Approval"
          : item.suratjalan_status === 3
          ? "Proses Pengiriman"
          : "Terkirim",
      action: (
        <Link to={`/detailsurat-jalan/${item.suratjalan_nota}`}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {item.suratjalan_status === 3 ? "Print" : "Detail"}
          </MDTypography>
        </Link>
      ),
    })),
  };
}
