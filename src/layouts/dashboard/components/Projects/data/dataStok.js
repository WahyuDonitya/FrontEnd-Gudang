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
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [stok, setStok] = useState([]);

  //    API
  const getStok = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/detailbarang/get-detail-barang-stok-by-gudang",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setStok(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };
  //    End API

  useEffect(() => {
    getStok();
  }, []);

  return {
    columns: [
      {
        Header: "Nama Barang",
        accessor: "barang",
        width: "12%",
        align: "left",
      },
      { Header: "Jumlah Stok", accessor: "total_stok", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Detail", accessor: "detail", align: "center" },
    ],

    rows: stok.map((item) => ({
      barang: item.barang_nama,
      status: (
        <>
          <MDBox ml={-1}>
            {item.total_stok == 0 ? (
              <MDBadge badgeContent="Stok Habis" color="error" variant="gradient" size="sm" />
            ) : item.total_stok < 50 ? (
              <MDBadge badgeContent="Under Stok" color="warning" variant="gradient" size="sm" />
            ) : (
              <MDBadge badgeContent="OK" color="success" variant="gradient" size="sm" />
            )}
          </MDBox>
        </>
      ),
      total_stok: item.total_stok,
      detail: (
        <Link to={`/dashboard/${item.barang_id}`}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Detail
          </MDTypography>
        </Link>
      ),
    })),
  };
}
