import MDTypography from "components/MDTypography";

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [position, setPosition] = useState([]);

  //    API
  const getPositioning = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/positioning/get-positioning", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response.data);
      setPosition(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  const handleDelete = async (rack) => {
    if (window.confirm("Anda yakin ingin menghapus barang ini?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/positioning/delete-positioning/${rack}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        getPositioning();
      } catch (error) {
        console.error("Terjadi kesalahan saat menghapus barang:", error);
      }
    }
  };
  //    End API

  useEffect(() => {
    getPositioning();
  }, []);

  return {
    columns: [
      { Header: "Row Name", accessor: "get_rows.row_name", width: "12%", align: "left" },
      { Header: "Sel", accessor: "rack_bay", align: "center" },
      { Header: "Level", accessor: "rack_level", align: "center" },
      {
        Header: "Delete",
        accessor: "delete",
        width: "12%",
        align: "center",
      },
    ],

    rows: position.map((item) => ({
      get_rows: { row_name: item.get_rows.row_name },
      rack_bay: item.rack_bay,
      rack_level: item.rack_level,
      delete: (
        <IconButton onClick={() => handleDelete(item.rack_id)} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      ),
    })),
  };
}
