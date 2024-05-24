import MDTypography from "components/MDTypography";

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import dayjs from "dayjs";

export default function data() {
  const accessToken = localStorage.getItem("access_token");
  const [approvalList, setApprovalList] = useState([]);

  //    API
  const getApprovalList = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/detailbarang/get-hbarang-masuk-all",
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
      { Header: "No. Nota", accessor: "hmasuk_nota", width: "12%", align: "left" },
      { Header: "No. Nota Supplier", accessor: "hmasuk_notasupplier", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
      { Header: "Pemberi Keputusan", accessor: "pengguna_action.pengguna_nama", align: "center" },
      { Header: "Comment", accessor: "hmasuk_comment", align: "center" },
      { Header: "Dibuat tanggal", accessor: "tanggal", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
      //   { Header: "Print Surat Jalan", accessor: "action_print", align: "center" },
    ],

    rows: approvalList.map((item) => ({
      hmasuk_nota: item.hmasuk_nota,
      tanggal: dayjs(item.created_at).format("DD-MM-YYYY"),
      hmasuk_notasupplier: item.hmasuk_notasupplier,
      pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama || "-" },
      pengguna_action: { pengguna_nama: item.pengguna_action?.pengguna_nama || "-" },
      hmasuk_comment: item.hmasuk_comment || "-",
      status:
        item.hmasuk_status === 2 ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Menunggu Approval" color="info" variant="gradient" size="sm" />
          </MDBox>
        ) : item.hmasuk_status === 1 ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Disetujui" color="success" variant="gradient" size="sm" />
          </MDBox>
        ) : (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Ditolak" color="warning" variant="gradient" size="sm" />
          </MDBox>
        ),
      action: (
        <Link to={`/list-detailbarang-masuk/${item.hmasuk_nota}`}>
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
