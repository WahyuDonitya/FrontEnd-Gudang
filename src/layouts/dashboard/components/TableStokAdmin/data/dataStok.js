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

export default function dataStokAdmin() {
  const accessToken = localStorage.getItem("access_token");
  const [stok, setStok] = useState([]);

  //    API
  const getStok = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/detailbarang/get-stok-barang-all-gudang-groupby",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setStok(response.data);
      console.log(stok);
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
        Header: "Nama Gudang",
        accessor: "gudang",
        width: "12%",
        align: "left",
      },
      { Header: "Jumlah Stok Semua Barang", accessor: "total_stok", align: "center" },
      { Header: "Detail", accessor: "detail", align: "center" },
    ],

    rows: stok.map((item) => ({
      gudang: item.gudang.gudang_nama,
      total_stok: item.total_stok,
      detail: (
        <Link to={`/dashboard-admin/${item.gudang_id}`}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Detail
          </MDTypography>
        </Link>
      ),
    })),
  };
}
