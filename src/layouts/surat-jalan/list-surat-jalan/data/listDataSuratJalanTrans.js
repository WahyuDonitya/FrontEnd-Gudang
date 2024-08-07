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

// Images
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [approvalList, setApprovalList] = useState([]);

  //    API
  const getApprovalList = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/suratjalan/get-surat-jalan-transfer-all",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setApprovalList(response.data);
      console.log("ini approval ", approvalList);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };
  //    End API

  useEffect(() => {
    getApprovalList();
  }, []);

  return {
    columns2: [
      {
        Header: "No. Surat Jalan",
        accessor: "suratjalantransfer_nota",
        width: "12%",
        align: "left",
      },
      { Header: "No. Nota", accessor: "htransfer.htransfer_barang_nota", align: "center" },
      { Header: "Gudang Asal", accessor: "htransfer.gudang_asal.gudang_nama", align: "center" },
      { Header: "Gudang Tujuan", accessor: "htransfer.gudang_tujuan.gudang_nama", align: "center" },
      { Header: "Tanggal Kirim", accessor: "suratjalantransfer_tanggalkirim", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
      { Header: "Diputus Oleh", accessor: "pengguna_action.pengguna_nama", align: "center" },
      { Header: "Pengirim", accessor: "pengirim", align: "center" },
      { Header: "Comment", accessor: "suratjalantransfer_comment", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows2: approvalList.map((item) => ({
      suratjalantransfer_nota: item.suratjalantransfer_nota,
      htransfer: {
        htransfer_barang_nota: item.htransfer?.htransfer_barang_nota,
        gudang_asal: { gudang_nama: item.htransfer?.gudang_asal?.gudang_nama },
        gudang_tujuan: { gudang_nama: item.htransfer?.gudang_tujuan?.gudang_nama },
      },
      suratjalantransfer_comment: item.suratjalantransfer_comment || "-",
      suratjalantransfer_tanggalkirim: dayjs(item.suratjalantransfer_tanggalkirim).format(
        "DD-MM-YYYY"
      ),
      pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama || "-" },
      pengguna_action: { pengguna_nama: item.pengguna_action?.pengguna_nama || "-" },
      pengirim: item.suratjalantransfer_pengirim || "-",
      status:
        item.suratjalantransfer_status === 0 ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Terkirim" color="success" variant="gradient" size="sm" />
          </MDBox>
        ) : item.suratjalantransfer_status === 1 ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Ditolak" color="danger" variant="gradient" size="sm" />
          </MDBox>
        ) : item.suratjalantransfer_status === 2 ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Menunggu Approval" color="info" variant="gradient" size="sm" />
          </MDBox>
        ) : item.suratjalantransfer_status === 4 ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Proses Pengiriman" color="info" variant="gradient" size="sm" />
          </MDBox>
        ) : item.suratjalantransfer_status === 5 ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Rusak" color="error" variant="gradient" size="sm" />
          </MDBox>
        ) : (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Proses Pengiriman" color="info" variant="gradient" size="sm" />
          </MDBox>
        ),
      action: (
        <Link to={`/detailsurat-jalan/transferbarang/${item.suratjalantransfer_nota}`}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {item.suratjalantransfer_status === 3 ? "Print" : "Detail"}
          </MDTypography>
        </Link>
      ),
    })),
  };
}
