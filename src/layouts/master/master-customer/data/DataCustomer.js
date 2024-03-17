import MDTypography from "components/MDTypography";

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [customer, setCustomer] = useState([]);

  //    API
  const getCustomer = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/customer/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setCustomer(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data customer:", error);
    }
  };

  const handleDelete = async (customerID) => {
    if (window.confirm("Anda yakin ingin menghapus barang ini?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/customer/${customerID}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        getCustomer();
      } catch (error) {
        console.error("Terjadi kesalahan saat menghapus barang:", error);
      }
    }
  };
  //    End API

  useEffect(() => {
    getCustomer();
  }, []);

  return {
    columns: [
      { Header: "No. ", accessor: "index", width: "12%", align: "left" },
      { Header: "Customer Nama", accessor: "customer_nama", align: "center" },
      { Header: "Customer Telepon", accessor: "customer_telepon", align: "center" },
      { Header: "Customer Alamat", accessor: "customer_alamat", align: "center" },
      { Header: "Customer Gudang", accessor: "gudang", align: "center" },
      {
        Header: "Delete",
        accessor: "delete",
        width: "12%",
        align: "center",
      },
    ],

    rows: customer.map((item, index) => ({
      index: index + 1,
      customer_nama: item.customer_nama,
      customer_telepon: item.customer_telepon,
      customer_alamat: item.customer_alamat,
      gudang: item.gudang.gudang_nama,
      delete: (
        <IconButton onClick={() => handleDelete(item.customer_id)} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      ),
    })),
  };
}
