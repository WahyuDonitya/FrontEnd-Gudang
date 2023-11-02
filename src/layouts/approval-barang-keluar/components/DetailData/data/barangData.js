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

export default function barangData({ detailKeluar }) {
  if (!detailKeluar || detailKeluar.length === 0) {
    return <div>Data tidak tersedia.</div>;
  }

  return {
    columns: [
      { Header: "Nama Barang", accessor: "barang.nama_barang", width: "10%", align: "left" },
      { Header: "Jumlah Barang", accessor: "dkeluar_jumlah", align: "center" },
      { Header: "Harga", accessor: "dkeluar_harga", align: "center" },
    ],

    rows: detailKeluar.map((item) => ({
      barang: { barang_nama: item.barang.barang_nama },
      dkeluar_jumlah: item.dkeluar_jumlah,
      dkeluar_harga: item.dkeluar_harga,
    })),
  };
}
