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
import Echo from "laravel-echo";
import Pusher from "pusher-js";

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [approvalList, setApprovalList] = useState([]);

  window.Pusher = Pusher;

  const echo = new Echo({
    broadcaster: "pusher",
    key: "683ba5d4db6280a1434b",
    cluster: "ap1",
    forceTLS: true,
  });

  useEffect(() => {
    echo.channel("gudang-real-time").listen(".RealTimeSuratJalan", (event) => {
      console.log("Real-time event received:", event);
      setApprovalList((prevList) => [event.data, ...prevList]);
    });

    return () => {
      echo.leaveChannel("gudang-real-time");
    };
  }, []);

  //    API
  const getApprovalList = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/suratjalan/get-surat-jalan-approval",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

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
      { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: approvalList.map((item) => ({
      suratjalan_nota: item.suratjalan_nota,
      h_keluar: { hkeluar_nota: item.h_keluar.hkeluar_nota },
      customer: {
        customer_nama: item.h_keluar.customer.customer_nama,
        customer_alamat: item.h_keluar.customer.customer_alamat,
      },
      pengguna_generate: { pengguna_nama: item.pengguna_generate.pengguna_nama },
      gudang: {
        gudang_nama: item.h_keluar.gudang.gudang_nama,
      },
      suratjalan_tanggalkirim: item.suratjalan_tanggalkirim,
      action: (
        <Link to={`/list-surat-jalan/${item.suratjalan_nota}`}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {item.suratjalan_status === 3 ? "Print" : "Detail"}
          </MDTypography>
        </Link>
      ),
    })),
  };
}
