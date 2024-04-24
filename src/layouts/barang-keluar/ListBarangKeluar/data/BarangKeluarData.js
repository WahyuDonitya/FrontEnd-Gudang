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
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [approvalList, setApprovalList] = useState([]);

  //    API
  const getApprovalList = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/transaksi-barang/getAll-hkeluar",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setApprovalList(response.data);
      // console.log(approvalList);
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
      { Header: "No. Nota", accessor: "hkeluar_nota", width: "10%", align: "left" },
      { Header: "Nama Customer", accessor: "customer.customer_nama", align: "center" },
      { Header: "Gudang", accessor: "gudang.gudang_nama", align: "center" },
      { Header: "Tanggal Keluar", accessor: "hkeluar_tanggal", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
      { Header: "Diputus Oleh", accessor: "pengguna_action.pengguna_nama", align: "center" },
      { Header: "Comment", accessor: "hkeluar_comment", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
      { Header: "List surat jalan", accessor: "list_jalan", align: "center" },
    ],

    rows: approvalList.map((item) => ({
      hkeluar_nota: item.hkeluar_nota,
      customer: { customer_nama: item.customer?.customer_nama },
      gudang: { gudang_nama: item.gudang?.gudang_nama },
      hkeluar_tanggal: dayjs(item.hkeluar_tanggal).format("DD-MM-YYYY"),
      pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama || "-" },
      pengguna_action: { pengguna_nama: item.pengguna_action?.pengguna_nama || "-" },
      hkeluar_comment: item.hkeluar_comment || "-",
      status:
        item.hkeluar_status === 0 ? (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="Sudah tuntas terkirim"
              color="success"
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ) : item.hkeluar_status === 1 ? (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent="terkirim sebagian"
              color="success"
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ) : item.hkeluar_status === 2 ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Belum Terkirim" color="info" variant="gradient" size="sm" />
          </MDBox>
        ) : item.hkeluar_status === 3 ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Menunggu Approval" color="info" variant="gradient" size="sm" />
          </MDBox>
        ) : item.hkeluar_status === 5 ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Rusak Semua" color="error" variant="gradient" size="sm" />
          </MDBox>
        ) : (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Ditolak" color="warning" variant="gradient" size="sm" />
          </MDBox>
        ),
      action: (
        <Link to={`/detail/${item.hkeluar_nota}`}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {item.hkeluar_status === 2 ? "Print" : "Detail"}
          </MDTypography>
        </Link>
      ),
      list_jalan: (
        <Link to={`/list-suratjalan-by-hkeluar/${item.hkeluar_nota}`}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Show
          </MDTypography>
        </Link>
      ),
    })),
  };
}
