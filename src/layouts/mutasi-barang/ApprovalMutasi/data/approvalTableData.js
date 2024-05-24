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
    echo.channel("gudang-real-time").listen(".RealTimeMutasiBarang", (event) => {
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
        "https://api.tahupoosby.com/api/gudang/get-transaksi/get-htrans",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
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

  // ini untuk real-time setiap 15 detik sekali
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("https://api.tahupoosby.com/api/gudang/get-transaksi/get-htrans", {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });
  //       const data = await response.json();

  //       // console.log("Data terbaru:", data);
  //       // Implementasikan logika pembaruan tampilan di sini
  //       setApprovalList(data);
  //     } catch (error) {
  //       console.error("Terjadi kesalahan:", error);
  //     }
  //   };

  //   // Panggil fetchData pertama kali
  //   fetchData();

  //   // Atur interval untuk memanggil fetchData setiap 5 detik
  //   const intervalId = setInterval(() => {
  //     fetchData();
  //   }, 15000);

  //   // Membersihkan interval saat komponen di-unmount
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  return {
    columns: [
      { Header: "No. Nota", accessor: "htransfer_barang_nota", width: "12%", align: "left" },
      { Header: "Gudang Asal", accessor: "gudang_asal.gudang_nama", align: "center" },
      { Header: "Gudang Tujuan", accessor: "gudang_tujuan.gudang_nama", align: "center" },
      { Header: "Tanggal Kirim", accessor: "htransfer_barang_tanggal_dikirim", align: "center" },
      { Header: "Catatan Transfer", accessor: "htransfer_barang_catatan", align: "center" },
      { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
      //   { Header: "Print Surat Jalan", accessor: "action_print", align: "center" },
    ],

    rows: approvalList.map((item) => ({
      htransfer_barang_nota: item.htransfer_barang_nota,
      gudang_asal: { gudang_nama: item.gudang_asal.gudang_nama },
      gudang_tujuan: { gudang_nama: item.gudang_tujuan.gudang_nama },
      htransfer_barang_tanggal_dikirim: dayjs(item.htransfer_barang_tanggal_dikirim).format(
        "DD-MM-YYYY"
      ),
      pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama || "-" },
      htransfer_barang_catatan: item.htransfer_barang_catatan,
      action: (
        <Link to={`/list-mutasi-barang/${item.htransfer_barang_nota}`}>
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
