import MDTypography from "components/MDTypography";

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [barang, setBarang] = useState([]);

  //    API
  const getBarang = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/barang/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setBarang(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  const handleDelete = async (barangId) => {
    if (window.confirm("Anda yakin ingin menghapus barang ini?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/barang/${barangId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        getBarang();
      } catch (error) {
        console.error("Terjadi kesalahan saat menghapus barang:", error);
      }
    }
  };
  //    End API

  useEffect(() => {
    getBarang();
  }, []);

  return {
    columns: [
      { Header: "Barang Id", accessor: "barang_id", width: "12%", align: "left" },
      { Header: "Barang Nama", accessor: "barang_nama", align: "center" },
      {
        Header: "Delete",
        accessor: "delete",
        width: "12%",
        align: "center",
      },
      {
        Header: "Edit",
        accessor: "edit",
        width: "12%",
        align: "center",
      },
    ],

    rows: barang.map((item) => ({
      barang_id: item.barang_id,
      barang_nama: item.barang_nama,
      delete: (
        <IconButton onClick={() => handleDelete(item.barang_id)} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      ),
    })),
  };
}
