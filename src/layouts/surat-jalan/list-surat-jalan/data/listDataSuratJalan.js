import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
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
      const response = await axios.get("http://127.0.0.1:8000/api/suratjalan/get-surat-jalan-all", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

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
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
      { Header: "Diputus Oleh", accessor: "pengguna_action.pengguna_nama", align: "center" },
      { Header: "Comment", accessor: "suratjalan_comment", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: approvalList.map((item) => ({
      suratjalan_nota: item.suratjalan_nota,
      h_keluar: { hkeluar_nota: item.h_keluar?.hkeluar_nota },
      customer: {
        customer_nama: item.h_keluar?.customer?.customer_nama,
        customer_alamat: item.h_keluar?.customer?.customer_alamat,
      },
      gudang: {
        gudang_nama: item.h_keluar?.gudang?.gudang_nama,
      },
      suratjalan_tanggalkirim: dayjs(item.suratjalan_tanggalkirim).format("DD-MM-YYYY"),
      suratjalan_comment: item.suratjalan_comment || "-",
      status:
        item.suratjalan_status === 1
          ? "Ditolak"
          : item.suratjalan_status === 2
          ? "Menunggu Approval"
          : item.suratjalan_status === 3
          ? "Proses Pengiriman"
          : "Terkirim",
      pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama || "-" },
      pengguna_action: { pengguna_nama: item.pengguna_action?.pengguna_nama || "-" },
      action: (
        <Link to={`/detailsurat-jalan/${item.suratjalan_nota}`}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {item.suratjalan_status === 3 ? "Print" : "Detail"}
          </MDTypography>
        </Link>
      ),
    })),
  };
}
