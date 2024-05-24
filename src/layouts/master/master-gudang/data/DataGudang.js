import MDTypography from "components/MDTypography";

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [gudang, setGudang] = useState([]);

  //    API
  const getGudang = async () => {
    try {
      const response = await axios.get("https://api.tahupoosby.com/api/gudang", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setGudang(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  const handleDelete = async (gudangId) => {
    if (window.confirm("Anda yakin ingin menghapus barang ini?")) {
      try {
        await axios.delete(`https://api.tahupoosby.com/api/gudang/${gudangId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        getGudang();
      } catch (error) {
        console.error("Terjadi kesalahan saat menghapus barang:", error);
      }
    }
  };
  //    End API

  useEffect(() => {
    getGudang();
  }, []);

  return {
    columns: [
      { Header: "Nama Gudang", accessor: "gudang_nama", width: "12%", align: "left" },
      { Header: "Jenis Gudang", accessor: "jenis_gudang.jenis_gudang_nama", align: "center" },
      {
        Header: "Delete",
        accessor: "delete",
        width: "12%",
        align: "center",
      },
    ],

    rows: gudang.map((item) => ({
      gudang_nama: item.gudang_nama,
      jenis_gudang: { jenis_gudang_nama: item.jenis_gudang.jenis_gudang_nama },
      delete: (
        <IconButton onClick={() => handleDelete(item.gudang_id)} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      ),
    })),
  };
}
